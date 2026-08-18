import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base palette — dark "roast room" background, not the generic cream+terracotta combo.
        char: "#1B1512", // near-black, roasted background
        husk: "#EDE6DA", // parchment / chaff paper
        bark: "#3A2E27", // card surface, dark roast brown
        // Roast-level accent scale — used as functional color-coding per recipe/step,
        // not decoration. Mirrors real roast degree colors on a coffee scale.
        roast: {
          light: "#C9A66B", // cinnamon / light roast
          medium: "#8B5A2B", // medium / city roast
          dark: "#3E2417", // dark / french roast
        },
        moss: "#6B7A4F", // accent for "ready/complete" states, cupping-room green
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "6px",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      keyframes: {
        steamRise: {
          "0%": { transform: "translateY(0) scaleX(1)", opacity: "0" },
          "15%": { opacity: "0.8" },
          "50%": { transform: "translateY(-9px) scaleX(1.15)", opacity: "0.55" },
          "100%": { transform: "translateY(-18px) scaleX(0.85)", opacity: "0" },
        },
        dripFall: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(13px)", opacity: "0" },
        },
        bubbleRise: {
          "0%": { transform: "translateY(0) scale(0.6)", opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { transform: "translateY(-22px) scale(1)", opacity: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        pulseGrow: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
        },
        pick: {
          "0%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(6px)" },
          "60%": { transform: "translateY(6px)" },
        },
        rayPulse: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.8" },
        },
        fall: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "20%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(10px)", opacity: "0" },
        },
      },
      animation: {
        steam1: "steamRise 2.6s ease-in-out infinite",
        steam2: "steamRise 2.6s ease-in-out 0.6s infinite",
        steam3: "steamRise 2.6s ease-in-out 1.2s infinite",
        drip: "dripFall 1.4s ease-in infinite",
        bubble1: "bubbleRise 2.2s ease-in-out infinite",
        bubble2: "bubbleRise 2.2s ease-in-out 0.7s infinite",
        bubble3: "bubbleRise 2.2s ease-in-out 1.4s infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        sway: "sway 3.2s ease-in-out infinite",
        "pulse-grow": "pulseGrow 2s ease-in-out infinite",
        pick: "pick 1.8s ease-in-out infinite",
        "ray-pulse-1": "rayPulse 2.4s ease-in-out infinite",
        "ray-pulse-2": "rayPulse 2.4s ease-in-out 0.4s infinite",
        "ray-pulse-3": "rayPulse 2.4s ease-in-out 0.8s infinite",
        fall1: "fall 1.6s ease-in infinite",
        fall2: "fall 1.6s ease-in 0.5s infinite",
        fall3: "fall 1.6s ease-in 1s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
