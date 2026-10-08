// Khối "Đối tác – Trường liên kết" ở trang chủ.
// Logo và tên đối tác lấy đúng theo dải đối tác trên website của trường
// (trungcapnhanlucquocte.vn, 08/10/2026). Không tự thêm đơn vị nào khác.
// TODO nhà trường xác nhận: nội dung hợp tác cụ thể của từng đối tác để ghi chú chính xác hơn.
export interface Partner {
  /** Tên hiển thị dưới logo */
  name: string;
  /** Ảnh trong public/images/partners */
  logo: string;
  width: number;
  height: number;
}

export const PARTNERS: readonly Partner[] = [
  { name: "University of Technology & Management (UTM)", logo: "/images/partners/utm.webp", width: 238, height: 160 },
  { name: "Sun Moon University (Hàn Quốc)", logo: "/images/partners/sun-moon-university.webp", width: 160, height: 160 },
  { name: "Sheraton Saigon Grand Opera Hotel", logo: "/images/partners/sheraton-saigon.webp", width: 160, height: 160 },
  { name: "Park Hyatt Saigon", logo: "/images/partners/park-hyatt-saigon.webp", width: 170, height: 160 },
  { name: "JW Korea Hospital", logo: "/images/partners/jw-korea-hospital.webp", width: 160, height: 160 },
];
