/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f7f4',
          100: '#e0ebe5',
          200: '#c1d7cc',
          300: '#9cbcaa',
          400: '#739c85',
          500: '#2F6B48',
          600: '#25543a',
          700: '#1e432e',
          800: '#183524',
          900: '#132b1d',
        },
        earth: {
          50: '#faf6f3',
          100: '#f2ebe4',
          200: '#e5d5c5',
          300: '#d3b69d',
          400: '#c19474',
          500: '#8B5E34',
          600: '#6f4b2a',
          700: '#593c22',
          800: '#472f1b',
          900: '#3a2716',
        },
        sage: {
          50: '#f7f9f7',
          100: '#e9efe9',
          200: '#d2dfd2',
          300: '#b0c5b0',
          400: '#86a286',
          500: '#5F7A5F',
          600: '#4c624c',
          700: '#3d4e3d',
          800: '#313e31',
          900: '#283228',
        }
      }
    },
  },
  plugins: [],
}
