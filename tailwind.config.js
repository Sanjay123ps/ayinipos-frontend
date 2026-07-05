/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        porcelain: '#FAF7F1',
        ink: '#1C2420',
        ledger: '#566359',
        mist: '#EDEAE2',
        emerald: {
          50: '#EAF4EE',
          100: '#CFE6D8',
          500: '#287A56',
          600: '#1F6F4F',
          700: '#16523A',
          900: '#0E3526',
        },
        turmeric: {
          50: '#FCF1DD',
          400: '#EFB75E',
          500: '#E8A33D',
          600: '#C9842A',
        },
        chili: {
          50: '#FBEAE7',
          500: '#D1483A',
          600: '#B53A2E',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28,36,32,0.04), 0 8px 24px -8px rgba(28,36,32,0.10)',
        lift: '0 4px 10px rgba(28,36,32,0.06), 0 16px 32px -12px rgba(31,111,79,0.18)',
      },
      borderRadius: {
        card: '18px',
      },
    },
  },
  plugins: [],
}
