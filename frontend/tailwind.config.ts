import type { Config } from 'tailwindcss'

// Token values live in src/index.css (:root). This file only maps them to utility names.
const color = (name: string) => `rgb(var(--color-brand-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: color('purple'),
          pink: color('pink'),
          rose: color('rose'),
          plum: color('plum'),
          'plum-2': color('plum-2'),
          'plum-3': color('plum-3'),
          dark: color('dark'),
          surface: color('surface'),
          card: color('card'),
          raised: color('raised'),
          border: color('border'),
          muted: color('muted'),
          subtle: color('subtle'),
          text: color('text'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      backgroundImage: {
        'brand-gradient': 'var(--gradient-brand)',
      },
    },
  },
  plugins: [],
} satisfies Config
