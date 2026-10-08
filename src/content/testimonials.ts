// Cảm nhận học viên — lấy từ khối "CẢM NHẬN HỌC VIÊN" trên website của trường
// (trungcapnhanlucquocte.vn, 08/10/2026): giữ nguyên câu nói và ảnh.
// Tên trên site cũ là tên mẫu của bên thiết kế web ("Nguyễn Văn A", "Trần Thị B"…) nên ở đây ghi
// theo ngành học thay vì tên người không có thật.
// TODO nhà trường cung cấp: tên thật + ảnh thật của học viên (kèm sự đồng ý đăng) để thay vào.
export interface Testimonial {
  /** Dòng tên hiển thị dưới câu nói */
  name: string;
  /** Ngành hoặc khóa đang học */
  major: string;
  /** Slug ngành trong danh mục, để link về trang ngành (tuỳ chọn) */
  programSlug?: string;
  /** Ảnh vuông trong public/images/testimonials */
  photo?: string;
  content: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: "Học viên nhà trường",
    major: "Ngành Công nghệ thông tin",
    programSlug: "nganh-cong-nghe-thong-tin-he-trung-cap",
    photo: "/images/testimonials/hv-cntt.webp",
    content:
      "Giảng viên tại trường rất tận tâm và luôn hỗ trợ học viên hết mình. Tôi đã học được nhiều kiến thức thực tiễn, giúp ích rất nhiều cho công việc hiện tại.",
  },
  {
    name: "Học viên nhà trường",
    major: "Ngành Quản trị kinh doanh",
    programSlug: "tuyen-sinh-trung-cap-nganh-quan-tri-kinh-doanh",
    photo: "/images/testimonials/hv-quan-tri-kinh-doanh.webp",
    content:
      "Chương trình học được thiết kế rất thực tế, bám sát nhu cầu thị trường lao động. Tôi cảm thấy tự tin khi bước vào môi trường làm việc.",
  },
  {
    name: "Học viên nhà trường",
    major: "Ngành Quản trị khách sạn",
    programSlug: "quan-tri-khach-san",
    photo: "/images/testimonials/hv-du-lich.webp",
    content:
      "Nhờ các buổi thực hành và chuyến tham quan thực tế, tôi hiểu rõ hơn về nghề mình theo đuổi. Đây là nơi lý tưởng để phát triển kỹ năng.",
  },
  {
    name: "Học viên nhà trường",
    major: "Ngành Điều dưỡng",
    programSlug: "chuyen-nganh-dieu-duong-he-trung-cap",
    photo: "/images/testimonials/hv-y-duoc.webp",
    content:
      "Cơ sở vật chất cùng sự nhiệt huyết của thầy cô là những điểm khiến tôi ấn tượng nhất. Học ở trường thực sự là một trải nghiệm đáng nhớ.",
  },
];

/** Lý do chọn trường — dùng khi chưa có cảm nhận học viên */
export const REASONS = [
  {
    icon: "🏫",
    title: "Trường nghề thành lập năm 2007",
    text: "Thành lập theo Quyết định 1777/LĐTBXH-QĐ của Bộ Lao động – Thương binh và Xã hội, đào tạo trình độ trung cấp và sơ cấp.",
  },
  {
    icon: "🛠️",
    title: "Học đi đôi với thực hành",
    text: "Chương trình bám nhu cầu tuyển dụng thực tế, phần lớn thời lượng là thực hành tại xưởng, phòng thực hành của trường.",
  },
  {
    icon: "🌏",
    title: "Kinh nghiệm đào tạo nhân lực quốc tế",
    text: "Từ 2008 đến 2012 đã đào tạo hơn 20.000 lao động cho các thị trường Nhật Bản, Hàn Quốc, Đài Loan và doanh nghiệp trong nước.",
  },
  {
    icon: "📝",
    title: "Xét tuyển, nhận hồ sơ quanh năm",
    text: "Không thi tuyển, nhận cả học viên tốt nghiệp THCS (học thêm văn hóa THPT theo quy định), khai giảng nhiều đợt trong năm.",
  },
] as const;
