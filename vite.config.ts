import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages project site:
  // https://avmannino.github.io/public_skate_webpage_embed/
  base: "/cosmic_skate_webpage_embed/",

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
