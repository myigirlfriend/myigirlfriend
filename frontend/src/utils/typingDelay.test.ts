import { describe, expect, it } from 'vitest'
import { MAX_PAUSE_MS, readingPause, typingDuration } from './typingDelay'

// A fixed sequence of "random" numbers, for predictable tests
const sequence = (...values: number[]) => { let i = 0; return () => values[i++ % values.length]! }

describe('readingPause', () => {
  it('is sometimes instant, sometimes a moment, sometimes a few seconds', () => {
    expect(readingPause(sequence(0.1, 0.5))).toBeLessThanOrEqual(400)
    const moment = readingPause(sequence(0.5, 0.5))
    expect(moment).toBeGreaterThanOrEqual(800)
    expect(moment).toBeLessThanOrEqual(2200)
    expect(readingPause(sequence(0.9, 0.5))).toBeGreaterThanOrEqual(2500)
  })

  it('never waits longer than the maximum', () => {
    for (let i = 0; i < 2000; i++) expect(readingPause()).toBeLessThanOrEqual(MAX_PAUSE_MS)
    expect(readingPause(sequence(0.99, 0.99))).toBeLessThanOrEqual(MAX_PAUSE_MS)
  })

  it('varies from one message to the next', () => {
    const pauses = new Set(Array.from({ length: 50 }, () => readingPause()))
    expect(pauses.size).toBeGreaterThan(20)
  })
})

describe('typingDuration', () => {
  const steady = () => 0.5 // no jitter

  it('is shorter for short replies and longer for long ones', () => {
    expect(typingDuration(10, steady)).toBeLessThan(typingDuration(60, steady))
    expect(typingDuration(60, steady)).toBeLessThan(typingDuration(120, steady))
  })

  it('shows the dots long enough to notice, and never long enough to bore', () => {
    expect(typingDuration(0, steady)).toBe(1200)
    expect(typingDuration(2000, steady)).toBe(6000)
    for (let i = 0; i < 1000; i++) {
      const ms = typingDuration(Math.floor(Math.random() * 400))
      expect(ms).toBeGreaterThanOrEqual(1200)
      expect(ms).toBeLessThanOrEqual(6000)
    }
  })
})
