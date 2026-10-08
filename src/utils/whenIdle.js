// Hoãn việc không gấp (gọi API làm mới dữ liệu đã nhúng sẵn trong HTML) tới khi trình duyệt rảnh,
// để không tranh băng thông/CPU với phần hiển thị đầu tiên (LCP).
const FALLBACK_DELAY_MS = 1200;

export function whenIdle(callback) {
  if (typeof window === "undefined") return () => {};
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 3000 });
    return () => window.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(callback, FALLBACK_DELAY_MS);
  return () => window.clearTimeout(id);
}
