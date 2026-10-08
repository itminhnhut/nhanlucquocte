// Thông tin trường — viết lại từ nội dung trang Giới thiệu của trungcapnhanlucquocte.vn (08/10/2026),
// đã sửa lỗi chính tả của bản cũ. Chỉ giữ những gì site cũ nêu, không thêm số liệu tự nghĩ.
// TODO nhà trường xác nhận: số liệu "20 ngàn lao động" và "2.500 lượt học viên/năm" còn đúng tới nay không.

export interface Milestone {
  year: string;
  text: string;
}

export const HISTORY: readonly Milestone[] = [
  {
    year: "13/12/2007",
    text: "Bộ Lao động – Thương binh và Xã hội ra Quyết định số 1777/LĐTBXH-QĐ thành lập Trường Trung cấp nghề Nhân Lực Quốc Tế, nhằm nâng cao chất lượng nguồn nhân lực xuất khẩu tại các tỉnh phía Nam.",
  },
  {
    year: "2008 – 2012",
    text: "Đào tạo hơn 20.000 lao động cho hàng chục công ty, cung ứng cho thị trường trong nước và các thị trường Nhật Bản, Hàn Quốc, Đài Loan.",
  },
  {
    year: "Ghi nhận",
    text: "Phó Thủ tướng Chính phủ Phạm Gia Khiêm đến thăm và làm việc với cán bộ, giáo viên nhà trường, đánh giá cao tính chuyên nghiệp trong hoạt động đào tạo và định hướng phát triển của trường.",
  },
  {
    year: "Hiện nay",
    text: "Tuyển sinh hệ trung cấp và sơ cấp theo chỉ tiêu nhà nước, với hơn 2.500 lượt học viên mỗi năm.",
  },
];

/** Số liệu nổi bật ở trang chủ — chỉ dùng con số có căn cứ trong nội dung nhà trường */
export const HIGHLIGHTS = [
  { value: "2007", label: "Năm thành lập theo QĐ 1777/LĐTBXH-QĐ" },
  { value: "20.000+", label: "Lao động được đào tạo trong 5 năm đầu" },
  { value: "2.500+", label: "Lượt học viên mỗi năm" },
] as const;

export const CORE_VALUES = [
  {
    title: "Học đi đôi với làm",
    text: "Chương trình tập trung vào thực hành, gắn đào tạo nghề với nhu cầu thực tế của doanh nghiệp.",
  },
  {
    title: "Hiểu văn hóa nơi đến làm việc",
    text: "Trang bị kiến thức về đất nước, con người, văn hóa và tác phong làm việc chuyên nghiệp của thị trường lao động ngoài nước.",
  },
  {
    title: "Kỹ năng mềm song song kỹ năng nghề",
    text: "Không chỉ dạy nghề mà còn rèn kỹ năng mềm và kỹ năng văn phòng cần thiết cho công việc.",
  },
  {
    title: "Đáp ứng chuẩn quốc tế",
    text: "Đào tạo lao động có tay nghề, đáp ứng yêu cầu khắt khe của thị trường lao động quốc tế.",
  },
] as const;

export const VISION =
  "Trở thành cơ sở đào tạo nghề uy tín, không ngừng nâng cao chất lượng đào tạo, cơ sở vật chất và kỹ năng thực hành để phù hợp với thị trường lao động hiện đại.";

export const MISSION =
  "Đào tạo nguồn nhân lực có tay nghề vững, kỹ năng thực hành cao, đáp ứng nhu cầu thị trường lao động trong nước và quốc tế; đồng thời tạo cơ hội việc làm bền vững và nâng cao chất lượng cuộc sống cho người học.";

export const FACULTY =
  "Đội ngũ giáo viên, chuyên gia người Việt và người nước ngoài, trình độ từ cử nhân, thạc sĩ đến tiến sĩ, giảng dạy các lĩnh vực: công nghệ thông tin, quản trị kinh doanh, chăm sóc sức khỏe, xây dựng, trồng trọt, sửa chữa ô tô, nghiệp vụ nhà hàng – khách sạn và ngoại ngữ (Anh, Hoa, Nhật, Hàn).";
