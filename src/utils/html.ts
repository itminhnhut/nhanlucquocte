// Tiện ích xử lý HTML nội dung từ CMS trước khi render.

/**
 * Hạ <h1> trong nội dung CMS xuống <h2>: mỗi trang chỉ nên có 1 h1 (tiêu đề trang),
 * nội dung bài/ngành chèn thêm h1 sẽ làm Google khó xác định chủ đề chính.
 */
export function demoteH1(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<(\/?)h1(?=[\s>])/gi, "<$1h2");
}

/**
 * Ảnh trong nội dung CMS nằm dưới phần đầu trang → tải khi sắp cuộn tới (loading="lazy"),
 * để ảnh chính (LCP) không phải tranh băng thông. Giữ nguyên ảnh đã tự chọn loading.
 */
export function lazyLoadImages(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<img\b(?![^>]*\sloading=)/gi, '<img loading="lazy" decoding="async"');
}

/** Ảnh trong bài CMS thiếu alt → gắn alt theo tiêu đề bài (ảnh không alt vừa hại SEO vừa hại
 *  người dùng trình đọc màn hình). Chỉ thêm khi thẻ img chưa có alt. */
export function fillMissingImageAlt(html: unknown, title: unknown): string {
  if (typeof html !== "string") return "";
  const label = String(title ?? "").replace(/"/g, "").trim();
  if (!label) return html;
  return html.replace(/<img\b(?![^>]*\salt=)/gi, `<img alt="${label}"`);
}
