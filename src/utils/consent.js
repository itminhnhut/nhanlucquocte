// Đồng ý cho đo lường (Google Analytics + Microsoft Clarity).
//
// Luật 91/2025: im lặng hoặc không chọn KHÔNG phải là đồng ý. Vì vậy mặc định là KHÔNG đo:
// index.html chỉ dựng sẵn hàng đợi lệnh, không tải script nào cho tới khi hàm dưới đây được gọi.
//
// Lựa chọn lưu trong localStorage kèm phiên bản chính sách: chính sách đổi (PRIVACY_POLICY_VERSION)
// thì lựa chọn cũ hết hiệu lực và banner hỏi lại — đồng ý với bản cũ không tính cho bản mới.
import { PRIVACY_POLICY_VERSION } from "../content/privacy";

const STORAGE_KEY = "nlqt-consent";

/** Trang hiện họ tên, ngày sinh, số bằng, xếp loại của NGƯỜI KHÁC (người tra không phải chủ dữ liệu).
 *  Người có bằng chưa bao giờ đồng ý cho Microsoft quay lại màn hình đó, nên không chạy Clarity ở
 *  đây dù khách có bấm Đồng ý. Đồng ý của người đang xem không thay được đồng ý của chủ dữ liệu. */
export const NO_SESSION_RECORDING_PATHS = ["/tra-cuu-van-bang"];

export function isSessionRecordingAllowed(pathname) {
  return !NO_SESSION_RECORDING_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/** "granted" | "denied" | null (chưa chọn, hoặc đã chọn cho phiên bản chính sách cũ) */
export function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== PRIVACY_POLICY_VERSION) return null;
    return saved.choice === "granted" || saved.choice === "denied" ? saved.choice : null;
  } catch {
    // Trình duyệt chặn localStorage (chế độ riêng tư) → coi như chưa chọn, tức là KHÔNG đo
    return null;
  }
}

export function saveConsent(choice) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ choice, version: PRIVACY_POLICY_VERSION, at: new Date().toISOString() })
    );
  } catch {
    // Không lưu được thì vẫn áp dụng cho phiên này, lần sau banner hỏi lại
  }
}

/** Tải script đo lường. Chỉ được gọi khi người dùng đã bấm Đồng ý. */
export function startAnalytics(pathname = "/") {
  if (typeof window === "undefined" || typeof window.__nlqtLoadAnalytics !== "function") return;
  window.__nlqtLoadAnalytics({ sessionRecording: isSessionRecordingAllowed(pathname) });
}

/** Từ chối: xoá cookie do Google/Microsoft đặt trên tên miền này, không chờ hết hạn */
export function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (!name || !/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID)/.test(name)) return;
    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    });
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}
