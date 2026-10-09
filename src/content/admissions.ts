// Trang tuyển sinh cố định (/tuyen-sinh): gom đối tượng, thời gian học, quy trình đăng ký, hồ sơ,
// học phí, văn bằng vào 1 URL giữ hạng lâu dài (bài tin tuyển sinh theo đợt thì trỏ về đây).
// CHỈ ghi thông tin có căn cứ: danh mục ngành trường đang đào tạo (src/content/programFields.ts)
// và quy định của Luật Giáo dục nghề nghiệp số 124/2025/QH15. Học phí: trường chưa công bố trên web →
// chỉ hướng dẫn cách nhận bảng học phí; khi nhà trường gửi bảng học phí thì thêm mục vào đây.
import appConfig from "../configs/appConfig";
import type { GuideSection } from "./guides";
import { PROGRAM_FIELDS, programsWithUnknownLevel, publishedProgramsByLevel } from "./programFields";

export const ADMISSIONS_PATH = "/tuyen-sinh";

// Chỉ lấy ngành trường đã công bố hệ đào tạo: ba dòng dưới có kèm văn bằng, không được đoán
const names = (level: Parameters<typeof publishedProgramsByLevel>[0]) =>
  publishedProgramsByLevel(level)
    .map((program) => program.name)
    .join(", ");

export const ADMISSIONS_LEAD = `Tuyển sinh Trường Trung cấp nghề Nhân Lực Quốc Tế: trường nhận người tốt nghiệp THCS, THPT vào các ngành trung cấp và các khóa sơ cấp, ngắn hạn, khai giảng nhiều đợt trong năm tại ${appConfig.address}. Trang này tổng hợp ngành đang tuyển, điều kiện, hồ sơ, quy trình đăng ký và văn bằng sau tốt nghiệp.`;

export const ADMISSIONS_SECTIONS: readonly GuideSection[] = [
  {
    heading: "Hệ đào tạo và ngành tuyển sinh",
    list: [
      `**Hệ trung cấp** (cấp bằng trung cấp): ${names("trung-cap")}.`,
      `**Khóa sơ cấp, ngắn hạn** (cấp chứng chỉ): ${names("so-cap")}.`,
      `**Liên thông đại học** dành cho người đã có bằng trung cấp: ${names("lien-thong")}.`,
      `**Trường chưa công bố hệ đào tạo** cho các nghề sau, nên trang này không nêu văn bằng: ${programsWithUnknownLevel()
        .map((program) => program.name)
        .join(", ")}. Gọi ${appConfig.phone} để được xác nhận hệ đào tạo và văn bằng.`,
    ],
    paragraphs: [
      `Trường đào tạo ${PROGRAM_FIELDS.length} nhóm lĩnh vực: ${PROGRAM_FIELDS.map((field) => field.name).join(", ")}. Nội dung học và cơ hội việc làm của từng nghề xem ở trang [Câu hỏi thường gặp](/cau-hoi-thuong-gap). Người học ở Tân Bình, Tân Phú và các quận lân cận xem thêm bài [trường trung cấp nghề ở Tân Bình](/cam-nang/truong-trung-cap-nghe-tan-binh).`,
    ],
  },
  {
    heading: "Đối tượng và điều kiện tuyển sinh",
    list: [
      "**Tốt nghiệp THPT:** đăng ký được tất cả ngành trung cấp.",
      "**Tốt nghiệp THCS:** được học trình độ trung cấp và học thêm khối lượng kiến thức văn hóa THPT theo quy định của Bộ Giáo dục và Đào tạo.",
      "**Người đang đi làm:** chọn khóa sơ cấp, ngắn hạn để lấy chứng chỉ nhanh, hoặc học trung cấp theo lịch được tư vấn khi đăng ký.",
      "**Đã tốt nghiệp trung cấp và có bằng THPT** (hoặc giấy chứng nhận hoàn thành chương trình THPT): đăng ký chương trình liên thông lên đại học do Trường Đại học Công nghệ và Quản lý Hữu Nghị tổ chức tuyển sinh và cấp bằng. Hệ này có phòng đào tạo riêng, xem mục cuối trang.",
      "**Hình thức tuyển sinh hệ liên thông** theo thông báo của nhà trường: xét tuyển bằng bảng điểm trung cấp và bằng tốt nghiệp THPT; một số trường hợp phải thi môn cơ sở ngành.",
      "**Điều kiện đầu vào** của từng ngành, nghề được nhà trường tư vấn khi bạn đăng ký. Nhiều khóa nhà trường công bố **không giới hạn độ tuổi**.",
    ],
  },
  {
    heading: "Thời gian học",
    list: [
      "**Trung cấp:** thời gian học tính theo năm học, khác nhau theo từng ngành, nghề và do chương trình đào tạo của trường quy định.",
      "Người tốt nghiệp THCS học trung cấp còn học thêm khối lượng kiến thức văn hóa THPT theo quy định của Bộ Giáo dục và Đào tạo, nên tổng thời gian dài hơn.",
      "**Sơ cấp, ngắn hạn:** ngắn hơn trình độ trung cấp nhiều, tùy nghề; lịch học từng khóa được thông báo theo đợt khai giảng.",
    ],
    paragraphs: [
      `Thời lượng và lịch học cụ thể của từng ngành thay đổi theo đợt khai giảng — gọi hotline ${appConfig.phone} để hỏi lịch đợt gần nhất.`,
    ],
  },
  {
    heading: "Quy trình đăng ký học",
    list: [
      "**Bước 1. Chọn ngành:** xem hệ đào tạo và danh sách ngành ở mục trên.",
      `**Bước 2. Đăng ký tư vấn:** điền [form đăng ký tư vấn](/#register), gọi hotline ${appConfig.phone} hoặc [nhắn Zalo](${appConfig.zalo}).`,
      "**Bước 3. Nhận tư vấn:** nhà trường liên hệ lại, tư vấn điều kiện đầu vào, thời gian học, học phí và lịch khai giảng.",
      "**Bước 4. Nộp hồ sơ, nhập học:** nộp hồ sơ theo hướng dẫn và vào học theo đợt khai giảng đã chọn.",
    ],
  },
  {
    heading: "Hồ sơ nhập học",
    list: [
      "Giấy tờ chứng minh đã tốt nghiệp THCS hoặc THPT (hoặc bằng trung cấp nếu đăng ký liên thông).",
      "Căn cước công dân (CCCD). Số CCCD đăng ký khi nhập học cũng dùng để [tra cứu văn bằng](/tra-cuu-van-bang) sau khi tốt nghiệp.",
    ],
    paragraphs: [
      "Danh mục hồ sơ đầy đủ (số lượng bản sao, ảnh, giấy tờ ưu tiên nếu có) được nhà trường gửi khi tư vấn. Cách chuẩn bị từng loại giấy tờ và các trường hợp thường gặp xem bài [hồ sơ nhập học trung cấp](/cam-nang/ho-so-nhap-hoc-trung-cap).",
    ],
  },
  {
    heading: "Học phí",
    paragraphs: [
      `Học phí khác nhau theo từng ngành và từng hệ đào tạo. Nhà trường công bố học phí theo từng thông báo khai giảng, chưa đăng bảng học phí chung cho tất cả các ngành; mức đã công bố nêu ở trang [học phí](/hoc-phi). Học phí ngành bạn quan tâm được gửi khi liên hệ tư vấn: gọi ${appConfig.phone} hoặc [để lại thông tin](/#register).`,
    ],
  },
  {
    // Địa chỉ, điện thoại, email lấy đúng từ 2 thông báo trên trungcapnhanlucquocte.vn:
    // "THÔNG BÁO TUYỂN SINH NGÀNH QUẢN TRỊ DỊCH VỤ ĂN UỐNG VÀ ẨM THỰC" và "THÔNG BÁO V/v Ký sổ gốc
    // và nhận bằng tốt nghiệp". Đây là đầu mối riêng của hệ liên thông, khác hotline tuyển sinh.
    heading: "Phòng Đào tạo hệ liên thông đại học, cao đẳng",
    list: [
      "**Địa chỉ:** Tầng 2, số 02 Hồng Hà, phường 2, quận Tân Bình, TP. Hồ Chí Minh.",
      "**Điện thoại:** 096 28 79 680.",
      "**Email:** lienthongdaihoc.edu@trungcapnhanlucquocte.vn.",
      "**Hồ sơ đăng ký liên thông:** căn cước công dân, ảnh 3x4 và bằng cấp hiện có.",
    ],
    paragraphs: [
      "Nhà trường thông báo hình thức học hệ liên thông linh hoạt: học cuối tuần hoặc buổi tối trong tuần, học trực tiếp kết hợp thực hành; đối tượng là người tốt nghiệp THPT trở lên, không giới hạn độ tuổi. Việc ký sổ gốc và nhận bằng tốt nghiệp hệ liên thông được tổ chức tại phòng này theo thông báo của trường.",
    ],
  },
  {
    heading: "Văn bằng sau khi tốt nghiệp",
    paragraphs: [
      "Hoàn thành chương trình trung cấp, học viên được cấp bằng tốt nghiệp trung cấp theo Luật Giáo dục nghề nghiệp số 124/2025/QH15 (hiệu lực từ 01/01/2026) và có thể học liên thông lên trình độ cao hơn theo Thông tư 52/2026/TT-BGDĐT. Khóa sơ cấp, ngắn hạn được cấp chứng chỉ. Văn bằng, chứng chỉ do trường cấp tra cứu được tại trang [tra cứu văn bằng](/tra-cuu-van-bang).",
    ],
  },
];
