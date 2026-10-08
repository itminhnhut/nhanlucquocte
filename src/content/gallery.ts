// Thư viện ảnh (/hinh-anh). Ảnh lấy từ chính bài viết trên website của trường
// (trungcapnhanlucquocte.vn), đã nén lại sang webp và lưu trong public/images/gallery.
//
// QUY TẮC: chỉ dùng ảnh do nhà trường chụp/đăng. KHÔNG dùng ảnh trong bài mà trường lấy từ nơi
// khác (ảnh thumbnail Google, ảnh của trường khác, ảnh báo chí) — những ảnh đó không thuộc quyền
// của trường. Cũng không đưa poster thiết kế vào đây, thư viện ảnh là để xem hoạt động thật.
// TODO nhà trường gửi thêm: ảnh phòng thực hành từng ngành, cơ sở vật chất, ảnh lớp theo khóa.

export interface GalleryPhoto {
  /** Tên file trong public/images/gallery (không có đuôi) */
  name: string;
  /** Mô tả để làm alt — nêu đúng việc đang diễn ra trong ảnh */
  alt: string;
  width: number;
  height: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  /** Bài viết trên site có nội dung đầy đủ về sự kiện này */
  postSlug?: string;
  photos: readonly GalleryPhoto[];
}

export const GALLERY_PATH = "/hinh-anh";

export const GALLERY_ALBUMS: readonly GalleryAlbum[] = [
  {
    id: "khai-giang",
    title: "Lễ khai giảng",
    description:
      "Lễ khai giảng của trường, nơi học viên khóa mới nhận lớp và bắt đầu chương trình học.",
    postSlug: "le-khai-giang-hom-nay-mot-khoi-dau-dang-nho",
    photos: [
      { name: "khai-giang-tap-the", alt: "Cán bộ, giáo viên và học viên chụp ảnh chung trong lễ khai giảng", width: 893, height: 437 },
      { name: "khai-giang-hoi-truong", alt: "Hội trường lễ khai giảng của Trường Trung cấp nghề Nhân Lực Quốc Tế", width: 1024, height: 598 },
    ],
  },
  {
    id: "tot-nghiep",
    title: "Lễ trao bằng tốt nghiệp và học bổng",
    description:
      "Lễ trao bằng tốt nghiệp kết hợp trao học bổng cho học viên hoàn thành chương trình.",
    postSlug: "khep-lai-thanh-cong-le-trao-bang-tot-nghiep-2026-va-trao-hoc-bong",
    photos: [
      { name: "trao-bang-san-khau", alt: "Sân khấu lễ trao bằng tốt nghiệp hệ trung cấp của nhà trường", width: 1024, height: 768 },
      { name: "trao-bang-hoc-vien", alt: "Học viên nhận bằng tốt nghiệp trong buổi lễ", width: 1024, height: 768 },
      { name: "trao-hoc-bong", alt: "Trao bảng học bổng cho học viên tại lễ tốt nghiệp", width: 695, height: 908 },
      { name: "nhan-bang-tot-nghiep", alt: "Học viên nhận bằng tốt nghiệp và hoa chúc mừng", width: 700, height: 466 },
    ],
  },
  {
    id: "lop-hoc",
    title: "Lớp học và giờ thực hành",
    description:
      "Giờ học trên lớp, lớp tiếng Hàn và giờ thực hành của học viên tại cơ sở của trường.",
    photos: [
      { name: "lop-tieng-han", alt: "Giảng viên đứng lớp trong giờ học tiếng Hàn", width: 2048, height: 1152 },
      { name: "gio-hoc-tren-lop", alt: "Học viên trong giờ học trên lớp", width: 1280, height: 960 },
      { name: "thuc-hanh-dieu-duong", alt: "Học viên thực hành đo huyết áp trong giờ học chăm sóc sức khỏe", width: 2048, height: 1152 },
    ],
  },
  {
    id: "ky-nang-mem",
    title: "Đào tạo kỹ năng mềm",
    description:
      "Các buổi đào tạo kỹ năng mềm cho học viên khóa mới và cho người chuẩn bị đi làm việc ở nước ngoài.",
    postSlug: "dao-tao-ky-nang-mem-chuyen-sau-danh-cho-hoc-vien-buoc-chuan-bi-vung-chac-truoc-khi-xuat-canh",
    photos: [
      { name: "ky-nang-mem-4", alt: "Buổi đào tạo kỹ năng mềm cho học viên trước khi xuất cảnh", width: 825, height: 324 },
      { name: "ky-nang-mem-1", alt: "Học viên tham gia buổi học kỹ năng mềm", width: 321, height: 271 },
      { name: "ky-nang-mem-2", alt: "Lớp kỹ năng mềm của học viên nhà trường", width: 407, height: 351 },
      { name: "ky-nang-mem-3", alt: "Học viên trao đổi trong buổi đào tạo kỹ năng mềm", width: 412, height: 340 },
    ],
  },
  {
    id: "thiet-bi",
    title: "Thiết bị thực hành",
    description:
      "Lễ bàn giao xe điện VinFast VF8 phục vụ đào tạo ngành Kỹ thuật sửa chữa ô tô.",
    postSlug: "le-ban-giao-xe-vinfast-8-cho-nganh-ky-thuat-sua-chua-o-to",
    photos: [
      { name: "ban-giao-xe-vinfast", alt: "Lễ bàn giao xe điện VinFast VF8 phục vụ đào tạo ngành ô tô", width: 1437, height: 752 },
      { name: "le-ban-giao-xe", alt: "Hội trường buổi lễ bàn giao xe phục vụ đào tạo", width: 1251, height: 762 },
    ],
  },
  {
    id: "cong-dong",
    title: "Hoạt động cộng đồng",
    description: "Học viên và cán bộ, giáo viên nhà trường tham gia hiến máu tình nguyện.",
    postSlug: "hien-mau-hom-nay-trao-hy-vong-ngay-mai",
    photos: [
      { name: "hien-mau-tinh-nguyen", alt: "Học viên và giáo viên tham gia hiến máu tình nguyện", width: 2048, height: 1536 },
    ],
  },
];

export const GALLERY_PHOTO_COUNT = GALLERY_ALBUMS.reduce((total, album) => total + album.photos.length, 0);
