// Trang /hoat-dong-hoc-vien — bằng chứng trường đang hoạt động thật (tín hiệu uy tín cho cả người
// đọc lẫn Google). CHỈ ghi sự kiện đã đăng trên trungcapnhanlucquocte.vn, kèm ngày nhà trường công bố.
// KHÔNG thêm số lượng người tham dự, giá trị học bổng hay thành tích chưa công bố.
// TODO nhà trường bổ sung: ảnh sự kiện được phép dùng, số liệu học bổng nếu muốn công khai.
import type { GuideSection } from "./guides";

export const ACTIVITIES_PATH = "/hoat-dong-hoc-vien";

export interface SchoolEvent {
  date: string;
  title: string;
  text: string;
}

export const ACTIVITIES_LEAD =
  "Bên cạnh giờ học nghề, học viên Trường Trung cấp nghề Nhân Lực Quốc Tế tham gia lễ khai giảng, lễ tốt nghiệp, các khóa kỹ năng mềm và hoạt động cộng đồng. Dưới đây là những hoạt động nhà trường đã tổ chức và công bố gần đây.";

export const SCHOOL_EVENTS: readonly SchoolEvent[] = [
  {
    date: "05/05/2026",
    title: "Lễ trao bằng tốt nghiệp và trao học bổng",
    text: "Nhà trường tổ chức Lễ Trao Bằng Tốt Nghiệp & Trao Học Bổng cho học viên hoàn thành chương trình, kết hợp trao học bổng khuyến khích người học.",
  },
  {
    date: "17/04/2026",
    title: "Khai giảng lớp tiếng Hàn",
    text: "Khai giảng lớp tiếng Hàn — phục vụ người học chuẩn bị đi làm việc, học tập tại Hàn Quốc hoặc làm việc trong môi trường dùng tiếng Hàn.",
  },
  {
    date: "22/04/2026",
    title: "Hiến máu tình nguyện",
    text: "Học viên và cán bộ, giáo viên tham gia hoạt động hiến máu tình nguyện do nhà trường tổ chức.",
  },
  {
    date: "15/04/2026",
    title: "Đào tạo kỹ năng mềm trước khi xuất cảnh",
    text: "Buổi đào tạo kỹ năng mềm chuyên sâu cho học viên chuẩn bị đi làm việc ở nước ngoài: tác phong, giao tiếp và những điều cần biết trước khi xuất cảnh.",
  },
  {
    date: "14/04/2026",
    title: "Lễ bàn giao xe điện VinFast VF8 cho ngành ô tô",
    text: "Nhà trường tiếp nhận xe điện VinFast VF8 phục vụ đào tạo ngành Kỹ thuật sửa chữa ô tô, giúp học viên thực hành trên dòng xe đang phổ biến.",
  },
  {
    date: "13/04/2026",
    title: "Khai giảng khóa 106 Kỹ thuật làm bánh",
    text: "Khai giảng khóa 106 ngành Kỹ thuật làm bánh hệ trung cấp — một trong các khóa được mở nhiều đợt trong năm.",
  },
  {
    date: "18/11/2025",
    title: "Hội giảng nhà giáo giáo dục nghề nghiệp cấp thành phố",
    text: "Nhà trường tham dự Lễ khai mạc Hội giảng nhà giáo giáo dục nghề nghiệp cấp thành phố năm 2025 — hoạt động chuyên môn của đội ngũ giáo viên.",
  },
  {
    date: "23/09/2026",
    title: "Học viên khóa mới học kỹ năng mềm",
    text: "Học viên khóa mới tham gia chương trình học tập kỹ năng mềm ngay từ đầu khóa, trước khi vào học chuyên môn.",
  },
];

export const ACTIVITIES_SECTIONS: readonly GuideSection[] = [
  {
    heading: "Học viên được tham gia những gì",
    list: [
      "**Lễ khai giảng và lễ tốt nghiệp** theo từng khóa, có trao học bổng cho người học.",
      "**Khóa kỹ năng mềm** — tổ chức cho học viên khóa mới và cho người chuẩn bị [học nghề đi làm việc ở nước ngoài](/cam-nang/hoc-nghe-di-lam-viec-nuoc-ngoai).",
      "**Hoạt động cộng đồng** như hiến máu tình nguyện.",
      "**Thực hành trên thiết bị thật**, trong đó có xe điện VinFast VF8 phục vụ đào tạo ngành ô tô.",
    ],
  },
  {
    heading: "Hoạt động chuyên môn của giáo viên",
    paragraphs: [
      "Đội ngũ giáo viên nhà trường tham dự Hội giảng nhà giáo giáo dục nghề nghiệp cấp thành phố — hoạt động đánh giá và nâng cao chất lượng giảng dạy trong hệ thống giáo dục nghề nghiệp. Xem thêm [giới thiệu nhà trường](/gioi-thieu).",
    ],
  },
  {
    heading: "Theo dõi hoạt động mới nhất",
    paragraphs: [
      "Thông báo khai giảng, học bổng, thực tập và tuyển dụng được đăng liên tục ở mục [Tin tức](/tin-tuc). Cơ hội thực tập, tuyển dụng từ doanh nghiệp xem tại trang [Hợp tác doanh nghiệp](/hop-tac-doanh-nghiep).",
    ],
  },
];
