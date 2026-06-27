module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx,vue}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        krabo: {
          primary: "#880a0a",
          "primary-dark": "#6b0506",
          accent: "#ff8c00",
          "bg-light": "#fefaf5",
          "text-dark": "#2d2d2d",
          "text-light": "#666666",
        },
      },
    },
  },
  plugins: [],
};
