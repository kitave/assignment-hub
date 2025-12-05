import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /\.(js|jsx)$/, // tell esbuild to treat .js files as .jsx
  },

  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },

})