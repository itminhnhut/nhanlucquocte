// Trang "Công khai thông tin" (Điều lệ trường trung cấp: trách nhiệm công khai). CHỈ đăng thông tin
// đã xác nhận trong repo. Các mục còn thiếu (quy chế tổ chức hoạt động, học phí từng ngành, đội ngũ,
// cơ sở vật chất, tỷ lệ việc làm…) chờ nhà trường cung cấp: xem docs/can-truong-cung-cap.md.
import appConfig from "../configs/appConfig";

export const DISCLOSURE_PATH = "/cong-khai";

export const SCHOOL_IDENTITY = [
  { label: "Tên trường", value: appConfig.legalName },
  // Tên viết tắt và tên hiệu trưởng lấy từ bài của trường: "Trường Trung Cấp Nghề Nhân Lực Quốc
  // Tế (SIM)" và "Thầy Võ Xuân Trung – Hiệu trưởng" (bài bàn giao xe VinFast, 14/04/2026).
  { label: "Tên viết tắt", value: "SIM" },
  { label: "Hiệu trưởng", value: "Thầy Võ Xuân Trung" },
  { label: "Quyết định thành lập", value: `Ngày 13/12/2007, theo ${appConfig.foundingDecision}` },
  { label: "Loại hình", value: "Trường trung cấp nghề, đào tạo trình độ trung cấp và sơ cấp" },
  { label: "Địa chỉ", value: appConfig.address },
  { label: "Điện thoại", value: appConfig.phone },
  { label: "Email", value: appConfig.email },
  { label: "Website", value: "trungcapnhanlucquocte.vn" },
] as const;
