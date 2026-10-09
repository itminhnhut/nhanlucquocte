import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PRIVACY_POLICY_PATH } from "../content/privacy";
import {
  clearAnalyticsCookies,
  isSessionRecordingAllowed,
  readConsent,
  saveConsent,
  startAnalytics,
} from "../utils/consent";

// Thông báo đồng ý đo lường. Mặc định KHÔNG đo: không bấm gì thì không script nào được tải
// (xem index.html và src/utils/consent.js). Mở lại bằng nút "Cài đặt cookie" ở chân trang,
// nút đó bắn sự kiện window "nlqt:open-cookie-settings".
//
// Cách viết theo mẫu banner của HSBC Việt Nam (đối chiếu 09/10/2026) — giọng tổ chức, câu khẳng
// định, dùng đúng thuật ngữ "cookie phân tích", "cookie tùy chọn". KHÔNG nêu tên Google Analytics /
// Microsoft Clarity và KHÔNG dùng chữ nghề như "quay lại phiên" ở banner: người đọc không hiểu, và
// chi tiết đó đã nằm đầy đủ trong trang Chính sách bảo vệ dữ liệu cá nhân.
//
// Bố cục: thẻ gọn neo góc DƯỚI TRÁI, không phải dải chắn ngang màn hình — đọc được nội dung
// phía sau, và tránh đè nút Zalo/gọi đang nằm ở dưới PHẢI (FloatingContact).
// Hai nút cùng cỡ: luật yêu cầu từ chối phải dễ ngang đồng ý, không được làm nút Từ chối mờ đi.
export const OPEN_SETTINGS_EVENT = "nlqt:open-cookie-settings";

const BTN =
  "flex-1 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

function CookieConsent() {
  // undefined = chưa đọc xong (lần render đầu và lúc tạo HTML sẵn) → chưa vẽ gì, tránh lệch HTML
  const [choice, setChoice] = useState(undefined);
  const { pathname } = useLocation();
  const acceptRef = useRef(null);

  useEffect(() => {
    const saved = readConsent();
    setChoice(saved);
    if (saved === "granted") startAnalytics(pathname);
    // Chỉ chạy 1 lần lúc vào trang; đổi trang xử lý ở effect dưới
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đã đồng ý từ trước rồi mới đi tới trang tra cứu văn bằng: trang đó không được quay lại phiên.
  // Clarity đã nạp thì không gỡ được giữa chừng, nên dừng ghi bằng chính API của nó.
  useEffect(() => {
    if (choice !== "granted") return;
    if (!isSessionRecordingAllowed(pathname) && typeof window.clarity === "function") {
      try {
        window.clarity("stop");
      } catch {
        // Clarity chưa nạp xong hoặc bị chặn → không sao, trang vẫn chạy bình thường
      }
    }
  }, [choice, pathname]);

  const reopen = useCallback(() => setChoice(null), []);
  useEffect(() => {
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, [reopen]);

  // Mở lại từ chân trang: đưa con trỏ bàn phím vào thẻ để người dùng phím thấy nó đã mở
  useEffect(() => {
    if (choice === null) acceptRef.current?.focus();
  }, [choice]);

  // Trên màn hình nhỏ thẻ chiếm gần hết chiều ngang nên đè lên nút Zalo/gọi ở góc phải.
  // Gắn cờ lên <body> để index.css tạm ẩn nhóm nút đó, trả lại ngay khi người dùng đã chọn.
  useEffect(() => {
    const open = choice === null;
    document.body.classList.toggle("has-cookie-banner", open);
    return () => document.body.classList.remove("has-cookie-banner");
  }, [choice]);

  const decide = (value) => {
    saveConsent(value);
    setChoice(value);
    if (value === "granted") startAnalytics(pathname);
    else clearAnalyticsCookies();
  };

  if (choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="cookie-card fixed bottom-3 left-3 right-3 z-[60] rounded-2xl border border-blue-200 bg-white p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.18)] sm:bottom-5 sm:left-5 sm:right-auto sm:w-[370px] sm:p-4"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary-dark"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
            <path d="M12 3 4.5 6v5.2c0 4.5 3.1 8.2 7.5 9.8 4.4-1.6 7.5-5.3 7.5-9.8V6L12 3Z" strokeLinejoin="round" />
            <path d="M9.3 12.2l1.9 1.9 3.6-3.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <p id="cookie-title" className="text-[14px] font-bold text-primary-dark">
            Cookie trên trang web này
          </p>
          <p id="cookie-desc" className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
            Nhà trường sử dụng cookie phân tích để đo lượt truy cập và cải thiện nội dung website dựa
            trên hoạt động của người truy cập. Đây là cookie tùy chọn, chỉ được cài đặt sau khi bạn
            đồng ý.
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => decide("denied")}
          className={`${BTN} border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50`}
        >
          Từ chối
        </button>
        <button
          type="button"
          ref={acceptRef}
          onClick={() => decide("granted")}
          className={`${BTN} bg-primary-dark text-white hover:bg-primary`}
        >
          Đồng ý
        </button>
      </div>

      <p className="mt-2 text-[11.5px] leading-relaxed text-slate-500">
        Bạn có thể thay đổi lựa chọn bất cứ lúc nào tại mục “Cài đặt cookie” ở cuối trang.{" "}
        <Link
          to={PRIVACY_POLICY_PATH}
          className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
        >
          Chính sách bảo vệ dữ liệu cá nhân
        </Link>
      </p>
    </div>
  );
}

export default CookieConsent;
