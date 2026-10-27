import { useEffect } from 'react'
import { applySeo, collectSeo, type PageSeo } from '@config/seo'
import { IS_SERVER } from '@utils/env'

/** Sets the page's title, description, canonical link, preview tags and structured data while it is shown. */
export function useSeo(seo: PageSeo) {
  // At build time the tags are written into the page's HTML instead
  if (IS_SERVER) collectSeo(seo)

  const key = JSON.stringify(seo)
  // The serialised description is the dependency, so a new object with the same content does nothing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => applySeo(seo), [key])
}
