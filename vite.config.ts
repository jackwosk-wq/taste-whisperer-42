import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      // Legacy Places API (kept as fallback)
      "/places-proxy": {
        target: "https://maps.googleapis.com/maps/api/place",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/places-proxy/, ""),
      },
      // Places API (New) — autocomplete, details, photos
      "/places-new": {
        target: "https://places.googleapis.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/places-new/, "/v1"),
      },
      // Yelp Fusion API — price fallback
      "/yelp-proxy": {
        target: "https://api.yelp.com/v3",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/yelp-proxy/, ""),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
