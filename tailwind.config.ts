import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ─── Typography ───────────────────────────────────────────────
      fontFamily: {
        sans: ["Bricolage Grotesque", "sans-serif"],
      },
      fontSize: {
        "page-title":   ["32px", { fontWeight: "800", lineHeight: "1.2" }],
        "section-title":["20px", { fontWeight: "700", lineHeight: "1.3" }],
        "card-title":   ["16px", { fontWeight: "600", lineHeight: "1.4" }],
        "kpi":          ["28px", { fontWeight: "800", lineHeight: "1.1" }],
        "body":         ["14px", { fontWeight: "400", lineHeight: "1.6" }],
        "secondary":    ["13px", { fontWeight: "300", lineHeight: "1.5" }],
        "caption":      ["12px", { fontWeight: "300", lineHeight: "1.4" }],
      },

      // ─── Colors ───────────────────────────────────────────────────
      colors: {
        // Base UI
        background: {
          primary:   "#FFFFFF",
          secondary: "#F7F9F8",
        },
        border: {
          DEFAULT: "#E5E7EB",
        },
        // Text
        text: {
          primary:   "#0F172A",
          secondary: "#6B7280",
        },
        // Risk badges
        risk: {
          low: {
            bg:   "#DCFCE7",
            text: "#166534",
          },
          medium: {
            bg:   "#FEF9C3",
            text: "#854D0E",
          },
          high: {
            bg:   "#FEE2E2",
            text: "#991B1B",
          },
        },
      },

      // ─── Border Radius ─────────────────────────────────────────────
      borderRadius: {
        card:   "20px",
        button: "14px",
        input:  "12px",
      },

      // ─── Spacing ───────────────────────────────────────────────────
      spacing: {
        "sidebar": "240px",
        "topbar":  "64px",
      },

      // ─── Box Shadow ────────────────────────────────────────────────
      boxShadow: {
        card: "0 1px 4px rgba(0, 0, 0, 0.06)",
      },

      // ─── Background Images (Gradient) ─────────────────────────────
      backgroundImage: {
        // Primary brand gradient — use ONLY for CTAs, scores, AI accents
        "brand":         "linear-gradient(135deg, #3e5e3c, #2f8876, #05fecb)",
        "brand-subtle":  "linear-gradient(135deg, rgba(62,94,60,0.08), rgba(5,254,203,0.08))",
        "brand-hover":   "linear-gradient(135deg, #355230, #286b66, #04deb0)",
      },

      // ─── Sidebar width as a CSS var ────────────────────────────────
      width: {
        sidebar: "240px",
      },
      height: {
        topbar: "64px",
      },
    },
  },
  plugins: [],
};

export default config;
