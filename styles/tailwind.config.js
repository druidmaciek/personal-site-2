
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')


module.exports = {
  purge: {
    content: ['_site/**/*.html'],
    options: {
      safelist: [],
    },
  },
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite" 
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)"
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)"
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)"
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)"
          }
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {}
        }
      }),
      fontFamily: {
        sans: ['strawford', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.cyan,
        emerald: colors.emerald,
        brand: colors.emerald,
        gray: colors.blueGray,
        orange: colors.orange,
        rose: colors.rose,
        fuchsia: colors.fuchsia,
        teal: colors.teal
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    // require("@tailwindcss/forms")
  ],
}