export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024
// Longest side of a photo once uploaded
const PHOTO_MAX_PX = 1400

/** Check a chosen file is a photo we accept. Returns the problem, or null. */
export const photoProblem = (file: File): string | null => {
  if (!PHOTO_TYPES.includes(file.type)) return 'Choose a JPG, PNG or WebP photo'
  if (file.size > MAX_PHOTO_BYTES) return 'That photo is too large. Choose one under 15 MB'
  return null
}

/** Shrink a large photo in the browser so uploads stay quick. Returns a JPEG data URL. */
export const readPhoto = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, PHOTO_MAX_PX / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.88))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file could not be read as an image')) }
    img.src = url
  })
