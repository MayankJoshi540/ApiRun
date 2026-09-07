/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#08090c',
          surface: '#0d0f14',
          card: '#12161f',
          elevated: '#171c26',
          highlight: '#1e2430'
        },
        border: {
          subtle: '#1b202a',
          main: '#262d3a',
          light: '#374151',
          accent: 'rgba(16, 185, 129, 0.35)'
        },
        accent: {
          DEFAULT: '#10b981',
          emerald: '#10b981',
          bright: '#34d399',
          glow: 'rgba(16, 185, 129, 0.12)',
          dark: '#064e3b',
          subtle: '#022c22'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SFMono-Regular', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
