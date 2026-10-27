import { describe, expect, it } from 'vitest'
import { styleFor } from '@/content/companionCopy'
import { resolvePersona, setImageMap } from '@config/personas'
import { initials, plural, traitSentence, traits } from './text'

describe('traits', () => {
  it('splits a tagline on dots, commas, slashes and bars', () => {
    expect(traits('Playful · Flirty · Bold')).toEqual(['Playful', 'Flirty', 'Bold'])
    expect(traits('calm, curious / kind | real')).toEqual(['calm', 'curious', 'kind', 'real'])
    expect(traits(null)).toEqual([])
  })
})

describe('traitSentence', () => {
  it('reads like a sentence', () => {
    expect(traitSentence('Playful · Flirty · Bold')).toBe('Playful, flirty and bold')
    expect(traitSentence('Sweet')).toBe('Sweet')
    expect(traitSentence('')).toBe('')
  })
})

describe('initials and plural', () => {
  it('work for normal and empty input', () => {
    expect(initials('Jane Doe')).toBe('JD')
    expect(initials('')).toBe('?')
    expect(plural(1, 'message')).toBe('1 message')
    expect(plural(3, 'message')).toBe('3 messages')
  })
})

describe('styleFor', () => {
  it('picks the profile copy that matches her personality', () => {
    expect(styleFor({ tone: 'playful, teasing, confident', tagline: '' }).starters[0]).toMatch(/trouble/)
    expect(styleFor({ tone: 'calm, intellectual, thoughtful', tagline: '' }).feel).toMatch(/question/)
    expect(styleFor({ tone: '', tagline: '' }).goodFor).toMatch(/friendly/)
  })
})

describe('resolvePersona', () => {
  it('uses the optimised copy of a photo when the build made one', () => {
    setImageMap({ 'https://cdn.example/a.jpg': '/img/companions/a.webp' })
    const p = resolvePersona({ id: 'nova', name: 'Nova', image_url: 'https://cdn.example/a.jpg', gallery: ['https://cdn.example/b.jpg'] })
    expect(p.image).toBe('/img/companions/a.webp')
    expect(p.gallery).toEqual(['https://cdn.example/b.jpg'])
    setImageMap({})
  })

  it('fills a built-in companion from the bundled data', () => {
    const p = resolvePersona({ id: 'zara' })
    expect(p.name).toBe('Zara')
    expect(p.image).toBeTruthy()
    expect(p.gallery).toEqual([])
  })
})
