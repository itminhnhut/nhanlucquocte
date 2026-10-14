/**
 * Runtime Environment Configuration
 *
 * Vite bake các biến VITE_* vào bundle lúc build.
 * Để thay đổi env mà KHÔNG rebuild image (quan trọng với Docker/EasyPanel),
 * ta inject window.__ENV__ (script inline trong index.html) lúc container start.
 *
 * Thứ tự ưu tiên:
 *   1. window.__ENV__  (runtime inject - EasyPanel env vars)
 *   2. import.meta.env (fallback - build-time, dùng khi dev local)
 */

// Type cho window.__ENV__ (được inject bởi docker/env.sh)
// Kiểu của window.__ENV__ khai ở src/global.d.ts

/**
 * Lấy giá trị env theo thứ tự ưu tiên:
 * runtime (window.__ENV__) → Node process.env → build-time (import.meta.env) → defaultValue
 *
 * process.env là bắt buộc cho tiến trình TẠO HTML SẴN: scripts/build-server.mjs đóng gói bằng
 * `define: { "import.meta.env": "{}" }` nên trong tiến trình đó import.meta.env luôn rỗng, còn
 * window thì không tồn tại. Thiếu nhánh này thì API_URL = "" lúc tạo HTML, kéo theo
 * allowedImageHosts() (src/utils/html.ts) không có host của API và dropForeignImages XOÁ SẠCH ảnh
 * do nhà trường upload khỏi HTML tạo sẵn — mà nội dung bài đưa vào bằng dangerouslySetInnerHTML
 * nên React không vá lại lúc hydrate: ảnh mất hẳn và Google index đúng bản không ảnh.
 */
export function readEnv(key: string, defaultValue = ""): string {
  // 1. Ưu tiên runtime env (được inject bởi Docker entrypoint script)
  if (typeof window !== "undefined" && window.__ENV__?.[key]) {
    return window.__ENV__[key];
  }
  // 2. Chạy trong Node (tạo HTML sẵn, chạy test): lấy từ biến môi trường của tiến trình.
  // Khai kiểu tại chỗ thay vì cài @types/node — đây là mã chạy ở trình duyệt là chính.
  const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  if (nodeEnv?.[key]) return String(nodeEnv[key]);
  // 3. Fallback về Vite build-time env (dùng khi dev local với .env file)
  // @ts-ignore – import.meta.env là dynamic
  const viteEnv = import.meta.env?.[key];
  if (viteEnv) return viteEnv;

  return defaultValue;
}

// ── Export các biến env được dùng trong app ───────────────────────────────────

/** Base URL của API backend của trường. Bắt buộc có, đặt qua VITE_API_URL (docker/env.sh) */
export const API_URL = readEnv("VITE_API_URL", "");

/** Public URL của frontend app */
export const APP_URL = readEnv("VITE_APP_URL", "https://trungcapnhanlucquocte.vn");

/**
 * Các host được phép giữ ảnh trong bài (phân tách bằng dấu phẩy), dành cho trường hợp ảnh upload
 * nằm trên CDN hoặc tên miền lưu trữ riêng, khác cả web lẫn API.
 * Ví dụ: VITE_IMAGE_HOSTS="cdn.truong.vn,storage.googleapis.com"
 */
export const EXTRA_IMAGE_HOSTS = readEnv("VITE_IMAGE_HOSTS", "");

/** Helper xuất toàn bộ config (debug) */
export const runtimeEnv = {
  API_URL,
  APP_URL,
  EXTRA_IMAGE_HOSTS,
} as const;

export default runtimeEnv;
