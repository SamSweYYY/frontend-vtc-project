module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#070a12',
          800: '#0d111c',
          700: '#151b2b',
          600: '#222a3c',
          500: '#364156',
        },
        gold: {
          400: '#67e8f9',
          500: '#22d3ee',
          600: '#0891b2',
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
