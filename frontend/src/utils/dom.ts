/**
 * The `fetchpriority` attribute for an <img>. React 18 does not know the camelCase prop yet,
 * so it is passed through as the plain HTML attribute: <img {...fetchPriority('high')} />.
 */
export const fetchPriority = (priority: 'high' | 'low' | 'auto' | undefined): Record<string, string> =>
  priority ? { fetchpriority: priority } : {}
