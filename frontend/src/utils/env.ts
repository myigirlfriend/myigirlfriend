/** True while rendering pages to HTML at build time, where there is no window or document. */
export const IS_SERVER = typeof window === 'undefined'

/**
 * True when this page arrived as prerendered HTML. Read once, before the app's first render replaces it.
 * What is already on screen then should not animate in a second time.
 */
export const PRERENDERED = !IS_SERVER && !!document.getElementById('root')?.firstElementChild

/** Skip entrance animations for content that is already visible when the app starts. */
export const SKIP_INTRO = IS_SERVER || PRERENDERED
