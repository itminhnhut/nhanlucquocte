// Từ khoá chính của từng trang (docs/adr/2026-09-22-tech-seo-audit.md, mục 2–3). Dùng cho
// công cụ quét SEO (scripts/seo/audit.js) và test: từ khoá phải có trong title, H1 hoặc đoạn
// mở đầu, description; mỗi từ khoá chỉ thuộc 1 trang để các trang không tranh nhau.
// Trang tin (CMS) không có từ khoá cố định.
import { GUIDES, GUIDES_PATH, guidePath } from "../content/guides";
import { canonicalProgramSlug } from "../content/programFields";

const STATIC_KEYWORDS: Record<string, string> = {
  "/": "trường trung cấp nghề nhân lực quốc tế",
  "/gioi-thieu": "giới thiệu trường trung cấp nghề nhân lực quốc tế",
  "/nganh-dao-tao": "ngành đào tạo trung cấp nghề",
  "/tuyen-sinh": "tuyển sinh trung cấp nghề tphcm",
  "/du-hoc": "du học làm việc ở nước ngoài",
  "/hoc-phi": "học phí trung cấp nghề",
  "/hop-tac-doanh-nghiep": "hợp tác doanh nghiệp",
  "/hoat-dong-hoc-vien": "hoạt động học viên",
  "/hinh-anh": "hình ảnh hoạt động",
  "/tra-cuu-van-bang": "tra cứu văn bằng",
  "/tin-tuc": "tin tuyển sinh",
  "/lien-he": "trường trung cấp nghề tân bình",
  "/cau-hoi-thuong-gap": "học trung cấp nghề mấy năm",
  [GUIDES_PATH]: "cẩm nang học nghề",
  "/cong-khai": "công khai thông tin",
  "/chinh-sach-bao-mat": "chính sách bảo vệ dữ liệu cá nhân",
};

/** Từ khoá theo slug ngành — điền sau khi import bài ngành vào database (slug thật) */
export const PROGRAM_KEYWORDS: Record<string, string> = {
  "chuyen-nganh-dieu-duong-he-trung-cap": "trung cấp điều dưỡng",
  "tuyen-sinh-nganh-duoc-si-he-trung-cap-khai-giang-ngay-16-03-2026": "trung cấp dược sĩ",
  "cham-soc-sac-dep-he-trung-cap": "trung cấp chăm sóc sắc đẹp",
  "tuyen-sinh-nganh-beauty-therapy-lieu-phap-lam-dep": "beauty therapy",
  "cham-soc-da-chuyen-nghiep": "chăm sóc da",
  "cham-soc-nails-chuyen-nghiep-ngan-han": "chăm sóc nails",
  "ky-thuat-che-bien-mon-an": "kỹ thuật chế biến món ăn",
  "khai-giang-ky-thuat-lam-banh-khoa-106-he-trung-cap": "kỹ thuật làm bánh",
  "nghiep-vu-pha-che": "nghiệp vụ pha chế",
  "quan-tri-khach-san": "trung cấp quản trị khách sạn",
  "khai-giang-nghiep-vu-le-tan": "nghiệp vụ lễ tân",
  "tuyen-sinh-cong-nghe-ky-thuat-o-to-khai-giang-ngay-03-03-2026": "kỹ thuật sửa chữa ô tô",
  "trung-cap-ky-thuat-xay-dung": "trung cấp kỹ thuật xây dựng",
  "thong-bao-tuyen-sinh-nganh-thiet-ke-noi-that-khoa-17": "trung cấp thiết kế nội thất",
  "tuyen-sinh-ky-thuat-moc-xay-dung-va-trang-tri-noi-that": "mộc xây dựng và trang trí nội thất",
  "tuyen-sinh-thang-09-nghe-moc-noi-that-va-trang-tri": "mộc nội thất và trang trí",
  "ke-toan-doanh-nghiep": "trung cấp kế toán doanh nghiệp",
  "tuyen-sinh-trung-cap-nganh-quan-tri-kinh-doanh": "trung cấp quản trị kinh doanh",
  "nganh-cong-nghe-thong-tin-he-trung-cap": "trung cấp công nghệ thông tin",
  "ngon-ngu-han-quoc": "ngôn ngữ hàn quốc",
  "nghiep-vu-bao-mau": "nghiệp vụ bảo mẫu",
  "nghiep-vu-nghe-nong-nghiep-he-so-cap": "nghề nông nghiệp",
  "cham-soc-nguoi-cao-tuoi": "chăm sóc người cao tuổi",
  "tuyen-sinh-khoa-32-nghiep-vu-tro-ly-nha-khoa-khai-giang-ngay-01-07-2026": "trợ lý nha khoa",
  "tuyen-sinh-he-dai-hoc-nam-2025": "liên thông từ trung cấp lên đại học",
  "tuyen-sinh-he-lien-thong-dai-hoc-nganh-quan-tri-dich-vu-an-uong-va-am-thuc": "quản trị dịch vụ ăn uống và ẩm thực",
};

/** Từ khoá chính của 1 đường dẫn, null nếu trang không có từ khoá cố định */
export function targetKeyword(path: string): string | null {
  if (STATIC_KEYWORDS[path]) return STATIC_KEYWORDS[path];
  const programSlug = path.match(/^\/nganh-dao-tao\/([^/]+)$/)?.[1];
  if (programSlug) return PROGRAM_KEYWORDS[canonicalProgramSlug(programSlug)] ?? null;
  return GUIDES.find((guide) => guidePath(guide.slug) === path)?.keyword ?? null;
}
