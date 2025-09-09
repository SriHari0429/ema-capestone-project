/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government Portal Theme
        "gov-bg": "#f4f6f9",       // light background
        "gov-primary": "#003366",  // dark blue (header/nav)
        "gov-secondary": "#006699", // lighter blue (buttons/highlights)
        "gov-accent": "#ffcc00",   // yellow accent (important highlights)
        "gov-text": "#222222",     // main text color
        "gov-ink": "#111111",       // strong ink-like text
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"], // clean govt font
      },
    },
  },
  plugins: [],
}
