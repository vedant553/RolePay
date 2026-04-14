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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
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
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
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
  plugins: [require("tailwindcss-animate")],
};

export default config;
