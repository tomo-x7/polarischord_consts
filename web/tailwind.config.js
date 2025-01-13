//@ts-check
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {screens:{sp:{max:"480px"}}},
  },
  plugins: [],
}

