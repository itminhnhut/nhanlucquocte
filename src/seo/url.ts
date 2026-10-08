// URL helpers dùng chung cho React (Seo) và server tạo HTML (scripts/seo).
// Domain canonical luôn là appConfig.domain — không lấy từ window.location
// hay VITE_APP_URL (trên EasyPanel biến này có thể là host nội bộ).
import appConfig from "../configs/appConfig";

export const SITE_URL = appConfig.domain.replace(/\/+$/, "");

// Slug hợp lệ: chữ (kể cả tiếng Việt), số, ".", "_", "-" — chặn "/", "..", ký tự lạ
const SAFE_SLUG = /^[\p{L}\p{N}._-]+$/u;

export function isSafeSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug) && slug !== "." && slug !== "..";
}

/** Chuẩn hoá pathname: bỏ query/hash, bỏ "/" cuối (trừ trang chủ) */
export function normalizePath(pathname: string): string {
  const path = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  return path.startsWith("/") ? path || "/" : `/${path}`;
}

export function canonicalUrl(pathname: string): string {
  const path = normalizePath(pathname);
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Ảnh/đường dẫn tương đối → URL tuyệt đối (OG, schema cần URL đầy đủ) */
export function absoluteUrl(pathOrUrl: unknown): string {
  if (typeof pathOrUrl !== "string" || !pathOrUrl.trim()) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
