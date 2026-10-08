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
declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

/**
 * Lấy giá trị env theo thứ tự ưu tiên:
 * runtime (window.__ENV__) → build-time (import.meta.env) → defaultValue
 */
function getEnv(key: string, defaultValue = ""): string {
  // 1. Ưu tiên runtime env (được inject bởi Docker entrypoint script)
  if (typeof window !== "undefined" && window.__ENV__?.[key]) {
    return window.__ENV__[key];
  }
  // 2. Fallback về Vite build-time env (dùng khi dev local với .env file)
  // @ts-ignore – import.meta.env là dynamic
  const viteEnv = import.meta.env?.[key];
  if (viteEnv) return viteEnv;

  return defaultValue;
}

// ── Export các biến env được dùng trong app ───────────────────────────────────

/** Base URL của API backend. Trống = chưa có backend → dùng dữ liệu giả lập (public/mock) */
export const API_URL = getEnv("VITE_API_URL", "");

/** Public URL của frontend app */
export const APP_URL = getEnv("VITE_APP_URL", "https://trungcapnhanlucquocte.vn");

/**
 * Dùng dữ liệu giả lập thay cho API.
 * Mặc định: BẬT khi chưa khai báo VITE_API_URL — dữ liệu lấy từ website hiện tại của trường
 * (public/mock/programs.json, public/mock/posts.json), đúng hình dạng API thật.
 * Khi backend của trường chạy: đặt VITE_API_URL=<url> (và VITE_USE_MOCK=0 nếu muốn chắc chắn).
 */
export const USE_MOCK = getEnv("VITE_USE_MOCK", "") === "1" || !API_URL;

/** Helper xuất toàn bộ config (debug) */
export const runtimeEnv = {
  API_URL,
  APP_URL,
  USE_MOCK,
} as const;

export default runtimeEnv;
