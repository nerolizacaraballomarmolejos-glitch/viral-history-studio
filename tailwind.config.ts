import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0b",
        foreground: "#fafafa",
        card: "#121214",
        "card-hover": "#1a1a1d",
        border: "#27272a",
        muted: "#a1a1aa",
        neon: {
          DEFAULT: "#facc15",
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
        },
        danger: "#ef4444",
        success: "#22c55e",
      },
      boxShadow: {
        neon: "0 0 20px rgba(250, 204, 21, 0.3)",
        "neon-sm": "0 0 10px rgba(250, 204, 21, 0.2)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
