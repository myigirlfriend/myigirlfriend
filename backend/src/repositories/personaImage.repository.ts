import { supabase } from '../config/supabase'
import { RepositoryError } from './base'

// Model photos live in a public Supabase Storage bucket.
const BUCKET = 'personas'

export const personaImageRepository = {
  /** Creates the bucket the first time a photo is uploaded. */
  async ensureBucket(): Promise<void> {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error && !/exist/i.test(error.message)) throw new RepositoryError(error)
  },

  /** Stores the file and returns its public URL. */
  async upload(path: string, file: Buffer, contentType: string): Promise<string> {
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType })
    if (error) throw new RepositoryError(error)
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  },

  async removeByUrl(url: string): Promise<void> {
    const path = url.split(`/${BUCKET}/`)[1]
    if (!path) return
    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) throw new RepositoryError(error)
  },
}
