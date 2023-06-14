/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral: "#440381",
      },
      fontFamily: {
        montserrat: ["Titillium Web", "sans-serif"],
        oi: ["Oi", "cursive"],
      },
      keyframes: {
        bg: {
          "0%, 100%": { background: "#a991f7" },
          "50%": { background: "#37cdbe" },
        },
      },
      animation: {
        bg: "bg 8s linear infinite",
      },
    },
  },
  plugins: [require("daisyui")],
}
