import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#10b981",
          "green-dark": "#059669",
          navy: "#0f1729",
          "navy-light": "#152040",
          "content-bg": "#f8fafc",
          "text-primary": "#0f172b",
          "text-muted": "#90a1b9",
          "text-sub": "#62748e",
          "border-light": "#e2e8f0",
        },
      },
      fontFamily: {
        sans: ["Arimo", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "slide-right": "slideRight 3s ease-in-out infinite",
      },
      keyframes: {
        slideRight: {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(350%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
