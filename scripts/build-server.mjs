// Bundle script Node (sitemap + HTML tạo sẵn) thành 1 file .cjs không cần node_modules,
// để import được src/seo/*.ts và chạy trong container Nginx.
//   node scripts/build-server.mjs          → dist-server/{generate-sitemap,sitemap-server,seo-audit}.cjs
//   node scripts/build-server.mjs --tests  → thêm dist-server/tests/*.test.cjs
import { build } from "esbuild";
import fs from "fs";
import path from "path";

const OUT_DIR = "dist-server";
const TEST_DIR = "scripts/seo/__tests__";

const common = {
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node18",
  outExtension: { ".js": ".cjs" },
  logLevel: "warning",
  // Render sẵn app React (src/ssr) → cần JSX; CSS do Vite lo, server bỏ qua
  jsx: "automatic",
  loader: { ".css": "empty" },
  // env.ts đọc import.meta.env (chỉ có trong Vite); server lấy env từ process.env
  define: { "import.meta.env": "{}" },
};

await build({
  ...common,
  entryPoints: {
    "generate-sitemap": "scripts/generate-sitemap.js",
    "sitemap-server": "scripts/sitemap-server.js",
    "seo-audit": "scripts/seo-audit.js",
  },
  outdir: OUT_DIR,
});

if (process.argv.includes("--tests")) {
  const testFiles = fs
    .readdirSync(TEST_DIR)
    .filter((file) => file.endsWith(".test.js"))
    .map((file) => path.join(TEST_DIR, file));
  await build({ ...common, entryPoints: testFiles, outdir: path.join(OUT_DIR, "tests") });
}
