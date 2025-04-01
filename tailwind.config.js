/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rowing-blue': '#1E3A8A',
        'rowing-light': '#93C5FD',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}