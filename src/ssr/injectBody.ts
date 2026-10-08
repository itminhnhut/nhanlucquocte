// Chèn HTML đã render sẵn vào <div id="root"> + script dữ liệu cho hydrate.
// Đánh dấu bằng comment NGOÀI #root (React không thấy khi hydrate) để lần tạo sau
// lấy lại được template gốc — trang chủ ghi đè chính index.html là template.
import { INITIAL_DATA_SCRIPT_ID, type InitialData } from "../data/initialData";
import { toSafeJson } from "../seo/headTags";

export const BODY_BLOCK_START = "<!--ssr:start-->";
export const BODY_BLOCK_END = "<!--ssr:end-->";
const EMPTY_ROOT = '<div id="root"></div>';

const BODY_BLOCK_PATTERN = new RegExp(`${BODY_BLOCK_START}[\\s\\S]*?${BODY_BLOCK_END}`, "g");

/** Bỏ phần body đã render → template có #root rỗng */
export function stripBody(html: string): string {
  return html.replace(BODY_BLOCK_PATTERN, EMPTY_ROOT);
}

export function hasEmbeddedData(html: string): boolean {
  return html.includes(`id="${INITIAL_DATA_SCRIPT_ID}"`);
}

export function injectBody(template: string, rootHtml: string, data: InitialData): string {
  const base = stripBody(template);
  if (!base.includes(EMPTY_ROOT)) throw new Error(`Template HTML không có ${EMPTY_ROOT}`);
  // toSafeJson escape "<" → CMS có "</script>" cũng không đóng script sớm
  const dataScript = Object.keys(data).length
    ? `<script id="${INITIAL_DATA_SCRIPT_ID}" type="application/json">${toSafeJson(data)}</script>`
    : "";
  return base.replace(
    EMPTY_ROOT,
    () => `${BODY_BLOCK_START}<div id="root">${rootHtml}</div>${dataScript}${BODY_BLOCK_END}`
  );
}
