// CLI tạo sitemap lúc build (chạy bản đã bundle: dist-server/generate-sitemap.cjs,
// xem scripts/build-server.mjs). Output mặc định: dist/sitemap.xml
//   - VITE_API_URL: URL API; không khai báo → đọc dữ liệu giả lập trong public/mock
import dotenv from "dotenv";
import { generateSitemapFile } from "./seo/generate";

const DEFAULT_OUTPUT = "dist/sitemap.xml";

dotenv.config({ quiet: true });

generateSitemapFile(process.argv[2] || DEFAULT_OUTPUT, process.env).catch((err) => {
  console.error("❌ Lỗi khi tạo sitemap:", err);
  process.exitCode = 1;
});
