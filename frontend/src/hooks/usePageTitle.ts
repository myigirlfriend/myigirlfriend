import { useLocation } from 'react-router-dom'
import { privateSeo } from '@config/seo'
import { useSeo } from './useSeo'

/**
 * Titles a private screen (sign in, the member app, the team dashboard) as "<title> | myigirlfriend"
 * and keeps it out of search results. Public pages use useSeo with their own description instead.
 */
export function usePageTitle(title?: string | null) {
  const { pathname } = useLocation()
  useSeo(privateSeo(title, pathname))
}
