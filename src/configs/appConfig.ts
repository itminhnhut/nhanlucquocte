// Thông tin trường — nguồn duy nhất cho giao diện, schema và sitemap.
// Lấy từ site hiện tại trungcapnhanlucquocte.vn (ngày 08/10/2026).
// Hotline lấy từ số Zalo trên site (0707917119) — nút gọi của site cũ để số rác 0123456789.
// TODO nhà trường xác nhận: hotline chính thức, tên tiếng Anh, giờ làm việc, link Facebook/YouTube/
// Google Business Profile, và địa chỉ theo đơn vị hành chính mới sau sáp nhập 01/07/2025.
// Google Maps vẫn định vị theo tên cũ "Phường 2, Tân Bình" nên giữ nguyên cho phần bản đồ
const MAP_QUERY = "Số 6 Phan Đình Giót, Phường 2, Tân Bình, TP. Hồ Chí Minh";

const appConfig = {
  name: "Trường Trung cấp nghề Nhân Lực Quốc Tế",
  // Tên chính thức dùng cho schema/Google (Organization, WebSite)
  legalName: "Trường Trung cấp nghề Nhân Lực Quốc Tế",
  domain: "https://trungcapnhanlucquocte.vn",
  phone: "070 791 7119",
  // Số điện thoại chuẩn quốc tế cho schema
  phoneE164: "+84707917119",
  // Từ 01/07/2025: Phường 1, 2, 3 (Q. Tân Bình) nhập thành phường Tân Sơn Hòa. Giữ tên cũ trong
  // ngoặc để người tìm theo "Tân Bình" vẫn nhận ra, và để khớp Google Business Profile.
  address: "Số 6 Phan Đình Giót, phường Tân Sơn Hòa (Quận Tân Bình cũ), TP. Hồ Chí Minh",
  postalAddress: {
    streetAddress: "Số 6 Phan Đình Giót",
    addressLocality: "Phường Tân Sơn Hòa",
    addressRegion: "Thành phố Hồ Chí Minh",
    addressCountry: "VN",
  },
  // Giờ làm việc (trang Liên hệ): Thứ Hai – Thứ Sáu, 8:00 – 17:00
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
  openingHoursLabel: "Thứ Hai – Thứ Sáu, 8:00 – 17:00",
  // Kênh chính thức của trường, đưa vào schema sameAs để Google/AI nhận đúng thực thể và không
  // nhầm với đơn vị trùng tên. Link nào trống thì tự động bị bỏ qua, không cần xoá dòng.
  // Thứ tự ưu tiên nên có: Google Business Profile (quan trọng nhất cho tìm kiếm theo khu vực)
  // → Facebook/YouTube/TikTok nếu trường đang chạy → trang hồ sơ trên cổng giáo dục nghề nghiệp.
  // Cách lấy link Google: tạo/nhận quyền quản lý hồ sơ doanh nghiệp, mở hồ sơ → Chia sẻ → copy link.
  officialProfiles: {
    googleBusinessProfile: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    /** Trang hồ sơ trường trên cổng thông tin giáo dục nghề nghiệp (nếu có) */
    gdnnProfile: "",
  },
  // Key IndexNow (báo Bing khi trang đổi) — công khai theo thiết kế của giao thức: file
  // public/<key>.txt chứa đúng key để Bing xác minh. Đổi key → đổi luôn tên + nội dung file đó.
  indexNowKey: "b6aa34e7341cabc12fb892d9dae79ce5",
  foundingYear: "2007",
  foundingDecision: "Quyết định số 1777/LĐTBXH-QĐ của Bộ Lao động – Thương binh và Xã hội",
  email: "nhanlucquocte.edu@trungcapnhanlucquocte.vn",
  zalo: "https://zalo.me/0707917119",
  // Link/nhúng Google Maps: dùng địa chỉ Google định vị chính xác
  // Toạ độ lấy từ bản đồ Google trên website của trường (trungcapnhanlucquocte.vn, mục BẢN ĐỒ).
  // Dùng cho schema (tìm kiếm theo khu vực) và cho iframe bản đồ ở trang Liên hệ.
  geo: { latitude: "10.8031003", longitude: "106.6625271" },
  mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`,
  mapUrl: `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`,

  logo: "/images/logo-512.png",
  // Ảnh chia sẻ mặc định (Facebook/Zalo): JPG 1200×630
  defaultOgImage: "/images/og-default.jpg",
  defaultOgImageWidth: 1200,
  defaultOgImageHeight: 630,
};

export default appConfig;
