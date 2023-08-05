/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      'monocode': ['Roboto Mono', 'monospace'],
      'poppin': ['Poppins', 'sans-serif']
    },
    extend: {
      textColor: {
        'gold': '#a5f3fc', // Replace with your desired color value
      },
    },
  },
  plugins: [],
}