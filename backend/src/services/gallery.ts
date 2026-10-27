import { badRequest } from '../utils/httpError'

/** How many extra photos a model can have on top of her main photo. */
export const MAX_GALLERY = 8

export interface GalleryPlan {
  /** Existing photos to keep, and new ones to upload, in the requested order */
  entries: ({ keep: string } | { upload: string })[]
  /** Existing photos no longer in the gallery */
  removed: string[]
}

/**
 * Work out what to do with a requested gallery, without touching storage.
 * Only URLs already in her gallery can be kept, so the dashboard cannot point a model at an arbitrary site.
 */
export const planGallery = (requested: unknown, existing: string[]): GalleryPlan => {
  if (!Array.isArray(requested)) throw badRequest('The gallery must be a list of photos')
  if (requested.length > MAX_GALLERY) throw badRequest(`A model can have up to ${MAX_GALLERY} gallery photos`)

  const entries: GalleryPlan['entries'] = []
  for (const item of requested) {
    if (typeof item !== 'string') throw badRequest('Each gallery photo must be a URL or an image')
    if (item.startsWith('data:')) entries.push({ upload: item })
    else if (existing.includes(item)) entries.push({ keep: item })
    else throw badRequest('A gallery photo could not be found. Reload the page and try again')
  }
  const kept = new Set(entries.flatMap((e) => ('keep' in e ? [e.keep] : [])))
  return { entries, removed: existing.filter((url) => !kept.has(url)) }
}
