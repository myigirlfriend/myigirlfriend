import { initials } from '@utils/text'

interface GeneratedAvatarProps {
  name: string | undefined
  size?: number
}

/** A member's avatar: their initials on a colour and pattern derived from their name, so it is the same every time. */
export default function GeneratedAvatar({ name = '', size = 72 }: GeneratedAvatarProps) {
  const chars = name.split('')
  const hash = chars.reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)

  const hue = Math.abs(hash) % 360
  const background = `linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${(hue + 40) % 360}, 80%, 55%))`

  const shapes = chars.slice(0, 5).map((char, i) => {
    const code = char.charCodeAt(0)
    return {
      x: (code * (i + 1) * 13) % 80 + 10,
      y: (code * (i + 2) * 7) % 80 + 10,
      r: (code % 10) + 5,
    }
  })

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full shadow-brand ring-[3px] ring-brand-purple/40"
      style={{ width: size, height: size, background }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0" aria-hidden="true">
        {shapes.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={0.12 + i * 0.04} />
        ))}
        <polygon points="50,10 90,75 10,75" fill="white" opacity="0.07" />
        <circle cx="50" cy="50" r="28" fill="white" opacity="0.05" />
        <text x="50" y="58" textAnchor="middle" fill="white" fontSize="30" fontWeight="900" opacity="0.95">
          {initials(name)}
        </text>
      </svg>
    </div>
  )
}
