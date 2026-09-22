/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['15px', { lineHeight: '1.45' }],
        'xs': ['16px', { lineHeight: '1.5' }],
        'sm': ['17px', { lineHeight: '1.55' }],
        'base': ['18px', { lineHeight: '1.6' }],
        'lg': ['20px', { lineHeight: '1.55' }],
        'xl': ['22px', { lineHeight: '1.4' }],
        '2xl': ['26px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.25' }],
        '4xl': ['40px', { lineHeight: '1.2' }],
        '5xl': ['52px', { lineHeight: '1.15' }],
        '6xl': ['64px', { lineHeight: '1.1' }],
        '7xl': ['76px', { lineHeight: '1.05' }],
      },
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
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        grotesk: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
