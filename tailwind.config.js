module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0b1120',
          800: '#0f172a',
          700: '#1a2332',
          600: '#1e293b',
          500: '#334155',
        },
        gold: {
          400: '#d4b76a',
          500: '#c8a951',
          600: '#b8993e',
        },
        slate: {
          350: '#b0bec5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
