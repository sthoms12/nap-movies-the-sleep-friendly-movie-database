import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  build: {
    minify: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        criteria: path.resolve(__dirname, "criteria.html"),
        guide: path.resolve(__dirname, "guide.html"),
      },
    },
  },
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});