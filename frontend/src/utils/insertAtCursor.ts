/**
 * Insert text where the cursor is in an input or textarea (replacing any selection),
 * then put the cursor after it. Returns the new value for the controlled input.
 */
export const insertAtCursor = (el: HTMLInputElement | HTMLTextAreaElement | null, value: string, text: string): string => {
  const start = el?.selectionStart ?? value.length
  const end = el?.selectionEnd ?? value.length
  const next = value.slice(0, start) + text + value.slice(end)
  if (el) {
    const caret = start + text.length
    // After React has rendered the new value
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(caret, caret)
    })
  }
  return next
}
