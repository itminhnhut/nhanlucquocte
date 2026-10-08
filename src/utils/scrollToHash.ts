// Cuộn tới phần tử theo #hash sau khi chuyển trang (vd "/#register" từ trang khác).
// Chờ phần tử xuất hiện VÀ các request API xong (các khối phía trên tải dữ liệu sẽ đẩy
// phần tử xuống), tối đa MAX_WAIT_MS rồi vẫn cuộn. Trả về hàm huỷ khi đổi trang tiếp.
import { getPendingRequestCount } from "./requestTracker";

const MAX_WAIT_MS = 4000;
const SETTLE_CHECK_MS = 600;

/** "#register" → "register". Hash hỏng (link bị cắt, vd "#%E0%A4%A") → giữ nguyên, không làm sập trang */
export function hashToElementId(hash: string): string {
  const raw = hash.replace(/^#/, "");
  try {
    return decodeURIComponent(raw);
  } catch (err) {
    console.warn("[scrollToHash] Hash không giải mã được, dùng nguyên bản:", raw, err);
    return raw;
  }
}

export function scrollToHashWhenReady(hash: string): () => void {
  const id = hashToElementId(hash);
  const startedAt = performance.now();
  let frame = 0;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  const scrollToElement = (element: HTMLElement): void => {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    // Ảnh/khối tải muộn có thể đẩy phần tử lệch sau khi cuộn → chỉnh lại 1 lần
    settleTimer = setTimeout(() => {
      const top = element.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight / 2) element.scrollIntoView({ block: "start" });
    }, SETTLE_CHECK_MS);
  };

  const attempt = (): void => {
    const element = document.getElementById(id);
    const isTimedOut = performance.now() - startedAt > MAX_WAIT_MS;
    if (element && (getPendingRequestCount() === 0 || isTimedOut)) {
      scrollToElement(element);
      return;
    }
    if (!isTimedOut) frame = requestAnimationFrame(attempt);
  };

  // Frame sau: để effect gọi API của các khối trên trang kịp chạy trước khi kiểm tra
  frame = requestAnimationFrame(attempt);
  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(settleTimer);
  };
}
