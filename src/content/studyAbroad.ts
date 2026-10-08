// Trang Du học (/du-hoc) — theo mục "Du học" trên website của trường.
// CHỈ nêu những gì trường đã công bố: lịch sử đưa lao động sang Nhật Bản, Hàn Quốc, Đài Loan;
// đào tạo ngoại ngữ và kỹ năng mềm trước khi xuất cảnh; chương trình du học đang giới thiệu.
// KHÔNG ghi học phí, chi phí, tỉ lệ đậu visa, tên đối tác — chờ nhà trường cung cấp.
// Bài du học cụ thể sẽ hiển thị theo dữ liệu import từ database.
import appConfig from "../configs/appConfig";
import type { GuideSection } from "./guides";

export const STUDY_ABROAD_PATH = "/du-hoc";

export const STUDY_ABROAD_LEAD = `Trường Trung cấp nghề Nhân Lực Quốc Tế được thành lập để nâng cao chất lượng nguồn nhân lực đi làm việc ở nước ngoài, nên bên cạnh đào tạo nghề trong nước, trường tư vấn và chuẩn bị cho người học các chương trình du học, học nghề và làm việc tại nước ngoài. Mọi thông tin tư vấn đều miễn phí: gọi ${appConfig.phone} hoặc nhắn Zalo.`;

export const STUDY_ABROAD_SECTIONS: readonly GuideSection[] = [
  {
    heading: "Trường chuẩn bị gì cho người đi học, đi làm ở nước ngoài",
    list: [
      "**Đào tạo nghề trước khi đi:** người học có tay nghề và chứng chỉ, chứng minh được năng lực với cơ sở tiếp nhận.",
      "**Ngoại ngữ:** khóa tiếng Hàn và các lớp ngoại ngữ phục vụ công việc.",
      "**Kỹ năng mềm và văn hóa nước đến:** tác phong làm việc, nếp sinh hoạt, quy định cần biết trước khi xuất cảnh.",
      "**Tư vấn hồ sơ:** hướng dẫn giấy tờ, lộ trình và các bước chuẩn bị.",
    ],
    paragraphs: [
      "Từ năm 2008 đến 2012, trường đã đào tạo hơn 20.000 lao động cho hàng chục công ty, cung ứng cho thị trường trong nước và các thị trường Nhật Bản, Hàn Quốc, Đài Loan. Các hợp tác với doanh nghiệp, khách sạn và trường đại học xem ở trang [hợp tác doanh nghiệp](/hop-tac-doanh-nghiep).",
    ],
  },
  {
    heading: "Các hướng đi thường gặp",
    list: [
      "**Du học nghề, du học bậc cao hơn:** học tại nước ngoài, có thể làm thêm theo quy định của nước sở tại.",
      "**Học nghề trong nước rồi đi làm việc ở nước ngoài:** học trung cấp hoặc sơ cấp tại trường, học ngoại ngữ, sau đó tham gia chương trình tuyển dụng lao động — các bước chuẩn bị nêu ở bài [học nghề đi làm việc ở nước ngoài](/cam-nang/hoc-nghe-di-lam-viec-nuoc-ngoai).",
      "**Nâng cao tay nghề để chuyển đổi công việc sau khi về nước:** dùng bằng trung cấp để học liên thông hoặc xin việc trong nước.",
    ],
  },
  {
    heading: "Bạn nên chuẩn bị trước",
    list: [
      "Giấy tờ tùy thân, bằng cấp đã có (THCS, THPT, trung cấp) và hồ sơ sức khỏe.",
      "Xác định rõ nước muốn đến và nghề muốn làm — ngoại ngữ và nghề học sẽ theo lựa chọn này.",
      "Thời gian học ngoại ngữ: đây là phần mất nhiều thời gian nhất, nên bắt đầu sớm.",
      "Tìm hiểu kỹ chi phí, hợp đồng và đơn vị tổ chức; chỉ làm việc với đơn vị có giấy phép.",
    ],
    paragraphs: [
      `Để được tư vấn đúng chương trình đang mở, gọi hotline ${appConfig.phone}, [nhắn Zalo](${appConfig.zalo}) hoặc [để lại thông tin](/#register). Trường ở ${appConfig.address}.`,
    ],
  },
];
