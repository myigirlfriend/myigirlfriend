// Build-time renderer for the public pages. scripts/prerender.mjs calls render() for each route
// and writes the HTML, with the tags the page declared through useSeo, into its own file.
// The browser hydrates that HTML with the same tree (Root.tsx).
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { getLivePersonas, setImageMap, setLivePersonas } from '@config/personas'
import { SITE_URL, privateSeo, renderHead, takeCollectedSeo } from '@config/seo'
import { GUIDES } from '@/content/guides'
import type { PersonaRow } from '@/types'
import Root from './Root'

export { GUIDES, SITE_URL, getLivePersonas, privateSeo, renderHead, setImageMap, setLivePersonas }
export type { PersonaRow }

/** Where the build fetches the live companion list from. */
export const API_URL: string = import.meta.env.VITE_API_URL || ''

export function render(url: string) {
  const html = renderToString(<Root router={(children) => <StaticRouter location={url}>{children}</StaticRouter>} />)
  return { html, seo: takeCollectedSeo() }
}
