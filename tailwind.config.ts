import type { Config } from "tailwindcss";

/** Build a color that respects Tailwind's opacity modifier from a channel var. */
const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

/**
 * Design tokens from design_handoff_mision90ai/README.md.
 * Colors are wired to CSS variables (see globals.css) so the "modo oscuro"
 * setting in /configuracion can override them at :root without touching markup.
 */
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // rgb(var(--x) / <alpha-value>) → opacity modifiers work on every token.
        primary: {
          DEFAULT: withAlpha("--primary"),
          hover: withAlpha("--primary-hover"),
          soft: withAlpha("--primary-soft"),
        },
        accent: withAlpha("--accent"),
        ink: {
          DEFAULT: withAlpha("--ink"),
          deep: withAlpha("--ink-deep"),
        },
        body: withAlpha("--text-body"),
        muted: withAlpha("--text-muted"),
        "on-dark": withAlpha("--text-on-dark"),
        "on-dark-2": withAlpha("--text-on-dark-2"),
        surface: withAlpha("--surface"),
        "bg-app": withAlpha("--bg-app"),
        "bg-page": withAlpha("--bg-page"),
        border: {
          DEFAULT: withAlpha("--border"),
          strong: withAlpha("--border-strong"),
          input: withAlpha("--border-input"),
        },
        success: {
          DEFAULT: withAlpha("--success"),
          "on-dark": withAlpha("--success-on-dark"),
        },
        "warning-on-dark": withAlpha("--warning-on-dark"),
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        seg: "7px",
        segbox: "10px",
        field: "12px",
        card: "16px",
        "card-lg": "20px",
      },
      boxShadow: {
        frame: "0 40px 90px -40px rgba(23,32,42,.28)",
        card: "0 1px 2px rgba(23,32,42,.04), 0 8px 24px -18px rgba(23,32,42,.25)",
        "card-hover": "0 14px 34px -18px rgba(23,32,42,.30)",
      },
      keyframes: {
        m90pulse: {
          "0%,100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        m90pulse: "m90pulse 1.4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
