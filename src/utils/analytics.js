// Đo chuyển đổi bằng GA4: đăng ký tư vấn, bấm gọi, bấm Zalo, bấm email.
// gtag.js và Clarity CHỈ được tải sau khi người dùng bấm Đồng ý (src/components/CookieConsent.jsx).
// Chưa đồng ý thì window.gtag/window.clarity không phải hàm → mọi hàm dưới đây tự im lặng.
// Trong GA4: Quản trị → Sự kiện → đánh dấu generate_lead, click_call, click_zalo là "sự kiện chính".
/** Gắn nhãn cho phiên trong Microsoft Clarity để lọc bản ghi (vd xem lại phiên đã đăng ký) */
function tagClarity(name, value) {
  if (typeof window === "undefined" || typeof window.clarity !== "function") return;
  try {
    window.clarity("set", name, String(value));
  } catch {
    // Clarity chưa nạp xong hoặc bị chặn → bỏ qua, không ảnh hưởng gì tới trang
  }
}

/** Gửi 1 sự kiện GA4 (không có dữ liệu cá nhân: không gửi tên, số điện thoại, email người dùng) */
export function trackEvent(name, params = {}) {
  // Clarity: đánh dấu các mốc quan trọng để lọc nhanh bản ghi phiên
  if (["generate_lead", "click_call", "click_zalo", "form_start", "form_error"].includes(name)) {
    tagClarity(name, "1");
  }
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, { page_path: window.location.pathname, ...params });
}

// Link liên hệ → tên sự kiện. Link của trường (hotline, Zalo OA, email), không phải của người dùng
const CONTACT_LINKS = [
  { event: "click_call", test: (href) => href.startsWith("tel:") },
  { event: "click_zalo", test: (href) => /^https?:\/\/(www\.)?zalo\.me\//.test(href) },
  { event: "click_email", test: (href) => href.startsWith("mailto:") },
];

/** Tên sự kiện cho 1 link, null nếu không phải link liên hệ */
export function contactEventName(href) {
  if (typeof href !== "string") return null;
  return CONTACT_LINKS.find((item) => item.test(href))?.event ?? null;
}

/** Bấm nút "Đăng ký tư vấn" — vị trí nào ra nhiều khách nhất (hero, thẻ ngành, cột phải…) */
export function trackRegisterClick(position) {
  trackEvent("click_register", { position });
}

/** Nghe mọi cú bấm link liên hệ trên trang (header, nút nổi, trang liên hệ, bài viết CMS…) */
export function listenContactClicks(target = document) {
  const onClick = (event) => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    const href = link?.getAttribute("href") ?? "";
    const name = link && contactEventName(href);
    if (name) {
      trackEvent(name, { link_text: link.textContent.trim().slice(0, 60) });
      return;
    }
    // Mọi link dẫn tới form đăng ký đều tính là một bước trong phễu, kèm trang xuất phát
    if (link && /#register$/.test(href)) {
      trackRegisterClick(`${window.location.pathname} | ${link.textContent.trim().slice(0, 40)}`);
    }
  };
  target.addEventListener("click", onClick, { capture: true });
  return () => target.removeEventListener("click", onClick, { capture: true });
}

// ── Theo dõi hành trình người dùng ────────────────────────────────────────────
// Web chạy SPA: gtag chỉ gửi page_view lúc tải trang đầu tiên, chuyển trang sau đó
// KHÔNG tự gửi. Không có hàm này thì GA4 chỉ thấy trang vào đầu tiên của mỗi phiên,
// không dựng được báo cáo "đi từ đâu → qua trang nào → rời ở trang nào".

/** Nhóm trang, để lọc báo cáo theo loại thay vì theo từng URL */
export function pageType(pathname) {
  if (pathname === "/") return "trang_chu";
  const [section, slug] = pathname.split("/").filter(Boolean);
  if (section === "nganh-dao-tao") return slug ? "chi_tiet_nganh" : "danh_sach_nganh";
  if (section === "tin-tuc") return slug ? "chi_tiet_tin" : "danh_sach_tin";
  if (section === "cam-nang") return slug ? "chi_tiet_cam_nang" : "danh_sach_cam_nang";
  return section ? `trang_${section.replace(/-/g, "_")}` : "khac";
}

/** Gửi page_view cho mỗi lần đổi trang (gọi 1 lần ở RootLayout) */
export function trackPageView(pathname) {
  if (typeof window === "undefined") return;
  tagClarity("page_type", pageType(pathname));
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
    page_type: pageType(pathname),
  });
}
