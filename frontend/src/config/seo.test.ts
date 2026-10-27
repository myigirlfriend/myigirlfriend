import { describe, expect, it } from 'vitest'
import { FAQ } from '@/content/faq'
import { GUIDES } from '@/content/guides'
import type { Persona } from '@/types'
import { PERSONAS } from './personas'
import {
  SITE_URL,
  aboutSeo,
  companionSeo,
  companionsSeo,
  fitDescription,
  fullTitle,
  guideSeo,
  guidesSeo,
  headTags,
  homeSeo,
  legalSeo,
  privateSeo,
  renderHead,
  type PageSeo,
} from './seo'

const longPersona: Persona = {
  ...PERSONAS[0]!,
  id: 'tatiana',
  name: 'Tatiana',
  tagline: 'Laid-back · Witty · Real',
  description: 'Nights in, good music and honest conversation. She says what she thinks and makes you laugh while she does, and she never pretends to be anyone else.',
}

// Every indexable page the site publishes
const pages: PageSeo[] = [
  homeSeo(FAQ),
  companionsSeo(PERSONAS),
  ...PERSONAS.map(companionSeo),
  companionSeo(longPersona),
  aboutSeo(),
  guidesSeo(GUIDES),
  ...GUIDES.map(guideSeo),
  legalSeo('Terms of Service', '/terms', 'The terms for using myigirlfriend, the AI girlfriend chat app: accounts, the 18+ age requirement, subscriptions, cancellations and acceptable use.'),
]

describe('public page tags', () => {
  it.each(pages.map((p) => [p.path, p]))('%s has a title Google shows in full', (_, seo) => {
    const title = fullTitle(seo)
    expect(title.length).toBeGreaterThanOrEqual(25)
    expect(title.length).toBeLessThanOrEqual(60)
  })

  it.each(pages.map((p) => [p.path, p]))('%s has a description of 100 to 160 characters', (_, seo) => {
    expect(seo.description.length).toBeGreaterThanOrEqual(100)
    expect(seo.description.length).toBeLessThanOrEqual(160)
  })

  it('gives every page its own title, description and canonical path', () => {
    const unique = (values: string[]) => new Set(values).size === values.length
    const real = pages.filter((p) => p.path !== '/companions/tatiana')
    expect(unique(real.map(fullTitle))).toBe(true)
    expect(unique(real.map((p) => p.description))).toBe(true)
    expect(unique(real.map((p) => p.path))).toBe(true)
  })

  it.each(pages.map((p) => [p.path, p]))('%s is indexable with an absolute canonical URL', (_, seo) => {
    const tags = headTags(seo)
    expect(tags.find((t) => t.attrs.rel === 'canonical')?.attrs.href).toBe(`${SITE_URL}${seo.path}`)
    expect(tags.find((t) => t.attrs.name === 'robots')?.attrs.content).toMatch(/^index, follow/)
  })

  it.each(pages.map((p) => [p.path, p]))('%s has valid structured data', (_, seo) => {
    expect(seo.jsonLd?.length).toBeGreaterThan(0)
    for (const data of seo.jsonLd ?? []) {
      const parsed = JSON.parse(JSON.stringify(data)) as { '@context': string; '@graph': { '@type': string }[] }
      expect(parsed['@context']).toBe('https://schema.org')
      expect(parsed['@graph'].every((node) => typeof node['@type'] === 'string')).toBe(true)
    }
  })
})

describe('the home page', () => {
  it('publishes every FAQ question as structured data', () => {
    const graph = (homeSeo(FAQ).jsonLd![0] as { '@graph': { '@type': string; mainEntity?: unknown[] }[] })['@graph']
    const faq = graph.find((n) => n['@type'] === 'FAQPage')
    expect(faq?.mainEntity).toHaveLength(FAQ.length)
  })

  it('targets the main search phrase in its title', () => {
    expect(fullTitle(homeSeo(FAQ)).toLowerCase()).toContain('ai girlfriend')
  })
})

describe('private screens', () => {
  it('are kept out of search results', () => {
    const tags = headTags(privateSeo('Sign in', '/login'))
    expect(tags.find((t) => t.attrs.name === 'robots')?.attrs.content).toBe('noindex, follow')
  })
})

describe('fitDescription', () => {
  it('adds the longest call to action that fits', () => {
    expect(fitDescription('Short bio.', ['A very long call to action. '.repeat(10), 'Chat free.'])).toBe('Short bio. Chat free.')
  })

  it('cuts a long text at a word boundary', () => {
    const result = fitDescription('word '.repeat(60))
    expect(result.length).toBeLessThanOrEqual(160)
    expect(result.endsWith('…')).toBe(true)
    expect(result).not.toMatch(/wor…$/)
  })
})

describe('renderHead', () => {
  it('escapes attribute values and cannot be broken out of with a script tag', () => {
    const html = renderHead({
      title: 'Quote " and <b>',
      description: 'Says "hi" & </script><script>alert(1)</script>',
      path: '/x',
      jsonLd: [{ '@context': 'https://schema.org', name: '</script><script>alert(1)</script>' }],
    })
    expect(html).not.toContain('</script><script>')
    expect(html).toContain('&quot;hi&quot;')
    expect(html).toContain('\\u003c/script>')
  })
})
