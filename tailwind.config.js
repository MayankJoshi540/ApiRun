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
          accent: 'rgba(99, 102, 241, 0.3)'
        },
        accent: {
          DEFAULT: '#10b981',
          emerald: '#10b981',
          primary: '#059669',
          pine: '#047857',
          mint: '#34d399',
          sky: '#38bdf8',
          amber: '#f59e0b',
          rose: '#f43f5e',
          dark: '#064e3b',
          subtle: '#065f46'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Fira Code', 'Cascadia Code', 'monospace']
      }
    },
  },
  plugins: [],
}
