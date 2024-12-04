/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 2px 4px rgba(0, 0, 0, 0.16)",
      },
      colors: {
        "custom-red": "#BF1E2E",
        "steel-blue": "#353A5D",
        "medium-gray": "#777777",
        "soft-gray": "#DDDDDD",
        "light-gray": "#F9F9F9",
        "transparent-black": "#00000099",
      },
    },
  },
  plugins: [],
};
