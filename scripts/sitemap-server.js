// Server nội bộ tạo lại SEO files (sitemap.xml + HTML từng trang):
//   GET https://<domain>/sitemap/refresh?key=<SITEMAP_KEY>
// Nginx proxy /sitemap/refresh → server này (chỉ nghe 127.0.0.1, không lộ ra ngoài).
// Khởi động bởi docker/env.sh (bản bundle /opt/sitemap/sitemap-server.cjs); tạo 1 lần khi start.
import http from "http";
import crypto from "crypto";
import { generateSeoFiles } from "./seo/generate";
import { writePages } from "./seo/pages";

const HOST = "127.0.0.1";
const PORT = Number(process.env.SITEMAP_SERVER_PORT) || 3100;
const WEB_ROOT = process.env.SEO_WEB_ROOT || "/usr/share/nginx/html";
const SITEMAP_KEY = process.env.SITEMAP_KEY || "";

// Nhiều người bấm cùng lúc → dùng chung 1 lần chạy
let running = null;

function runOnce() {
  if (!running) {
    running = generateSeoFiles(WEB_ROOT, process.env).finally(() => {
      running = null;
    });
  }
  return running;
}

function isValidKey(key) {
  if (!SITEMAP_KEY || typeof key !== "string") return false;
  const expected = Buffer.from(SITEMAP_KEY);
  const actual = Buffer.from(key);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function send(res, status, message) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(`${message}\n`);
}

function describe(result) {
  const summary = `${result.programCount} chương trình, ${result.newsCount} tin tức, ${result.pageCount} trang HTML`;
  return result.isComplete
    ? `✅ Đã cập nhật sitemap + SEO: ${summary}`
    : `⚠️  API lỗi — giữ sitemap cũ, chỉ cập nhật trang tĩnh (${summary}). Xem docker logs.`;
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${HOST}`);
  if (req.method !== "GET" || url.pathname !== "/sitemap/refresh") {
    return send(res, 404, "Not found");
  }
  if (!SITEMAP_KEY) return send(res, 503, "Chưa cấu hình SITEMAP_KEY trên server");
  if (!isValidKey(url.searchParams.get("key"))) return send(res, 403, "Sai key");

  try {
    const result = await runOnce();
    return send(res, result.isComplete ? 200 : 502, describe(result));
  } catch (err) {
    console.error("❌ Lỗi khi tạo SEO files:", err);
    return send(res, 500, "❌ Lỗi khi tạo sitemap, xem docker logs");
  }
}

// --static-only: ghi nhanh trang tĩnh + 404 (không gọi API) rồi thoát.
// env.sh chạy bước này trước khi Nginx nhận request → không có khoảng 404 lúc khởi động.
if (process.argv.includes("--static-only")) {
  const { pageCount } = writePages(WEB_ROOT, { programs: [], news: [], isComplete: false });
  console.log(`✅ Đã ghi ${pageCount} trang tĩnh → ${WEB_ROOT}`);
  process.exit(0);
}

http.createServer(handleRequest).listen(PORT, HOST, () => {
  console.log(`[sitemap-server] Đang nghe ${HOST}:${PORT}`);
  if (!SITEMAP_KEY) console.warn("[sitemap-server] ⚠️  SITEMAP_KEY chưa set → link refresh bị tắt");
  runOnce().catch((err) => console.error("❌ Lỗi khi tạo SEO files lúc khởi động:", err));
});
