/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-marble': '#052ec0',
      },
    },
  },
  plugins: [],
}

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        blueMarble: {
          primary: '#052ce0',
          dark: '#000919',
        }
      }
    }
  }
}
