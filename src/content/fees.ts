// Trang /hoc-phi. Nhà trường CHƯA công bố mức học phí từng ngành → trang này KHÔNG ghi con số học
// phí của trường. Thay vào đó nêu: các khoản phải đóng gồm gì, chính sách miễn giảm của Nhà nước
// (có căn cứ văn bản), hồ sơ xin miễn giảm và cách nhận bảng học phí chính xác.
// Khi nhà trường gửi bảng học phí: thêm mục "Học phí từng ngành" và gắn `offers` vào schema ngành.
import appConfig from "../configs/appConfig";
import type { GuideSection } from "./guides";

export const FEES_PATH = "/hoc-phi";

export const FEES_LEAD = `Học phí trung cấp nghề khác nhau theo từng ngành và từng hệ đào tạo, nên trường gửi bảng học phí cụ thể khi bạn liên hệ tư vấn. Trang này giúp bạn biết trước: một khóa học gồm những khoản nào, ai được Nhà nước miễn hoặc giảm học phí, cần giấy tờ gì để được xét, và nên hỏi gì trước khi nộp hồ sơ. Gọi ${appConfig.phone} hoặc nhắn Zalo để nhận học phí ngành bạn quan tâm.`;

export const FEES_SECTIONS: readonly GuideSection[] = [
  {
    heading: "Một khóa học gồm những khoản nào",
    list: [
      "**Học phí** — tính theo kỳ hoặc theo toàn khóa, khác nhau giữa các ngành; ngành thực hành nhiều thường cao hơn ngành lý thuyết.",
      "**Nguyên vật liệu thực hành** — ngành bếp, bánh, pha chế, chăm sóc sắc đẹp, kỹ thuật phải mua nguyên liệu, vật tư để thực hành trên vật thật.",
      "**Đồng phục, dụng cụ nghề** — dao bếp, bộ dụng cụ làm đẹp, đồ bảo hộ… tùy ngành.",
      "**Lệ phí hồ sơ, thi và cấp bằng** theo quy định của trường.",
      "**Chi phí cá nhân** — đi lại, chỗ ở nếu bạn ở tỉnh; nên tính vào tổng chi phí khi quyết định học.",
    ],
    paragraphs: [
      "Khi hỏi học phí, nên hỏi **tổng chi phí trọn khóa** chứ không chỉ học phí một kỳ, để không bị thiếu hụt giữa chừng.",
    ],
  },
  {
    heading: "Ai được miễn học phí theo quy định của Nhà nước",
    intro:
      "Theo **khoản 17 Điều 15 Nghị định 81/2021/NĐ-CP** (được sửa đổi, bổ sung bởi **Nghị định 97/2023/NĐ-CP**), người **tốt nghiệp THCS học tiếp lên trình độ trung cấp** thuộc đối tượng được **miễn học phí**. Đây là chính sách của Nhà nước, áp dụng cho người học tại cơ sở giáo dục nghề nghiệp.",
    list: [
      "**Diện miễn học phí** — Điều 15 Nghị định 81/2021/NĐ-CP quy định nhiều nhóm đối tượng, trong đó **khoản 17** là người tốt nghiệp THCS học tiếp lên trình độ trung cấp.",
      "**Diện giảm học phí** — Điều 16 Nghị định 81/2021/NĐ-CP quy định các nhóm được giảm 70% và giảm 50% học phí.",
      "**Hỗ trợ chi phí học tập** — Nghị định 81/2021/NĐ-CP cũng quy định các trường hợp được hỗ trợ chi phí học tập.",
    ],
    paragraphs: [
      "Trang này chỉ nêu căn cứ chung. Mỗi nhóm đối tượng có điều kiện và giấy tờ riêng, lại được sửa đổi theo từng thời kỳ, nên bạn hãy mang giấy tờ của mình tới hoặc gọi hotline để nhà trường đối chiếu đúng trường hợp và mức áp dụng tại thời điểm nhập học.",
    ],
  },
  {
    heading: "Giấy tờ cần chuẩn bị để được xét miễn, giảm",
    list: [
      "Đơn đề nghị miễn, giảm học phí theo mẫu của trường.",
      "Bản sao bằng hoặc giấy chứng nhận tốt nghiệp THCS (với diện tốt nghiệp THCS học trung cấp).",
      "Bản sao giấy tờ tùy thân.",
      "Giấy tờ chứng minh thuộc diện chính sách: giấy chứng nhận hộ nghèo/cận nghèo, giấy xác nhận khuyết tật, giấy tờ về đối tượng ưu tiên… tùy trường hợp.",
    ],
    paragraphs: [
      "Nộp cùng lúc với hồ sơ nhập học để được xét ngay từ đầu khóa, tránh phải làm lại thủ tục giữa kỳ. Xem thêm [hồ sơ nhập học trung cấp](/cam-nang/ho-so-nhap-hoc-trung-cap).",
    ],
  },
  {
    heading: "Nhận bảng học phí ngành bạn quan tâm",
    paragraphs: [
      `Mỗi ngành có mức học phí riêng và có thể thay đổi theo từng đợt tuyển sinh, nên nhà trường gửi bảng học phí trực tiếp thay vì đăng cố định. Cách nhanh nhất: gọi hotline ${appConfig.phone}, [nhắn Zalo](${appConfig.zalo}) hoặc [để lại thông tin](/#register) — bộ phận tuyển sinh gửi lại học phí, lịch khai giảng và chính sách áp dụng cho trường hợp của bạn. Tư vấn miễn phí.`,
    ],
  },
  {
    heading: "Những câu nên hỏi trước khi nộp hồ sơ",
    list: [
      "Tổng chi phí trọn khóa ngành tôi chọn là bao nhiêu, đóng theo kỳ hay theo tháng?",
      "Ngoài học phí còn khoản nào bắt buộc trong suốt khóa học?",
      "Trường hợp của tôi có được miễn hoặc giảm học phí không, cần giấy tờ gì?",
      "Có chính sách ưu đãi nhập học sớm, học bổng hoặc chia nhỏ kỳ đóng không?",
      "Nếu phải bảo lưu hoặc nghỉ giữa chừng thì học phí xử lý thế nào?",
    ],
    paragraphs: [
      "Nên hỏi và lưu lại câu trả lời bằng tin nhắn để đối chiếu khi nhập học. Xem thêm [thông tin tuyển sinh](/tuyen-sinh) và [câu hỏi thường gặp](/cau-hoi-thuong-gap).",
    ],
  },
];
