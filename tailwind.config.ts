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
        // Strict monochrome editorial palette — no color.
        cream: "#FFFFFF", // app background (kept token name for low churn)
        surface: "#FFFFFF",
        ink: "#0A0A0A", // text / buttons / borders
        muted: "#6B6B6B", // secondary text
        faint: "#9B9B9B", // tertiary text
        line: "#B0B0B0", // hairlines
        // Former accent roles all collapse to ink (black) in monochrome.
        red: "#0A0A0A",
        green: "#0A0A0A",
        gold: "#0A0A0A",
        "gold-active": "#0A0A0A",
        blue: "#0A0A0A",
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
      // No decorative shadows — definition comes from 1.5px black outlines.
      boxShadow: {
        card: "none",
        "btn-pass": "none",
        "btn-star": "none",
        "btn-like": "none",
        sheet: "none",
        device: "none",
      },
      borderColor: {
        hairline: "rgba(10,10,10,0.12)",
        "hairline-strong": "rgba(10,10,10,0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
