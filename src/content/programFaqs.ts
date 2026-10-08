// Câu hỏi theo ngành — lấy từ gợi ý tìm kiếm thật ("… ra làm gì", "… học những gì", "… học ở đâu").
// Câu trả lời CHỈ mô tả công việc của nghề và thông tin trường đã công bố (ngành đào tạo, trình độ,
// địa chỉ). KHÔNG ghi chương trình học chi tiết, thời lượng, học phí hay tỉ lệ việc làm — những
// nội dung đó chờ bài ngành được import vào database rồi lấy theo bài gốc của trường.
// - Trang ngành: hiển thị + schema FAQPage (nếu nội dung CMS chưa có mục FAQ riêng).
// - Trang /cau-hoi-thuong-gap: hiển thị theo nhóm, KHÔNG đánh schema lại (Google: mỗi Q&A
//   lặp lại trên site chỉ đánh dấu 1 nơi).
// Link viết dạng [chữ](/duong-dan) như src/content/faqs.ts.
import appConfig from "../configs/appConfig";
import type { SiteFaq } from "./faqs";

export interface ProgramFaqGroup {
  /** Slug ngành trong danh mục (src/content/programFields.ts) */
  slugs: readonly string[];
  name: string;
  faqs: readonly SiteFaq[];
}

const STUDY_PLACE = `Tại Trường Trung cấp nghề Nhân Lực Quốc Tế, ${appConfig.address}.`;
const ADVICE = "[Đăng ký tư vấn](/#register) để nhận chương trình học, lịch khai giảng và học phí của ngành.";

export const PROGRAM_FAQ_GROUPS: readonly ProgramFaqGroup[] = [
  {
    slugs: ["chuyen-nganh-dieu-duong-he-trung-cap"],
    name: "Điều dưỡng",
    faqs: [
      {
        question: "Học trung cấp điều dưỡng ra làm gì?",
        answer:
          "Điều dưỡng viên chăm sóc người bệnh, theo dõi dấu hiệu sinh tồn, thực hiện y lệnh và hướng dẫn người bệnh tại bệnh viện, phòng khám, trung tâm y tế, cơ sở chăm sóc người cao tuổi.",
      },
      {
        question: "Học trung cấp điều dưỡng ở đâu tại TPHCM?",
        answer: `${STUDY_PLACE} Ngành Điều dưỡng đào tạo trình độ trung cấp, tốt nghiệp được cấp bằng trung cấp. ${ADVICE}`,
      },
    ],
  },
  {
    slugs: ["tuyen-sinh-nganh-duoc-si-he-trung-cap-khai-giang-ngay-16-03-2026"],
    name: "Dược sĩ",
    faqs: [
      {
        question: "Học trung cấp dược ra làm gì?",
        answer:
          "Dược sĩ trung cấp làm việc tại nhà thuốc, quầy thuốc, khoa dược bệnh viện, công ty dược và thiết bị y tế: bán và tư vấn sử dụng thuốc, bảo quản, kiểm kê và cấp phát thuốc theo quy định.",
      },
      {
        question: "Học trung cấp dược ở đâu tại TPHCM?",
        answer: `${STUDY_PLACE} ${ADVICE}`,
      },
    ],
  },
  {
    slugs: ["cham-soc-sac-dep-he-trung-cap", "tuyen-sinh-nganh-beauty-therapy-lieu-phap-lam-dep", "cham-soc-da-chuyen-nghiep", "cham-soc-nails-chuyen-nghiep-ngan-han"],
    name: "Chăm sóc sắc đẹp",
    faqs: [
      {
        question: "Học chăm sóc sắc đẹp ra làm gì?",
        answer:
          "Sau khóa học có thể làm kỹ thuật viên chăm sóc da, chăm sóc móng, nhân viên tư vấn và chăm sóc khách hàng tại spa, viện thẩm mỹ, công ty mỹ phẩm, hoặc tự mở tiệm.",
      },
      {
        question: "Trường có những khóa làm đẹp nào?",
        answer:
          "Trường đào tạo Chăm sóc sắc đẹp hệ trung cấp (cấp bằng trung cấp) và các khóa ngắn hạn cấp chứng chỉ: Beauty Therapy – liệu pháp làm đẹp, Chăm sóc da chuyên nghiệp, Chăm sóc nails chuyên nghiệp.",
      },
    ],
  },
  {
    slugs: ["ky-thuat-che-bien-mon-an", "khai-giang-ky-thuat-lam-banh-khoa-106-he-trung-cap", "nghiep-vu-pha-che"],
    name: "Bếp – Bánh – Pha chế",
    faqs: [
      {
        question: "Học nấu ăn, làm bánh ra làm gì?",
        answer:
          "Người học có thể làm phụ bếp, đầu bếp, thợ làm bánh tại nhà hàng, khách sạn, tiệm bánh, bếp ăn công nghiệp, hoặc kinh doanh đồ ăn, đồ uống của riêng mình.",
      },
      {
        question: "Trường đào tạo những nghề bếp nào?",
        answer:
          "Kỹ thuật chế biến món ăn và Kỹ thuật làm bánh đào tạo hệ trung cấp; Nghiệp vụ pha chế là khóa ngắn hạn cấp chứng chỉ.",
      },
    ],
  },
  {
    slugs: ["quan-tri-khach-san", "khai-giang-nghiep-vu-le-tan"],
    name: "Khách sạn – Lễ tân",
    faqs: [
      {
        question: "Học quản trị khách sạn, nghiệp vụ lễ tân ra làm gì?",
        answer:
          "Làm lễ tân, nhân viên buồng phòng, nhân viên nhà hàng, giám sát ca tại khách sạn, khu nghỉ dưỡng, căn hộ dịch vụ; có kinh nghiệm thì lên tổ trưởng, giám sát bộ phận.",
      },
      {
        question: "Chưa giỏi ngoại ngữ có học được không?",
        answer: `Được. Người học được rèn ngoại ngữ giao tiếp trong nghề trong quá trình học; trường cũng có khóa tiếng Hàn ngắn hạn. Gọi hotline ${appConfig.phone} để được tư vấn lộ trình phù hợp.`,
      },
    ],
  },
  {
    slugs: ["tuyen-sinh-cong-nghe-ky-thuat-o-to-khai-giang-ngay-03-03-2026", "trung-cap-ky-thuat-xay-dung", "thong-bao-tuyen-sinh-nganh-thiet-ke-noi-that-khoa-17", "tuyen-sinh-ky-thuat-moc-xay-dung-va-trang-tri-noi-that"],
    name: "Kỹ thuật – Xây dựng – Nội thất",
    faqs: [
      {
        question: "Học sửa chữa ô tô, kỹ thuật xây dựng ra làm gì?",
        answer:
          "Kỹ thuật viên sửa chữa, bảo dưỡng ô tô làm tại gara, hãng xe, trạm dịch vụ; người học kỹ thuật xây dựng làm giám sát, kỹ thuật viên thi công tại công trình, hoặc nhận thi công, trang trí nội thất.",
      },
      {
        question: "Tốt nghiệp THCS học được các ngành kỹ thuật không?",
        answer:
          "Được. Người tốt nghiệp THCS được học trình độ trung cấp và học thêm khối lượng kiến thức văn hóa THPT theo quy định của Bộ Giáo dục và Đào tạo. Trường xét tuyển, không thi tuyển.",
      },
    ],
  },
  {
    slugs: ["ke-toan-doanh-nghiep", "tuyen-sinh-trung-cap-nganh-quan-tri-kinh-doanh", "nganh-cong-nghe-thong-tin-he-trung-cap"],
    name: "Kế toán – Kinh doanh – CNTT",
    faqs: [
      {
        question: "Học trung cấp kế toán, quản trị kinh doanh ra làm gì?",
        answer:
          "Làm kế toán viên, kế toán kho, kế toán bán hàng, nhân viên kinh doanh, nhân viên hành chính tại doanh nghiệp, cửa hàng, hợp tác xã; học tiếp liên thông lên cao đẳng, đại học khi có nhu cầu.",
      },
      {
        question: "Học công nghệ thông tin hệ trung cấp làm được việc gì?",
        answer:
          "Làm kỹ thuật viên máy tính, hỗ trợ kỹ thuật, quản trị mạng nhỏ, cộng tác viên thiết kế và quản trị website tại doanh nghiệp, cửa hàng thiết bị, trung tâm dịch vụ tin học.",
      },
    ],
  },
  {
    slugs: ["nghiep-vu-bao-mau", "cham-soc-nguoi-cao-tuoi", "tuyen-sinh-khoa-32-nghiep-vu-tro-ly-nha-khoa-khai-giang-ngay-01-07-2026", "ngon-ngu-han-quoc", "nghiep-vu-nghe-nong-nghiep-he-so-cap"],
    name: "Khóa sơ cấp, ngắn hạn",
    faqs: [
      {
        question: "Trường có những khóa ngắn hạn nào?",
        answer:
          "Nghiệp vụ bảo mẫu, Chăm sóc người cao tuổi, Trợ lý nha khoa, Ngôn ngữ Hàn Quốc và Nghiệp vụ nghề nông nghiệp hệ sơ cấp. Học xong được cấp chứng chỉ.",
      },
      {
        question: "Khóa ngắn hạn học bao lâu?",
        answer: `Khóa sơ cấp, ngắn hạn có thời lượng ngắn hơn nhiều so với trình độ trung cấp, khác nhau theo từng nghề. Thời gian và lịch học của từng khóa được tư vấn khi đăng ký — gọi ${appConfig.phone}.`,
      },
    ],
  },
  {
    slugs: ["tuyen-sinh-he-dai-hoc-nam-2025", "tuyen-sinh-he-lien-thong-dai-hoc-nganh-quan-tri-dich-vu-an-uong-va-am-thuc"],
    name: "Liên thông đại học",
    faqs: [
      {
        question: "Có bằng trung cấp thì học liên thông đại học thế nào?",
        answer:
          "Người có bằng tốt nghiệp trung cấp được học liên thông lên trình độ cao hơn theo điều kiện của cơ sở đào tạo. Chương trình liên thông đại học do Trường Đại học Công nghệ và Quản lý Hữu Nghị tổ chức tuyển sinh và cấp bằng, trường là đơn vị liên kết; ngành đã thông báo gồm Quản trị dịch vụ ăn uống và ẩm thực, Quản trị dịch vụ du lịch và lữ hành. Điều kiện: đã tốt nghiệp trung cấp và có bằng THPT hoặc giấy chứng nhận hoàn thành chương trình THPT.",
      },
      {
        question: "Học liên thông ở đâu, đăng ký thế nào?",
        answer: `${STUDY_PLACE} ${ADVICE}`,
      },
    ],
  },
];

export function programFaqGroupBySlug(slug: string): ProgramFaqGroup | null {
  return PROGRAM_FAQ_GROUPS.find((group) => group.slugs.includes(slug)) ?? null;
}
