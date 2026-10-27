import { useEffect } from 'react'

const SITE = 'myigirlfriend'
const HOME_TITLE = `${SITE}: Someone to talk to. Always.`

/** Sets the browser tab title to "<title> · myigirlfriend" while the component is mounted. */
export function usePageTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : HOME_TITLE
    return () => { document.title = HOME_TITLE }
  }, [title])
}
