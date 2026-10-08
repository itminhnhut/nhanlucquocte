// Trang "Công khai thông tin" (Điều lệ trường trung cấp: trách nhiệm công khai). CHỈ đăng thông tin
// đã xác nhận trong repo. Các mục còn thiếu (quy chế tổ chức hoạt động, học phí từng ngành, đội ngũ,
// cơ sở vật chất, tỷ lệ việc làm…) chờ nhà trường cung cấp: xem docs/can-truong-cung-cap.md.
import appConfig from "../configs/appConfig";

export const DISCLOSURE_PATH = "/cong-khai";

export const SCHOOL_IDENTITY = [
  { label: "Tên trường", value: appConfig.legalName },
  { label: "Quyết định thành lập", value: `Ngày 13/12/2007, theo ${appConfig.foundingDecision}` },
  { label: "Loại hình", value: "Trường trung cấp nghề, đào tạo trình độ trung cấp và sơ cấp" },
  { label: "Địa chỉ", value: appConfig.address },
  { label: "Điện thoại", value: appConfig.phone },
  { label: "Email", value: appConfig.email },
  { label: "Website", value: "trungcapnhanlucquocte.vn" },
] as const;
