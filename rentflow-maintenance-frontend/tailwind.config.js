/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#edf7f1",
          100: "#dcefe2",
          200: "#c5e1ce",
          300: "#94c3a8",
          400: "#5a9e81",
          500: "#2d886c",
          600: "#176b5b",
          700: "#125746",
          800: "#174b3c",
          900: "#183e34",
          950: "#102c25",
        },
      },
    },
  },
  plugins: [],
};
