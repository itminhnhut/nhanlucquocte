// Chính sách bảo vệ dữ liệu cá nhân (Luật BVDLCN 91/2025/QH15, NĐ 356/2025/NĐ-CP).
// BẢN NHÁP: nhà trường/pháp chế cần duyệt trước khi coi là chính thức. Đổi nội dung chính sách
// → tăng PRIVACY_POLICY_VERSION (ghi kèm bằng chứng đồng ý ở form đăng ký).
import appConfig from "../configs/appConfig";
import type { GuideSection } from "./guides";

export const PRIVACY_POLICY_PATH = "/chinh-sach-bao-mat";
export const PRIVACY_POLICY_VERSION = "2026-09-24";

/** Ghi vào ghi chú của đăng ký tư vấn: bằng chứng người dùng đã tích ô đồng ý */
export function consentNote(now: Date = new Date()): string {
  return `[Đồng ý Chính sách bảo vệ dữ liệu cá nhân phiên bản ${PRIVACY_POLICY_VERSION}, lúc ${now.toISOString()}]`;
}


/** Mô tả đúng những gì website thu: form tư vấn, CCCD khi tra cứu văn bằng, cookie đo lường.
 *  Đo lường gồm HAI công cụ: Google Analytics (G-1J20C6MJPZ, có anonymize_ip) và Microsoft Clarity
 *  (yuly13i8pk — quay lại phiên, bản đồ nhiệt). Cả hai CHỈ được tải sau khi người dùng bấm "Đồng ý"
 *  trên thông báo cookie (src/components/CookieConsent.jsx); không bấm thì không script nào chạy.
 *  Clarity bị tắt ở /tra-cuu-van-bang vì màn hình đó hiện dữ liệu của người có bằng — người đó
 *  không phải người đang xem và chưa đồng ý gì. Sửa cơ chế thì sửa luôn các mục dưới đây. */
export const PRIVACY_SECTIONS: readonly GuideSection[] = [
  {
    heading: "Đơn vị chịu trách nhiệm xử lý dữ liệu",
    paragraphs: [
      `**${appConfig.legalName}**, ${appConfig.address}. Điện thoại: ${appConfig.phone}. Email: ${appConfig.email}.`,
    ],
  },
  {
    heading: "Dữ liệu chúng tôi thu và mục đích sử dụng",
    list: [
      "**Form đăng ký tư vấn:** họ tên, số điện thoại, email (không bắt buộc) và nội dung tin nhắn bạn nhập. Mục đích: liên hệ tư vấn tuyển sinh theo yêu cầu của bạn.",
      "**Tra cứu văn bằng:** số căn cước công dân (CCCD) bạn nhập. Mục đích: tìm văn bằng, chứng chỉ do trường cấp tương ứng với số CCCD đó.",
      "**Google Analytics (chỉ khi bạn bấm Đồng ý):** trang đã xem, thời gian xem, loại thiết bị, trình duyệt và khu vực gần đúng. Mục đích: thống kê lượt truy cập để cải thiện nội dung. Công cụ được bật chế độ ẩn bớt địa chỉ IP và không nhận họ tên hay số điện thoại của bạn.",
      "**Microsoft Clarity (chỉ khi bạn bấm Đồng ý):** ghi lại thao tác của bạn trên trang — di chuột, cuộn, bấm — để dựng bản đồ nhiệt và xem lại phiên, nhằm tìm chỗ người đọc gặp khó. Công cụ này **không chạy ở trang tra cứu văn bằng**, vì màn hình đó hiện dữ liệu của người có bằng chứ không phải của bạn.",
    ],
    paragraphs: [
      "Chúng tôi không dùng dữ liệu của bạn cho mục đích khác với các mục đích trên, và không mua bán dữ liệu cá nhân.",
    ],
  },
  {
    heading: "Căn cứ xử lý dữ liệu",
    paragraphs: [
      "**Dữ liệu bạn chủ động gửi** (form đăng ký tư vấn, số CCCD khi tra cứu văn bằng) chỉ được xử lý khi bạn đồng ý: bạn phải tự tích ô đồng ý trước khi gửi form, ô này không được tích sẵn. Im lặng hoặc không chọn không được coi là đồng ý.",
      "**Công cụ đo lường** chỉ được bật sau khi bạn bấm \"Đồng ý\" trên thông báo cookie. Nếu bạn bấm \"Từ chối\" hoặc không chọn gì, Google Analytics và Microsoft Clarity đều không được tải và không nhận được dữ liệu nào của bạn.",
    ],
  },
  {
    heading: "Bên nhận dữ liệu và chuyển dữ liệu ra nước ngoài",
    list: [
      "**Google LLC (Google Analytics):** nhận dữ liệu truy cập khi bạn đã đồng ý. Dữ liệu được lưu trên máy chủ của Google, có thể ở ngoài Việt Nam.",
      "**Microsoft Corporation (Microsoft Clarity):** nhận dữ liệu thao tác trên trang khi bạn đã đồng ý. Dữ liệu được lưu trên máy chủ của Microsoft, có thể ở ngoài Việt Nam.",
      "**Nhà cung cấp dịch vụ lưu trữ website:** lưu trữ dữ liệu form đăng ký tư vấn thay mặt nhà trường.",
    ],
  },
  {
    heading: "Thời gian lưu trữ",
    paragraphs: [
      "Dữ liệu đăng ký tư vấn được lưu trong thời gian cần thiết để tư vấn tuyển sinh, hoặc đến khi bạn rút đồng ý hay yêu cầu xoá, trừ trường hợp pháp luật yêu cầu lưu lâu hơn. Dữ liệu Google Analytics được lưu theo thời hạn lưu giữ cài đặt trong Google Analytics.",
    ],
  },
  {
    heading: "Quyền của bạn",
    intro: "Theo Luật Bảo vệ dữ liệu cá nhân, bạn có quyền:",
    list: [
      "Được biết về việc xử lý dữ liệu cá nhân của mình.",
      "Đồng ý hoặc không đồng ý, và rút lại sự đồng ý bất cứ lúc nào.",
      "Xem, yêu cầu chỉnh sửa hoặc xoá dữ liệu cá nhân của mình.",
      "Yêu cầu hạn chế hoặc phản đối việc xử lý dữ liệu.",
      "Khiếu nại, tố cáo theo quy định của pháp luật.",
    ],
  },
  {
    heading: "Cách thực hiện quyền và rút lại đồng ý",
    list: [
      `Gửi email tới **${appConfig.email}** hoặc gọi **${appConfig.phone}**, nêu rõ yêu cầu và thông tin bạn đã cung cấp (họ tên, số điện thoại) để nhà trường xác định dữ liệu.`,
      "Với công cụ đo lường: bấm **\"Cài đặt cookie\"** ở cuối mỗi trang để chọn lại. Khi bạn chọn Từ chối, website không tải Google Analytics và Microsoft Clarity nữa, đồng thời xoá cookie hai công cụ này đã đặt trên trình duyệt của bạn.",
    ],
  },
  {
    heading: "Cập nhật chính sách",
    paragraphs: [
      `Chính sách có hiệu lực từ ngày ${PRIVACY_POLICY_VERSION.split("-").reverse().join("/")}. Khi thay đổi, nhà trường cập nhật trên trang này kèm ngày hiệu lực mới.`,
    ],
  },
];
