/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1B5E44", // The dark green background
          button: "#006B44", // The primary action color
          light: "#E9F2EF", // Used for the "I need a worker" selection
        },
      },
    },
  },
  plugins: [],
}