export const startOfToday = (): Date => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Whole minutes between two ISO timestamps. */
export const minutesBetween = (fromIso: string, toIso: string): number =>
  Math.floor((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60000)
