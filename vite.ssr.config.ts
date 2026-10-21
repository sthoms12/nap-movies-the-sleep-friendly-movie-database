import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    ssr: "src/entry-server.tsx",
    outDir: "dist-ssr",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "entry-server.js",
      },
    },
  },
});
