import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { FREE_PLAN, PAID_PLANS } from '@config/plans'
import type { Question } from '@/content/faq'
import type { Guide } from '@/content/guides'
import type { Persona } from '@/types'
import { traits } from '@utils/text'

// One description of every public page for search engines and link previews.
// The browser applies it with applySeo(); the build-time prerender writes the same tags into each page's HTML.

export const SITE_URL = 'https://myigirlfriend.com'
export const SITE_NAME = 'myigirlfriend'
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
export const SUPPORT_EMAIL = 'Customerservice@myigirlfriend.com'

export const SOCIAL_PROFILES = [
  'https://x.com/myigirlfriend',
  'https://www.tiktok.com/@myigirlfriend',
  'https://www.reddit.com/u/Myigirlfriend',
]

type JsonLd = Record<string, unknown>

export interface PageSeo {
  /** Without the site name; it is appended (except on the home page, whose title is complete) */
  title: string
  description: string
  /** Path from the site root, e.g. "/companions/zara" */
  path: string
  /** Absolute URL of the link preview image */
  image?: string
  imageAlt?: string
  /** Pages that should not appear in search results: sign in, the app, the dashboard */
  noindex?: boolean
  type?: 'website' | 'article' | 'profile'
  jsonLd?: JsonLd[]
}

export const absoluteUrl = (pathOrUrl: string): string =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`

export const fullTitle = (seo: Pick<PageSeo, 'title' | 'path'>): string =>
  seo.path === '/' ? seo.title : `${seo.title} | ${SITE_NAME}`

// ─── Structured data ──────────────────────────────────────────

const organization: JsonLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
  email: SUPPORT_EMAIL,
  sameAs: SOCIAL_PROFILES,
}

const website: JsonLd = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: ['my i girlfriend', 'My AI Girlfriend', 'myigirlfriend.com'],
  url: SITE_URL,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#organization` },
}

const prices = [FREE_PLAN, ...PAID_PLANS].map((p) => Number(p.price.replace(/[^0-9.]/g, '')))

const application: JsonLd = {
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/#app`,
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any (web browser)',
  description: 'AI girlfriend chat app with companions who have their own personalities and remember you.',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: Math.min(...prices).toFixed(2),
    highPrice: Math.max(...prices).toFixed(2),
    offerCount: prices.length,
  },
  publisher: { '@id': `${SITE_URL}/#organization` },
}

const graph = (...nodes: JsonLd[]): JsonLd => ({ '@context': 'https://schema.org', '@graph': nodes })

const breadcrumbs = (items: { name: string; path: string }[]): JsonLd => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

/**
 * A meta description of at most 160 characters (what Google shows in full): the first part always,
 * the call to action only if it fits, cut at a word boundary as a last resort.
 */
export const fitDescription = (main: string, ctas: string[] = [], max = 160): string => {
  const text = main.trim()
  // The longest call to action that still fits
  for (const cta of ctas) if (`${text} ${cta}`.length <= max) return `${text} ${cta}`
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`
}

// ─── Pages ────────────────────────────────────────────────────

export const homeSeo = (faq: Question[]): PageSeo => ({
  title: 'AI Girlfriend Chat, Free to Start | myigirlfriend',
  description: `Meet your AI girlfriend. Swipe through companions with real personalities, match and start chatting in seconds. She remembers you. First ${FREE_MESSAGE_LIMIT} messages free.`,
  path: '/',
  jsonLd: [
    graph(organization, website, application, {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    }),
  ],
})

export const companionsSeo = (personas: Persona[]): PageSeo => ({
  title: 'Meet Our AI Girlfriends: Chat Free',
  description: `Browse every AI girlfriend on myigirlfriend: ${personas.slice(0, 4).map((p) => p.name).join(', ')} and more. Each has her own personality. Chat free with any of them.`,
  path: '/companions',
  jsonLd: [
    graph(
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/companions#page`,
        name: 'AI girlfriends to chat with',
        url: `${SITE_URL}/companions`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: personas.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/companions/${p.id}`,
            name: p.name,
          })),
        },
      },
      breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Companions', path: '/companions' }]),
    ),
  ],
})

export const companionSeo = (persona: Persona): PageSeo => {
  const firstTrait = traits(persona.tagline)[0]
  const path = `/companions/${persona.id}`
  const images = [persona.image, ...persona.gallery].filter((src): src is string => !!src).map(absoluteUrl)
  return {
    // "Chat with Zara: Playful AI Girlfriend", short enough to show in full in search results
    title: `Chat with ${persona.name}: ${firstTrait ? `${firstTrait[0]!.toUpperCase()}${firstTrait.slice(1).toLowerCase()} ` : ''}AI Girlfriend`,
    description: fitDescription(
      persona.description || `Meet ${persona.name}, an AI girlfriend with her own personality.`,
      [
        `Chat with ${persona.name} free on myigirlfriend: first ${FREE_MESSAGE_LIMIT} messages on us.`,
        `Chat with ${persona.name} free on myigirlfriend.`,
        'Chat free on myigirlfriend.',
      ],
    ),
    path,
    image: images[0],
    imageAlt: `${persona.name}, an AI girlfriend on myigirlfriend`,
    type: 'profile',
    jsonLd: [
      graph(
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}${path}#page`,
          name: `Chat with ${persona.name}, AI girlfriend`,
          url: `${SITE_URL}${path}`,
          description: persona.description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          ...(images.length > 0 && { primaryImageOfPage: { '@type': 'ImageObject', url: images[0] }, image: images }),
        },
        breadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Companions', path: '/companions' },
          { name: persona.name, path },
        ]),
      ),
    ],
  }
}

export const guidesSeo = (guides: Guide[]): PageSeo => ({
  title: 'AI Girlfriend Guides and Tips',
  description: 'Plain-English guides to AI girlfriends: how they work, choosing a free AI girlfriend app and how to practise flirting with AI.',
  path: '/guides',
  jsonLd: [
    graph(
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/guides#page`,
        name: 'AI girlfriend guides',
        url: `${SITE_URL}/guides`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: guides.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/guides/${g.slug}`, name: g.title })),
        },
      },
      breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }]),
    ),
  ],
})

export const guideSeo = (guide: Guide): PageSeo => {
  const path = `/guides/${guide.slug}`
  return {
    title: guide.metaTitle,
    description: guide.description,
    path,
    type: 'article',
    jsonLd: [
      graph(
        {
          '@type': 'Article',
          '@id': `${SITE_URL}${path}#article`,
          headline: guide.title,
          description: guide.description,
          url: `${SITE_URL}${path}`,
          mainEntityOfPage: `${SITE_URL}${path}`,
          image: DEFAULT_IMAGE,
          datePublished: guide.published,
          dateModified: guide.updated,
          inLanguage: 'en',
          author: { '@id': `${SITE_URL}/#organization` },
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        organization,
        breadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: guide.title, path },
        ]),
      ),
    ],
  }
}

export const legalSeo = (title: string, path: string, description: string): PageSeo => ({
  title,
  description,
  path,
  jsonLd: [
    graph(
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${path}#page`,
        name: title,
        url: `${SITE_URL}${path}`,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      organization,
      breadcrumbs([{ name: 'Home', path: '/' }, { name: title, path }]),
    ),
  ],
})

export const aboutSeo = (): PageSeo => ({
  title: 'About Us: The AI Girlfriend App',
  description: 'Who we are, how myigirlfriend works, how your AI girlfriend remembers you, and the rules we keep: adults only, always tasteful, cancel any time.',
  path: '/about',
  jsonLd: [
    graph(
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/about#page`,
        name: 'About myigirlfriend',
        url: `${SITE_URL}/about`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      organization,
      breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]),
    ),
  ],
})

/** Sign in, the member app and the team dashboard: useful pages, but not search results. */
export const privateSeo = (title: string | null | undefined, path: string): PageSeo => ({
  title: title || 'AI Girlfriend Chat',
  description: 'Chat with your AI girlfriend on myigirlfriend.',
  path,
  noindex: true,
})

// ─── Applying the tags ────────────────────────────────────────

interface HeadTag {
  tag: 'meta' | 'link'
  attrs: Record<string, string>
}

/** Every tag a page needs in its head, besides the title and the structured data. */
export const headTags = (seo: PageSeo): HeadTag[] => {
  const url = absoluteUrl(seo.path)
  const title = fullTitle(seo)
  const image = seo.image ? absoluteUrl(seo.image) : DEFAULT_IMAGE
  const tags: HeadTag[] = [
    { tag: 'meta', attrs: { name: 'description', content: seo.description } },
    { tag: 'meta', attrs: { name: 'robots', content: seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1' } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:type', content: seo.type ?? 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'en_US' } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', attrs: { property: 'og:description', content: seo.description } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: seo.imageAlt ?? 'myigirlfriend: meet your AI girlfriend' } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:site', content: '@myigirlfriend' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: seo.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  ]
  if (!seo.image) {
    tags.push({ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } })
    tags.push({ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } })
  }
  return tags
}

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// JSON inside <script> must not be able to close the tag
const escapeJson = (json: string) => json.replace(/</g, '\\u003c')

/** The head as HTML, for the build-time prerender. */
export const renderHead = (seo: PageSeo): string =>
  [
    `<title>${escapeAttr(fullTitle(seo))}</title>`,
    ...headTags(seo).map(({ tag, attrs }) =>
      `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${escapeAttr(v)}"`).join(' ')} data-seo>`),
    ...(seo.jsonLd ?? []).map((data) => `<script type="application/ld+json" data-seo>${escapeJson(JSON.stringify(data))}</script>`),
  ].join('\n    ')

// During the build-time prerender there is no document: the page's tags are collected instead
let collected: PageSeo | null = null

/** Called while rendering on the server; the last page to declare its tags wins. */
export const collectSeo = (seo: PageSeo): void => { collected = seo }

/** The tags the page just rendered on the server declared, then forget them. */
export const takeCollectedSeo = (): PageSeo | null => {
  const seo = collected
  collected = null
  return seo
}

/** Apply a page's tags in the browser, replacing those of the previous page. */
export const applySeo = (seo: PageSeo): void => {
  if (typeof document === 'undefined') return
  document.title = fullTitle(seo)
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
  for (const { tag, attrs } of headTags(seo)) {
    const el = document.createElement(tag)
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    el.setAttribute('data-seo', '')
    document.head.appendChild(el)
  }
  for (const data of seo.jsonLd ?? []) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    script.setAttribute('data-seo', '')
    document.head.appendChild(script)
  }
}
