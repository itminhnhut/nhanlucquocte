// Trang /hoc-phi.
//
// QUY TẮC CỦA TRANG NÀY (chốt 09/10/2026): chỉ ghi những gì nhà trường ĐÃ CÔNG BỐ trên
// trungcapnhanlucquocte.vn. Đã rà toàn bộ 53 trang của site đó:
//   - Mức học phí duy nhất trường công bố: "Học phí: 8.800.000 đồng/ khóa (bao gồm nguyên vật liệu
//     thực hành)" ở bài "KHAI GIẢNG LỚP NẤU ĂN NHÀ HÀNG KHÓA 08/2025", đăng 04/8/2025.
//   - KHÔNG có bảng học phí các ngành khác.
//   - KHÔNG có chữ nào về miễn, giảm, hỗ trợ học phí hay học bổng theo chính sách Nhà nước.
//   - Mục "Hướng dẫn thanh toán" ở chân trang chỉ là dòng chữ, không có trang nội dung.
//
// Vì vậy trang này KHÔNG nêu: các khoản phải đóng của một khóa, giấy tờ xin miễn giảm, chính sách
// miễn giảm theo nghị định, hay danh sách câu nên hỏi — đó đều là nội dung tự thêm, trường chưa
// công bố. Nếu nhà trường gửi bảng học phí hoặc văn bản về mức hỗ trợ thì mới thêm mục mới.
// Phần tra cứu căn cứ pháp lý đã làm sẵn, để ở docs/can-truong-cung-cap.md mục 5.
import appConfig from "../configs/appConfig";
import type { GuideSection } from "./guides";

export const FEES_PATH = "/hoc-phi";

/** Khóa học duy nhất nhà trường đã công bố học phí — mọi chi tiết lấy từ thông báo gốc */
export const PUBLISHED_FEE = {
  course: "Nấu ăn nhà hàng – Khóa 08/2025",
  amount: "8.800.000 đồng/khóa",
  includes: "bao gồm nguyên vật liệu thực hành",
  announcedOn: "04/8/2025",
} as const;

export const FEES_LEAD = `Nhà trường công bố học phí theo từng thông báo khai giảng, chưa đăng bảng học phí chung cho tất cả các ngành. Trang này nêu đúng mức học phí trường đã công bố và cách liên hệ để nhận học phí của ngành bạn quan tâm. Gọi ${appConfig.phone} hoặc nhắn Zalo — tư vấn miễn phí.`;

export const FEES_SECTIONS: readonly GuideSection[] = [
  {
    heading: "Mức học phí nhà trường đã công bố",
    intro: `Trong các thông báo đã đăng, nhà trường công bố học phí của khóa **${PUBLISHED_FEE.course}**:`,
    list: [
      `**${PUBLISHED_FEE.amount}** (${PUBLISHED_FEE.includes}) — theo thông báo khai giảng đăng ngày ${PUBLISHED_FEE.announcedOn}.`,
    ],
    paragraphs: [
      `Đây là mức của riêng khóa học đó tại thời điểm thông báo, không phải mức áp dụng cho mọi ngành và có thể đã thay đổi. Học phí các ngành khác nhà trường chưa đăng trên website, nên trang này không nêu con số thay nhà trường.`,
    ],
  },
  {
    heading: "Nhận học phí ngành bạn quan tâm",
    paragraphs: [
      `Cách nhanh nhất là liên hệ trực tiếp bộ phận tuyển sinh: gọi **${appConfig.phone}**, [nhắn Zalo](${appConfig.zalo}), gửi email [${appConfig.email}](mailto:${appConfig.email}) hoặc [để lại thông tin](/#register). Bạn cũng có thể tới trực tiếp ${appConfig.address}.`,
      `Khi hỏi, nên hỏi học phí **trọn khóa** của đúng ngành và đúng hệ (trung cấp hay sơ cấp, ngắn hạn), vì mỗi ngành mỗi hệ một mức khác nhau. Danh sách ngành và hệ đào tạo xem ở trang [tuyển sinh](/tuyen-sinh).`,
    ],
  },
  {
    heading: "Học phí hệ liên thông đại học",
    paragraphs: [
      `Chương trình liên thông lên đại học do **Trường Đại học Công Nghệ và Quản Lý Hữu Nghị** tuyển sinh và cấp bằng, có phòng đào tạo riêng. Nhà trường công bố liên hệ: **Phòng Đào tạo – Hệ Liên thông Đại học, Cao đẳng**, Tầng 2, số 02 Hồng Hà, P.2, Q. Tân Bình, TP. Hồ Chí Minh — điện thoại **096 28 79 680**, email [lienthongdaihoc.edu@trungcapnhanlucquocte.vn](mailto:lienthongdaihoc.edu@trungcapnhanlucquocte.vn). Học phí hệ này hỏi trực tiếp phòng đào tạo liên thông.`,
    ],
  },
];
