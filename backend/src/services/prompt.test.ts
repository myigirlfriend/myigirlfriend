import { describe, expect, it } from 'vitest'
import { buildSystemPrompt, cleanReply, describeMemory, parseSuggestions, recentOpenings, voiceFor } from './prompt'

describe('voiceFor', () => {
  it('matches a playful companion to the teasing voice', () => {
    expect(voiceFor({ id: 'x', tone: 'playful, teasing, confident' })).toMatch(/Tease/)
  })

  it('matches a casual companion to relaxed texting', () => {
    expect(voiceFor({ id: 'x', tone: 'casual, funny, chill' })).toMatch(/lowercase/)
  })

  it('reads the tagline too', () => {
    expect(voiceFor({ id: 'x', tagline: 'Gentle · Romantic · Sweet' })).toMatch(/affectionate/i)
  })

  it('falls back to a neutral voice', () => {
    expect(voiceFor({ id: 'x', tone: 'mysterious' })).toMatch(/real person texts/)
  })
})

describe('buildSystemPrompt', () => {
  it('uses the prompt written in the dashboard before the built-in one', () => {
    const prompt = buildSystemPrompt({ persona: { id: 'zara', prompt: 'You are Custom Zara.' } })
    expect(prompt).toContain('You are Custom Zara.')
    expect(prompt).not.toContain('playful and flirtatious')
  })

  it('uses the built-in description for the original companions', () => {
    expect(buildSystemPrompt({ persona: 'elena' })).toContain('You are Elena')
  })

  it('describes a dashboard model from her fields when she has no prompt', () => {
    const prompt = buildSystemPrompt({ persona: { id: 'nova', name: 'Nova', tone: 'bubbly, goofy', description: 'Loves karaoke.' } })
    expect(prompt).toContain('You are Nova')
    expect(prompt).toContain('bubbly, goofy')
    expect(prompt).toContain('Loves karaoke.')
  })

  it('always includes the texting rules', () => {
    const prompt = buildSystemPrompt({ persona: 'maya' })
    expect(prompt).toContain('You are texting, not writing')
    expect(prompt).toContain('anything explicit is not')
  })

  it('includes what she remembers, phrased as facts to use naturally', () => {
    const prompt = buildSystemPrompt({ persona: 'maya', memory: [{ key: 'name', value: 'Jordan' }, { key: 'job', value: 'nurse' }] })
    expect(prompt).toContain('Their name is Jordan.')
    expect(prompt).toContain('Their job: nurse.')
  })

  it('asks her not to repeat how she opened recent messages', () => {
    const prompt = buildSystemPrompt({
      persona: 'zara',
      history: [
        { sender: 'user', content: 'hey' },
        { sender: 'ai', content: 'Well well well, look who it is' },
      ],
    })
    expect(prompt).toContain('"Well well well, look"')
    expect(prompt).toContain('Start differently')
  })

  it('marks the start of a new conversation', () => {
    expect(buildSystemPrompt({ persona: 'zara' })).toContain('very start of your conversation')
  })
})

describe('describeMemory', () => {
  it('skips empty values and labels unknown keys readably', () => {
    expect(describeMemory([{ key: 'name', value: ' ' }, { key: 'pet_name', value: 'Biscuit' }])).toBe('pet name: Biscuit.')
  })
})

describe('recentOpenings', () => {
  it('takes the first words of her last messages only', () => {
    const openings = recentOpenings([
      { sender: 'user', content: 'what are you doing' },
      { sender: 'ai', content: 'Just made tea and thinking about you' },
      { sender: 'operator', content: 'Okay so here is the thing' },
    ])
    expect(openings).toEqual(['Just made tea and', 'Okay so here is'])
  })
})

describe('cleanReply', () => {
  it('removes quotes around the whole reply and a name prefix', () => {
    expect(cleanReply('Zara: "Missed me?"', 'Zara')).toBe('Missed me?')
  })

  it('strips markdown and list markers', () => {
    expect(cleanReply('**Okay** so\n- first\n- second')).toBe('Okay so first second')
  })

  it('removes assistant phrases', () => {
    expect(cleanReply("As an AI, I can't eat. But I'd love to hear about dinner! How can I help you today?")).toBe(
      "But I'd love to hear about dinner!",
    )
  })

  it('keeps at most three sentences, with their emoji', () => {
    expect(cleanReply('One. Two! Three? 😏 Four. Five.')).toBe('One. Two! Three? 😏')
  })

  it('leaves a normal text alone', () => {
    expect(cleanReply('okay but that is actually hilarious 😂')).toBe('okay but that is actually hilarious 😂')
  })
})

describe('parseSuggestions', () => {
  it('reads a JSON array, even inside a code fence', () => {
    expect(parseSuggestions('```json\n["Hey you", "Missed me?", "Tell me more"]\n```')).toEqual(['Hey you', 'Missed me?', 'Tell me more'])
  })

  it('keeps at most three', () => {
    expect(parseSuggestions('["a","b","c","d"]')).toHaveLength(3)
  })

  it('falls back to the whole text as one suggestion', () => {
    expect(parseSuggestions('Just say hi back')).toEqual(['Just say hi back'])
  })

  it('returns nothing for an empty answer', () => {
    expect(parseSuggestions('   ')).toEqual([])
  })
})
