import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@sections": path.resolve(__dirname, "./src/sections"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Thư viện ít đổi tách chunk riêng → cache lâu hơn giữa các lần deploy
        manualChunks(id) {
          if (!id.includes("node_modules") || id.endsWith(".css")) return undefined;
          if (id.includes("/swiper/")) return "swiper";
          if (/\/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(id)) return "react";
          return "vendor";
        },
      },
    },
  },
  preview: {
    allowedHosts: ["vietuchcm.edu.vn", "www.vietuchcm.edu.vn"],
  },
});
