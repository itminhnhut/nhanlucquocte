// Nội dung trang /cau-hoi-thuong-gap. CHỈ ghi thông tin có căn cứ: nội dung trên website của trường,
// thông tin nhà trường đã xác nhận, hoặc quy định chung của Luật Giáo dục nghề nghiệp số 124/2025/QH15 (hiệu lực 01/01/2026, thay thế Luật 2014).
// Không tự thêm học phí, số liệu, tỉ lệ việc làm. Link viết dạng [chữ](/duong-dan).
// TODO nhà trường bổ sung: mức học phí từng ngành, chính sách miễn giảm, lịch khai giảng từng đợt.
import appConfig from "../configs/appConfig";

export interface SiteFaq {
  question: string;
  answer: string;
}

/** Câu hỏi có khoá ổn định, để trang khác chọn được mà không phụ thuộc vào câu chữ */
export interface KeyedFaq extends SiteFaq {
  id: string;
}

export const SITE_FAQS: readonly KeyedFaq[] = [
  {
    id: "dia-chi",
    question: "Trường Trung cấp nghề Nhân Lực Quốc Tế ở đâu?",
    answer: `Trường ở ${appConfig.address}, gần sân bay Tân Sơn Nhất. Hotline và Zalo tư vấn tuyển sinh: ${appConfig.phone}, email: ${appConfig.email}. Xem bản đồ đường đi tại trang [Liên hệ](/lien-he).`,
  },
  {
    id: "thanh-lap",
    question: "Trường được thành lập khi nào, có được cấp phép không?",
    answer:
      "Trường được Bộ Lao động – Thương binh và Xã hội thành lập ngày 13/12/2007 theo Quyết định số 1777/LĐTBXH-QĐ, đào tạo trình độ trung cấp và sơ cấp. Xem thêm trang [Giới thiệu](/gioi-thieu).",
  },
  {
    id: "linh-vuc",
    question: "Trường đào tạo những lĩnh vực nào?",
    answer:
      "Trường đào tạo các lĩnh vực: y tế và chăm sóc sức khỏe (điều dưỡng, dược, chăm sóc người cao tuổi), chăm sóc sắc đẹp, ẩm thực – nhà hàng – khách sạn, kỹ thuật – xây dựng, kinh tế – công nghệ thông tin, cùng các khóa ngắn hạn và ngoại ngữ. Hai nghề có bài riêng mô tả công việc sau khi học: [học điều dưỡng ra làm gì](/cam-nang/hoc-dieu-duong-ra-lam-gi) và [học chăm sóc sắc đẹp học gì](/cam-nang/hoc-cham-soc-sac-dep-hoc-gi). Liên hệ hotline để biết ngành đang tuyển sinh đợt gần nhất.",
  },
  {
    id: "thoi-gian-hoc",
    question: "Học trung cấp nghề mất bao lâu?",
    answer:
      "Thời gian học khác nhau theo từng ngành, nghề và do chương trình đào tạo của trường quy định; học trung cấp thường tính bằng năm học, còn khóa sơ cấp ngắn hơn nhiều. Người tốt nghiệp THCS học trung cấp còn học thêm khối lượng kiến thức văn hóa THPT theo quy định của Bộ Giáo dục và Đào tạo. Giáo dục nghề nghiệp hiện thực hiện theo Luật Giáo dục nghề nghiệp số 124/2025/QH15 (hiệu lực từ 01/01/2026). Để biết chính xác thời gian của ngành bạn chọn, hãy hỏi khi đăng ký tư vấn.",
  },
  {
    id: "tot-nghiep-thcs",
    question: "Tốt nghiệp THCS có học trung cấp được không?",
    answer:
      "Được. Người tốt nghiệp THCS được học trình độ trung cấp và học thêm khối lượng kiến thức văn hóa THPT theo quy định của Bộ Giáo dục và Đào tạo. Trường xét tuyển, không thi tuyển. So sánh các hướng đi sau lớp 9 có ở bài [tốt nghiệp lớp 9 nên học gì](/cam-nang/tot-nghiep-lop-9-nen-hoc-gi).",
  },
  {
    id: "van-bang",
    question: "Học xong được cấp bằng gì?",
    answer:
      "Học viên hoàn thành chương trình trung cấp được cấp bằng tốt nghiệp trung cấp theo Luật Giáo dục nghề nghiệp số 124/2025/QH15 (hiệu lực từ 01/01/2026); các khóa sơ cấp, ngắn hạn được cấp chứng chỉ. Văn bằng, chứng chỉ do trường cấp có thể [tra cứu trực tuyến](/tra-cuu-van-bang).",
  },
  {
    id: "lien-thong",
    question: "Bằng trung cấp nghề có liên thông lên đại học được không?",
    answer:
      "Được. Người có bằng tốt nghiệp trung cấp được học liên thông lên cao đẳng, đại học theo điều kiện của cơ sở đào tạo. Việc liên thông giữa trung học nghề, trung cấp, cao đẳng và đại học hiện thực hiện theo Thông tư 52/2026/TT-BGDĐT của Bộ Giáo dục và Đào tạo, có hiệu lực từ ngày 15/08/2026; người học được công nhận kết quả đã tích lũy và phải hoàn thành tối thiểu 50% chương trình tại cơ sở cấp bằng. Điều kiện và lộ trình cụ thể xem bài [liên thông đại học sau trung cấp](/cam-nang/lien-thong-dai-hoc-sau-trung-cap). Hãy liên hệ nhà trường để được tư vấn theo đúng trường hợp của bạn.",
  },
  {
    id: "hoc-phi",
    question: "Học phí bao nhiêu và có chính sách miễn giảm không?",
    answer: `Học phí khác nhau theo từng ngành và từng hệ đào tạo. Nhà nước có chính sách miễn, giảm học phí cho một số đối tượng học trung cấp, trong đó có người tốt nghiệp THCS học tiếp trình độ trung cấp. Các khoản phải đóng trong một khóa học và diện được miễn, giảm theo quy định của Nhà nước nêu ở trang [học phí trung cấp nghề](/hoc-phi). Gọi hotline ${appConfig.phone} hoặc [đăng ký tư vấn](/#register) để nhận thông tin học phí và chính sách áp dụng cho trường hợp của bạn.`,
  },
  {
    id: "khai-giang",
    question: "Khi nào khai giảng và hồ sơ nhập học gồm những gì?",
    answer:
      "Trường khai giảng nhiều đợt trong năm và nhận hồ sơ quanh năm. Thông tin về đợt khai giảng gần nhất, hồ sơ và cách đăng ký xem tại trang [Tuyển sinh](/tuyen-sinh).",
  },
  {
    id: "ho-so",
    question: "Hồ sơ nhập học gồm những giấy tờ gì?",
    answer:
      "Cơ bản gồm giấy tờ chứng minh đã tốt nghiệp THCS hoặc THPT (hoặc bằng trung cấp nếu học liên thông) và căn cước công dân. Danh mục đầy đủ gồm số bản sao, ảnh và giấy tờ ưu tiên được nhà trường gửi khi tư vấn — xem trang [Tuyển sinh](/tuyen-sinh). Cách chuẩn bị từng loại giấy tờ và các trường hợp thường gặp có ở bài [hồ sơ nhập học trung cấp gồm những gì](/cam-nang/ho-so-nhap-hoc-trung-cap).",
  },
  {
    id: "gia-tri-bang",
    question: "Bằng trung cấp của trường có giá trị trên toàn quốc không?",
    answer:
      "Bằng tốt nghiệp trung cấp do cơ sở giáo dục nghề nghiệp cấp theo Luật Giáo dục nghề nghiệp số 124/2025/QH15 (hiệu lực từ 01/01/2026), nằm trong hệ thống văn bằng của giáo dục quốc dân, dùng để đi làm và để học liên thông lên trình độ cao hơn. Văn bằng do trường cấp [tra cứu trực tuyến](/tra-cuu-van-bang) được.",
  },
  {
    id: "vua-hoc-vua-lam",
    question: "Đang đi làm có học được không, trường có lớp ngoài giờ không?",
    answer: `Người đang đi làm thường chọn khóa sơ cấp, ngắn hạn để lấy chứng chỉ nhanh, hoặc học trung cấp theo lịch được sắp xếp. Lịch học từng ngành thay đổi theo đợt khai giảng, gọi ${appConfig.phone} để hỏi lịch đợt gần nhất.`,
  },
  {
    id: "ky-tuc-xa",
    question: "Trường có ký túc xá không?",
    answer: `Thông tin về chỗ ở cho học viên ở tỉnh được bộ phận tuyển sinh tư vấn trực tiếp theo từng đợt. Gọi hotline ${appConfig.phone} hoặc nhắn Zalo để hỏi trước khi nhập học.`,
  },
  {
    id: "duong-di",
    question: "Trường ở đâu, đi lại thế nào?",
    answer: `Trường ở ${appConfig.address}, khu vực vòng xoay Lăng Cha Cả, trên trục đường vào ga quốc nội sân bay Tân Sơn Nhất. Hướng dẫn đường đi từ Quận 1, Phú Nhuận, Gò Vấp, Quận 12, Tân Phú, Thủ Đức có ở trang [Liên hệ](/lien-he). Người học quanh khu vực này đọc thêm bài [trường trung cấp nghề ở Tân Bình](/cam-nang/truong-trung-cap-nghe-tan-binh).`,
  },
  {
    id: "viec-lam",
    question: "Học xong trường có giới thiệu việc làm không?",
    answer:
      "Trường gắn đào tạo với nhu cầu tuyển dụng thực tế và có hợp tác với doanh nghiệp, khách sạn, cơ sở y tế; thông báo thực tập và tuyển dụng được đăng ở mục [Tin tức](/tin-tuc), các hợp tác đã công bố xem ở trang [hợp tác doanh nghiệp](/hop-tac-doanh-nghiep). Cơ hội cụ thể tùy từng ngành và từng đợt, hãy hỏi khi đăng ký tư vấn.",
  },
  {
    id: "dang-ky",
    question: "Đăng ký tư vấn tuyển sinh bằng cách nào?",
    answer: `Bạn có thể điền [form đăng ký tư vấn](/#register) trên trang chủ, gọi hotline ${appConfig.phone}, nhắn Zalo cùng số này hoặc gửi email ${appConfig.email}. Tư vấn miễn phí.`,
  },
];

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export interface AnswerPart {
  text: string;
  href?: string;
}

/** Tách câu trả lời thành đoạn chữ và link để render */
export function parseAnswer(answer: string): AnswerPart[] {
  const parts: AnswerPart[] = [];
  let lastIndex = 0;
  for (const match of answer.matchAll(LINK_PATTERN)) {
    const [full, text, href] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push({ text: answer.slice(lastIndex, index) });
    parts.push({ text, href });
    lastIndex = index + full.length;
  }
  if (lastIndex < answer.length) parts.push({ text: answer.slice(lastIndex) });
  return parts;
}

/** Câu trả lời dạng chữ thuần (cho schema FAQPage) */
export function answerText(answer: string): string {
  return answer.replace(LINK_PATTERN, "$1");
}
