import { describe, expect, it } from 'vitest'
import { MAX_GALLERY, planGallery } from './gallery'

const A = 'https://cdn.example/personas/a.jpg'
const B = 'https://cdn.example/personas/b.jpg'
const NEW = 'data:image/jpeg;base64,AAAA'

describe('planGallery', () => {
  it('keeps existing photos and uploads new ones, in the requested order', () => {
    const plan = planGallery([B, NEW, A], [A, B])
    expect(plan.entries).toEqual([{ keep: B }, { upload: NEW }, { keep: A }])
    expect(plan.removed).toEqual([])
  })

  it('lists photos left out as removed', () => {
    expect(planGallery([A], [A, B]).removed).toEqual([B])
    expect(planGallery([], [A, B]).removed).toEqual([A, B])
  })

  it('refuses URLs that are not already in her gallery', () => {
    expect(() => planGallery(['https://elsewhere.example/x.jpg'], [A])).toThrow(/could not be found/)
  })

  it('refuses more than the maximum', () => {
    expect(() => planGallery(Array(MAX_GALLERY + 1).fill(NEW), [])).toThrow(/up to/)
  })

  it('refuses anything that is not a list of strings', () => {
    expect(() => planGallery('nope', [])).toThrow(/list of photos/)
    expect(() => planGallery([42], [])).toThrow(/URL or an image/)
  })
})
