
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import postcssCustomMedia from "postcss-custom-media";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
    postcss: {
      plugins: [postcssCustomMedia, autoprefixer],
    },
  },

  optimizeDeps: {
    exclude: ["pdfjs-dist"],
  },

  build: {
    sourcemap: true
  }
});