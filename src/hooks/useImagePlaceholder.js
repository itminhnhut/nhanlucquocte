import { useEffect } from "react";

/**
 * Gắn data-loaded cho ảnh trong bài khi ảnh tải xong, để CSS tắt nền chờ (rich-text.css).
 *
 * Vì sao cần JS: nội dung bài đưa vào bằng dangerouslySetInnerHTML nên không gắn được onLoad của
 * React, mà CSS thuần thì không biết ảnh đã tải xong hay chưa. Vài dòng dưới đây rẻ hơn nhiều so
 * với để hiệu ứng nhấp nháy chạy mãi phía sau mọi tấm ảnh.
 *
 * @param {{current: HTMLElement|null}} ref - vùng chứa nội dung bài
 * @param {unknown} deps - đổi khi nội dung đổi (chuyển sang bài khác)
 */
export function useImagePlaceholder(ref, deps) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const done = (img) => img.setAttribute("data-loaded", "");
    const cleanups = [];
    root.querySelectorAll("img").forEach((img) => {
      // Ảnh đã có sẵn trong bộ nhớ đệm: complete = true ngay, không bao giờ bắn sự kiện load
      if (img.complete) return done(img);
      const onSettled = () => done(img);
      img.addEventListener("load", onSettled, { once: true });
      // Ảnh hỏng cũng gỡ nền chờ, nếu không sẽ nhấp nháy vĩnh viễn ở chỗ ảnh vỡ
      img.addEventListener("error", onSettled, { once: true });
      cleanups.push(() => {
        img.removeEventListener("load", onSettled);
        img.removeEventListener("error", onSettled);
      });
    });
    return () => cleanups.forEach((off) => off());
  }, [ref, deps]);
}
