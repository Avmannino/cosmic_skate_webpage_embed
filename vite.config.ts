import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // Local dev: /
  // Build (GitHub Pages): /cosmic_skate_webpage_embed/
  base: command === "build" ? "/cosmic_skate_webpage_embed/" : "/",

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
