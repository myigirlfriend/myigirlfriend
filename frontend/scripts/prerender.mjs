// Writes every public page as finished HTML, plus the sitemap, after `vite build`.
//
// Search engines and link previews read the HTML a URL returns. A client-only React app returns an empty
// <div id="root"> with the same title everywhere, so each public route is rendered here with the same
// React code the browser runs, and saved with its own title, description, canonical link and structured data.
//
// Output (served by Vercel with cleanUrls, see vercel.json):
//   dist/index.html, dist/companions.html, dist/companions/<id>.html, dist/guides.html, dist/guides/<slug>.html,
//   dist/terms.html, dist/privacy.html, dist/404.html, dist/app.html (shell for the signed-in app), dist/sitemap.xml
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Render with React's production build, as the browser does
process.env.NODE_ENV ||= 'production'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const serverDir = join(root, 'dist-server')

const server = await import(pathToFileURL(join(serverDir, 'entry-server.js')).href)
// The Latin subset of the font is needed for the first paint; preloading it stops the text reflowing when it arrives
const font = readdirSync(join(dist, 'assets')).find((f) => /^figtree-latin-wght-normal-.*\.woff2$/.test(f))
const fontPreload = font ? `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin>\n    ` : ''
if (!font) console.warn('[prerender] Figtree latin font file not found; it will not be preloaded')
const template = readFileSync(join(dist, 'index.html'), 'utf8').replace('<!--seo:start-->', `${fontPreload}<!--seo:start-->`)

// ─── The companions to build pages for ────────────────────────
// The live list from the API, so models added in the dashboard get their own page on the next deploy.
// If the API cannot be reached the build still succeeds with the built-in companions.
async function loadPersonas() {
  const url = `${server.API_URL.replace(/\/$/, '')}/api/personas/public`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data.personas) || data.personas.length === 0) throw new Error('empty list')
    console.log(`[prerender] ${data.personas.length} companions from ${url}`)
    return data.personas
  } catch (error) {
    console.warn(`[prerender] Could not load companions from ${url} (${error.message}); using the built-in ones`)
    return null
  }
}

const rows = await loadPersonas()

// ─── Companion photos ─────────────────────────────────────────
// Photos uploaded in the dashboard are stored full size on Supabase. Each is saved here as an 800px-wide WebP
// on our own domain, which is several times smaller and needs no extra connection; the map tells the app which
// copy belongs to which original. If sharp or the download fails, the original URL is simply kept.
async function optimizeImages(list) {
  const map = {}
  let sharp
  try { sharp = (await import('sharp')).default } catch { console.warn('[prerender] sharp not available; companion photos are not optimised'); return map }
  const urls = [...new Set(list.flatMap((r) => [r.image_url, ...(r.gallery ?? [])]).filter((u) => /^https?:\/\//.test(u ?? '')))]
  mkdirSync(join(dist, 'img', 'companions'), { recursive: true })
  await Promise.all(urls.map(async (url) => {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const input = Buffer.from(await res.arrayBuffer())
      const name = `${createHash('sha1').update(url).update(input).digest('hex').slice(0, 12)}.webp`
      await sharp(input).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(dist, 'img', 'companions', name))
      map[url] = `/img/companions/${name}`
    } catch (error) {
      console.warn(`[prerender] Could not optimise ${url} (${error.message})`)
    }
  }))
  console.log(`[prerender] ${Object.keys(map).length} of ${urls.length} companion photos optimised`)
  return map
}

const imageMap = rows ? await optimizeImages(rows) : {}
server.setImageMap(imageMap)
if (rows) server.setLivePersonas(rows)
const personas = server.getLivePersonas()

// ─── Pages ────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10)

const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/companions', priority: '0.9', changefreq: 'weekly' },
  ...personas.map((p) => ({
    path: `/companions/${p.id}`,
    priority: '0.8',
    changefreq: 'weekly',
    images: [p.image, ...(p.gallery ?? [])].filter(Boolean),
    name: p.name,
  })),
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/guides', priority: '0.7', changefreq: 'monthly' },
  ...server.GUIDES.map((g) => ({ path: `/guides/${g.slug}`, priority: '0.7', changefreq: 'monthly', lastmod: g.updated })),
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
]

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const absolute = (src) => (/^https?:\/\//.test(src) ? src : `${server.SITE_URL}${src}`)

// The browser starts from the same companion list the HTML was built with
const appData = rows
  ? `<script>window.__PERSONAS__=${JSON.stringify(rows).replace(/</g, '\\u003c')};window.__IMAGES__=${JSON.stringify(imageMap).replace(/</g, '\\u003c')}</script>`
  : ''

// Companion photos added in the dashboard live on another host (Supabase storage): open that connection early
const imageOrigins = [...new Set(personas.map((p) => p.image).filter((src) => /^https?:\/\//.test(src ?? '')).map((src) => new URL(src).origin))]
const preconnects = imageOrigins.map((origin) => `<link rel="preconnect" href="${origin}">`).join('\n    ')

// The home page's largest pictures: the hero photo and the first card of the swipe deck
function homePreloads(html) {
  const hero = html.match(/<img[^>]*srcSet="([^"]+)"[^>]*src="([^"]+)"|<img[^>]*src="([^"]+)"[^>]*srcSet="([^"]+)"/)
  const deck = personas.find((p) => p.image)?.image
  const links = []
  if (hero) {
    const srcset = hero[1] ?? hero[4]
    const src = hero[2] ?? hero[3]
    links.push(`<link rel="preload" as="image" href="${src}" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high">`)
  }
  if (deck) links.push(`<link rel="preload" as="image" href="${deck}">`)
  return links.join('\n    ')
}

function page({ head, html = '', preload = '' }) {
  const start = template.indexOf('<!--seo:start-->')
  const end = template.indexOf('<!--seo:end-->') + '<!--seo:end-->'.length
  if (start < 0 || end < start) throw new Error('index.html is missing the <!--seo:start--> / <!--seo:end--> markers')
  return (template.slice(0, start) + [preconnects, preload, head].filter(Boolean).join('\n    ') + template.slice(end))
    .replace('<!--app-data-->', appData)
    .replace('<!--app-html-->', html)
}

function write(path, contents) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, `${path.replace(/^\//, '')}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, contents)
  return file
}

const problems = []
for (const route of ROUTES) {
  const { html, seo } = server.render(route.path)
  if (!seo) { problems.push(`${route.path}: the page did not declare its tags with useSeo`); continue }
  if (seo.noindex) problems.push(`${route.path}: rendered as noindex (a missing page?)`)
  if (seo.path !== route.path) problems.push(`${route.path}: canonical path is ${seo.path}`)
  // The profile photo is the largest thing on a companion's page
  const preload = route.path === '/' ? homePreloads(html) : route.images?.[0] ? `<link rel="preload" as="image" href="${route.images[0]}" fetchpriority="high">` : ''
  write(route.path, page({ head: server.renderHead(seo), html, preload }))
}

// Unknown URLs: Vercel serves this with a real 404 status
{
  const { html, seo } = server.render('/__not-found__')
  write('/404', page({ head: server.renderHead({ ...seo, path: '/404' }), html }))
}

// The signed-in app and the dashboard render in the browser; their shell stays out of search results
write('/app', page({ head: server.renderHead(server.privateSeo('AI Girlfriend Chat', '/app')) }))

// ─── Sitemap ──────────────────────────────────────────────────
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${ROUTES.map((r) => `  <url>
    <loc>${escapeHtml(`${server.SITE_URL}${r.path === '/' ? '/' : r.path}`)}</loc>
    <lastmod>${r.lastmod ?? today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>${(r.images ?? []).map((src) => `
    <image:image><image:loc>${escapeHtml(absolute(src))}</image:loc></image:image>`).join('')}
  </url>`).join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)

rmSync(serverDir, { recursive: true, force: true })

if (problems.length) {
  console.error(`[prerender] ${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`[prerender] ${ROUTES.length} pages, 404, app shell and sitemap.xml written`)
