/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F3F0',
        dark: '#1A1A1A',
        gray: '#6B7280',
      },
    },
  },
  plugins: [],
}
