// URL cũ của website hiện tại (đuôi .html) → URL mới. Bắt buộc phải 301, nếu không mọi liên kết
// và thứ hạng Google đang có của trungcapnhanlucquocte.vn sẽ rơi vào trang 404 khi đổi sang web mới.
// Nginx xử lý 301 (docker/nginx.conf); app cũng tự chuyển hướng khi chạy không có nginx (npm run dev)
// và khi gặp link cũ trong nội dung CMS.
//
// Bài ngành: tạm trỏ về trang danh sách /nganh-dao-tao. Sau khi import bài ngành vào database và
// biết slug thật, đổi đích sang đúng trang ngành (PROGRAM_PAGES_READY trong content/programFields.ts).
// Bài tin tức cũ: slug giữ nguyên khi import → quy tắc chung ở nginx chuyển /<slug>.html sang
// /tin-tuc/<slug>; chỉ các URL liệt kê dưới đây là ngoại lệ.

/** Trang chính: URL cũ (không có dấu /) → URL mới */
export const LEGACY_PATHS: Readonly<Record<string, string>> = {
  "trang-chu.html": "",
  "gioi-thieu.html": "gioi-thieu",
  "chuong-trinh-dao-tao.html": "nganh-dao-tao",
  "du-hoc.html": "du-hoc",
  "tra-cuu-van-bang.html": "tra-cuu-van-bang",
  "tin-tuc.html": "tin-tuc",
  "lien-he.html": "lien-he",
  "hinh-anh.html": "hinh-anh",
  "bao-mat-thong-tin.html": "chinh-sach-bao-mat",
  "chinh-sach-hoc-vien.html": "chinh-sach-bao-mat",
  "huong-dan-thanh-toan.html": "tuyen-sinh",
  "dang-ky-tuyen-sinh.html": "tuyen-sinh",
  // Bài này trên website cũ không có nội dung → đưa về trang danh sách ngành
  "tuyen-sinh-lien-thong-he-dai-hoc-nganh-quan-tri-dich-vu-du-lich-lu-hanh-.html": "nganh-dao-tao",
};

/** Bài ngành cũ (.html) → slug ngành trong danh mục (src/content/programFields.ts) */
export const LEGACY_PROGRAM_PATHS: Readonly<Record<string, string>> = {
  "chuyen-nganh-dieu-duong-he-trung-cap-.html": "chuyen-nganh-dieu-duong-he-trung-cap",
  "tuyen-sinh-nganh-duoc-si-he-trunng-cap-khai-giang-ngay-16-03-2026-.html": "tuyen-sinh-nganh-duoc-si-he-trung-cap-khai-giang-ngay-16-03-2026",
  "cham-soc-nguoi-cao-tuoi-.html": "cham-soc-nguoi-cao-tuoi",
  "tuyen-sinh-khoa-32-nghiep-vu-tro-ly-nha-khoa-khai-giang-ngay-01-07-2026.html": "tuyen-sinh-khoa-32-nghiep-vu-tro-ly-nha-khoa-khai-giang-ngay-01-07-2026",
  "cham-soc-sac-dep-he-trung-cap-.html": "cham-soc-sac-dep-he-trung-cap",
  "tuyen-sinh-nganh-beauty-therapy-lieu-phap-lam-dep-.html": "tuyen-sinh-nganh-beauty-therapy-lieu-phap-lam-dep",
  "cham-soc-da-chuyen-nghiep-.html": "cham-soc-da-chuyen-nghiep",
  "cham-soc-nails-chuyen-nghiep-ngan-han-.html": "cham-soc-nails-chuyen-nghiep-ngan-han",
  "ky-thuat-che-bien-mon-an-.html": "ky-thuat-che-bien-mon-an",
  "khai-giang-ky-thuat-lam-banh-khoa-106-he-trung-cap-.html": "khai-giang-ky-thuat-lam-banh-khoa-106-he-trung-cap",
  "quan-tri-khach-san-.html": "quan-tri-khach-san",
  "khai-giang-nghiep-vu-le-tan-.html": "khai-giang-nghiep-vu-le-tan",
  "nghiep-vu-pha-che.html": "nghiep-vu-pha-che",
  "trung-cap-ky-thuat-xay-dung-.html": "trung-cap-ky-thuat-xay-dung",
  "tuyen-sinh-cong-nghe-ky-thuat-o-to-khai-giang-ngay-03-03-2026.html": "tuyen-sinh-cong-nghe-ky-thuat-o-to-khai-giang-ngay-03-03-2026",
  "thong-bao-tuyen-sinh-nganh-thiet-ke-noi-that-khoa-17-.html": "thong-bao-tuyen-sinh-nganh-thiet-ke-noi-that-khoa-17",
  "tuyen-sinh-ky-thuat-moc-xay-dung-va-trang-tri-noi-that-.html": "tuyen-sinh-ky-thuat-moc-xay-dung-va-trang-tri-noi-that",
  "tuyen-sinh-thang-09-nghe-moc-noi-that-va-trang-tri-.html": "tuyen-sinh-thang-09-nghe-moc-noi-that-va-trang-tri",
  "ke-toan-doanh-nghiep-.html": "ke-toan-doanh-nghiep",
  "tuyen-sinh-trung-cap-nganh-quan-tri-kinh-doanh-.html": "tuyen-sinh-trung-cap-nganh-quan-tri-kinh-doanh",
  "nganh-cong-nghe-thong-tin-he-trung-cap-.html": "nganh-cong-nghe-thong-tin-he-trung-cap",
  "ngon-ngu-han-quoc.html": "ngon-ngu-han-quoc",
  "nghiep-vu-bao-mau.html": "nghiep-vu-bao-mau",
  "nghiep-vu-nghe-nong-nghiep-he-so-cap-.html": "nghiep-vu-nghe-nong-nghiep-he-so-cap",
  "tuyen-sinh-he-dai-hoc-nam-2025.html": "tuyen-sinh-he-dai-hoc-nam-2025",
  "tuyen-sinh-he-lien-thong-dai-hoc-nganh-quan-tri-dich-vu-an-uong-va-am-thuc-.html":
    "tuyen-sinh-he-lien-thong-dai-hoc-nganh-quan-tri-dich-vu-an-uong-va-am-thuc",
};
