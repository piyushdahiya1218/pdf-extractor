/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    screens: {
      'sm': {'min': '50px', 'max': '640px'},
      'md': {'min': '641px'},
      'lg': {'min': '1024px'}
    }
  },
  plugins: [],
}

