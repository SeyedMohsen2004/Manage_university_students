/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5235E8',
        secondary: '#E7E3FC', 
        dark_blue: '#0E0637', 
        dark_gray: '#131316',
        neutral_gray: '#717184'
      },
      screens: {
        '2xl': '1900px', 
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "5rem",
      }
    }
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
    }
  ],
}