import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * CSS phải tải trước JS.
 *
 * Vite xếp <script type="module"> và các <link rel="modulepreload"> LÊN TRƯỚC <link
 * rel="stylesheet"> trong <head>. CSS là thứ duy nhất chặn hiển thị, nên trên mạng chậm nó phải
 * xếp hàng sau 333 KB JS: đo trên máy ảo (CPU chậm 4x, Slow 4G) thấy CSS về lúc 2043ms và trang
 * chỉ hiện được ở 2176ms — người dùng nhìn màn hình trắng suốt quãng đó dù HTML đã có sẵn nội dung.
 *
 * Plugin này đưa stylesheet lên đầu <head> và hạ độ ưu tiên tải của các chunk JS. JS vẫn tải và
 * chạy như cũ (type="module" luôn hoãn tới sau khi dựng xong DOM), chỉ nhường băng thông cho CSS.
 */
function cssTruocJs() {
  return {
    name: "css-truoc-js",
    enforce: "post",
    transformIndexHtml(html) {
      const stylesheet = html.match(/<link[^>]+rel="stylesheet"[^>]*>/)?.[0];
      if (!stylesheet) return html;
      return html
        .replace(stylesheet, "")
        .replace(/<link rel="modulepreload"/g, '<link rel="modulepreload" fetchpriority="low"')
        .replace("<head>", `<head>\n    ${stylesheet.replace("<link", '<link fetchpriority="high"')}`);
    },
  };
}

export default defineConfig({
  plugins: [react(), cssTruocJs()],
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
