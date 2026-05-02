/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#9B59B6',
          pink: '#E91E8C',
          dark: '#0a0a0a',
          surface: '#111111',
          card: '#1a1a1a',
          border: '#2a2a2a',
          muted: '#6b7280',
          text: '#f9fafb',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #9B59B6, #E91E8C)',
        'brand-gradient-r': 'linear-gradient(270deg, #9B59B6, #E91E8C)',
      },
      boxShadow: {
        'brand': '0 0 20px rgba(155, 89, 182, 0.3)',
        'brand-lg': '0 0 40px rgba(233, 30, 140, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-sm': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
}
