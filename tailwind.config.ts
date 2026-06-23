import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F2EA",
        surface: "#FFFFFF",
        ink: "#1B1714",
        muted: "#8A8178",
        faint: "#A89F94",
        // South Sudan flag palette — also semantic roles in the UI
        red: "#CE3B33", // like / alerts
        green: "#2E7D54", // accent / online
        gold: "#D8A33B", // signature star
        "gold-active": "#C9962E", // active tab
        blue: "#1E3A6B", // profile hero
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-hanken)", "sans-serif"],
      },
      borderRadius: {
        card: "26px",
        sheet: "30px",
        screen: "42px",
        button: "18px",
        input: "14px",
        pill: "23px",
      },
      boxShadow: {
        card: "0 20px 44px -16px rgba(27,23,20,0.5)",
        "btn-pass": "0 8px 18px -8px rgba(27,23,20,0.35)",
        "btn-star": "0 10px 20px -8px rgba(216,163,59,0.7)",
        "btn-like": "0 10px 22px -8px rgba(206,59,51,0.7)",
        sheet: "0 -20px 50px -20px rgba(0,0,0,0.4)",
        device: "0 50px 90px -30px rgba(27,23,20,0.55), 0 0 0 1px rgba(0,0,0,0.4)",
      },
      borderColor: {
        hairline: "rgba(27,23,20,0.07)",
        "hairline-strong": "rgba(27,23,20,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
