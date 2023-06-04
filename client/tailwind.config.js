/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Titillium Web", "sans-serif"],
        oi: ["Oi", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
}
