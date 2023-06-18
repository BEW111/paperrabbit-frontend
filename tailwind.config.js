/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addBase, config }) {
      addBase({
        "input::-webkit-search-decoration": { display: "none" },
        "input::-webkit-search-cancel-button": { display: "none" },
        "input::-webkit-search-results-button": { display: "none" },
        "input::-webkit-search-results-decoration": { display: "none" },
      });
    },
    require("@tailwindcss/line-clamp"),
  ],
};
