import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
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

