/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0256B3",
          darkblue: "#013B7D",
          lightblue: "#E6F0FA",
          accent: "#FF4D00",
          navy: "#0F172A",
          cardBg: "#F8FAFC",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      }
    },
  },
  plugins: [],
}
