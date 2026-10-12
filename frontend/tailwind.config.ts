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
          dark: color('dark'),
          surface: color('surface'),
          card: color('card'),
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
        'brand-gradient-soft': 'var(--gradient-brand-soft)',
        'page-glow': 'var(--gradient-page)',
      },
      boxShadow: {
        'brand': 'var(--shadow-brand)',
        'brand-lg': 'var(--shadow-brand-lg)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
