// Title + description trang tĩnh. Chuẩn: title ~50–60 ký tự (từ khoá trước, thương hiệu sau),
// description ~140–160 ký tự, mỗi trang một nội dung riêng. Không dùng meta keywords (Google bỏ qua).
// Tên trường luôn viết đủ "Trường Trung cấp nghề" + có địa danh (Tân Bình / TPHCM) để Google không
// nhầm với các đơn vị trùng tên "Nhân lực Quốc tế" và với SIM Singapore.

export type SeoEntry = {
  title: string;
  description: string;
  ogImage?: string;
};

export const BRAND_SUFFIX = "Trường Trung cấp nghề Nhân Lực Quốc Tế";

// Google cắt title ~60 ký tự → dùng hậu tố thương hiệu dài nhất còn vừa, không vừa thì bỏ
export const MAX_TITLE_LENGTH = 60;
const BRAND_VARIANTS = [BRAND_SUFFIX, "Trung cấp nghề Nhân Lực Quốc Tế", "Nhân Lực Quốc Tế"];

export function withBrandFit(headline: string): string {
  const fitting = BRAND_VARIANTS.map((brand) => `${headline} | ${brand}`).find(
    (title) => title.length <= MAX_TITLE_LENGTH
  );
  return fitting ?? headline;
}

export const SEO_CONFIG: Record<string, SeoEntry> = {
  "/": {
    title: "Trường Trung cấp nghề Nhân Lực Quốc Tế – Tân Bình TPHCM",
    description:
      "Trường Trung cấp nghề Nhân Lực Quốc Tế tại Tân Bình, TPHCM. Thành lập 2007, đào tạo trung cấp và sơ cấp: điều dưỡng, dược, chăm sóc sắc đẹp, bếp, kỹ thuật.",
  },
  "/gioi-thieu": {
    title: "Giới thiệu Trường Trung cấp nghề Nhân Lực Quốc Tế TPHCM",
    description:
      "Giới thiệu Trường Trung cấp nghề Nhân Lực Quốc Tế: thành lập 13/12/2007 theo QĐ 1777/LĐTBXH-QĐ, trụ sở tại Tân Bình, TPHCM, ngành đào tạo và đội ngũ.",
  },
  "/nganh-dao-tao": {
    title: withBrandFit("Ngành đào tạo trung cấp nghề và sơ cấp TPHCM"),
    description:
      "Ngành đào tạo trung cấp nghề và khóa sơ cấp tại Tân Bình, TPHCM: điều dưỡng, dược, chăm sóc sắc đẹp, chế biến món ăn, kỹ thuật, kế toán, công nghệ thông tin.",
  },
  "/du-hoc": {
    title: withBrandFit("Du học, làm việc ở nước ngoài"),
    description:
      "Du học và đi làm việc ở nước ngoài: trường đào tạo nghề, tiếng Hàn và kỹ năng mềm trước khi xuất cảnh, tư vấn hồ sơ miễn phí tại Tân Bình, TPHCM.",
  },
  "/tuyen-sinh": {
    title: "Tuyển sinh trung cấp nghề TPHCM – Xét tuyển từ THCS",
    description:
      "Tuyển sinh trung cấp nghề TPHCM: xét tuyển từ THCS, không thi tuyển, nhận hồ sơ quanh năm tại Tân Bình. Ngành đào tạo, điều kiện, hồ sơ và cách đăng ký.",
  },
  "/hoc-phi": {
    title: "Học phí trung cấp nghề và chính sách miễn giảm",
    description:
      "Học phí trung cấp nghề gồm khoản nào, ai được miễn theo Nghị định 81/2021/NĐ-CP, giấy tờ cần chuẩn bị và cách nhận bảng học phí từng ngành tại TPHCM.",
  },
  "/hop-tac-doanh-nghiep": {
    title: "Hợp tác doanh nghiệp, thực tập và tuyển dụng học viên",
    description:
      "Hợp tác doanh nghiệp của trường: thực tập tại khách sạn, tuyển dụng trong và ngoài nước, thiết bị thực hành và chương trình liên thông đại học cho học viên.",
  },
  "/hoat-dong-hoc-vien": {
    title: "Hoạt động học viên – Trung cấp nghề Nhân Lực Quốc Tế",
    description:
      "Hoạt động học viên: lễ khai giảng, lễ trao bằng và học bổng, khóa kỹ năng mềm, hiến máu tình nguyện tại Trường Trung cấp nghề Nhân Lực Quốc Tế, Tân Bình, TPHCM.",
  },
  "/hinh-anh": {
    title: "Hình ảnh hoạt động Trường Trung cấp nghề Nhân Lực Quốc Tế",
    description:
      "Hình ảnh lễ khai giảng, lễ trao bằng tốt nghiệp, giờ học và thực hành, đào tạo kỹ năng mềm và hoạt động cộng đồng của học viên tại Tân Bình, TPHCM.",
  },
  "/tra-cuu-van-bang": {
    title: "Tra cứu văn bằng Trường Trung cấp nghề Nhân Lực Quốc Tế",
    description:
      "Tra cứu văn bằng, chứng chỉ do Trường Trung cấp nghề Nhân Lực Quốc Tế cấp: nhập số CCCD đã đăng ký khi nhập học để xác minh bằng trung cấp, chứng chỉ sơ cấp.",
  },
  "/tin-tuc": {
    title: withBrandFit("Tin tuyển sinh và lịch khai giảng"),
    description:
      "Tin tuyển sinh, lịch khai giảng từng khóa và hoạt động của học viên Trường Trung cấp nghề Nhân Lực Quốc Tế, Tân Bình, TPHCM.",
  },
  "/lien-he": {
    title: "Liên hệ – Trường Trung cấp nghề Nhân Lực Quốc Tế Tân Bình",
    description:
      "Trường trung cấp nghề Tân Bình: số 6 Phan Đình Giót, phường Tân Sơn Hòa, TPHCM, gần sân bay Tân Sơn Nhất. Hotline và Zalo 070 791 7119, bản đồ đường đi.",
  },
  "/cau-hoi-thuong-gap": {
    title: withBrandFit("Học trung cấp nghề mấy năm, cần điều kiện gì?"),
    description:
      "Hỏi đáp tuyển sinh: học trung cấp nghề cần bằng gì, học mấy năm, học phí ra sao, bằng có liên thông đại học không, học xong làm việc gì — Tân Bình, TPHCM.",
  },
  "/cam-nang": {
    title: withBrandFit("Cẩm nang học nghề và hướng nghiệp"),
    description:
      "Cẩm nang chọn nghề và hướng nghiệp: học gì sau THCS, nên học nghề gì, học phí, cơ hội việc làm các ngành điều dưỡng, chăm sóc sắc đẹp, chế biến món ăn.",
  },
  "/cong-khai": {
    title: "Công khai thông tin – Trung cấp nghề Nhân Lực Quốc Tế",
    description:
      "Công khai thông tin Trường Trung cấp nghề Nhân Lực Quốc Tế: quyết định thành lập, ngành nghề đào tạo, văn bằng, điều kiện tuyển sinh và kênh tiếp nhận phản ánh.",
  },
  "/chinh-sach-bao-mat": {
    title: withBrandFit("Chính sách bảo vệ dữ liệu cá nhân"),
    description:
      "Chính sách bảo vệ dữ liệu cá nhân của Trường Trung cấp nghề Nhân Lực Quốc Tế: dữ liệu thu qua website, mục đích, thời gian lưu và cách thực hiện quyền của bạn.",
  },
  "/tim-kiem": {
    title: withBrandFit("Tìm kiếm"),
    description: "Tìm thông tin tuyển sinh và nội dung trên website Trường Trung cấp nghề Nhân Lực Quốc Tế.",
  },
};

/** Helper */
export function getSeoConfig(path: string): SeoEntry | null {
  return SEO_CONFIG[path] ?? null;
}
