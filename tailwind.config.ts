import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [forms],
};

export default config;
