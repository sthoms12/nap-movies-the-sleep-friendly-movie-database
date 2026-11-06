import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// No @cloudflare/vite-plugin here: the plugin assumes a static-assets-only
// site and fails the build once wrangler.jsonc declares a Worker entry
// ("main": "worker/index.js", added for markdown content negotiation).
// The client uses no Worker bindings — it only fetches static assets —
// and `wrangler deploy` / `wrangler dev` read wrangler.jsonc directly.
export default defineConfig({
  plugins: [react()],
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