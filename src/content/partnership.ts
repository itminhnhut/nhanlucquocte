// Trang /hop-tac-doanh-nghiep — tăng độ tin cậy (E-E-A-T): nêu các hợp tác và cơ hội thực tập,
// tuyển dụng mà nhà trường ĐÃ CÔNG BỐ trên website (mục Tin tức và dải đối tác).
// CHỈ dùng sự kiện có bài trên trungcapnhanlucquocte.vn. KHÔNG ghi số lượng học viên được nhận,
// mức lương, tỉ lệ việc làm hay cam kết đầu ra.
// TODO nhà trường bổ sung: văn bản hợp tác, danh sách doanh nghiệp tiếp nhận thực tập theo ngành.
import appConfig from "../configs/appConfig";
import type { GuideSection } from "./guides";

export const PARTNERSHIP_PATH = "/hop-tac-doanh-nghiep";

export const PARTNERSHIP_LEAD = `Trường Trung cấp nghề Nhân Lực Quốc Tế đào tạo gắn với nhu cầu tuyển dụng thực tế: học viên được giới thiệu vị trí thực tập, tham gia chương trình tuyển dụng của doanh nghiệp trong nước và nước ngoài, học trên thiết bị do doanh nghiệp bàn giao. Trang này tổng hợp các hợp tác và cơ hội nhà trường đã công bố.`;

export const PARTNERSHIP_SECTIONS: readonly GuideSection[] = [
  {
    heading: "Khách sạn – nhà hàng: thực tập và tuyển dụng",
    list: [
      "**Sheraton Saigon Grand Opera Hotel** — nhà trường thông báo cơ hội thực tập cho học viên khối nhà hàng – khách sạn.",
      "**Park Hyatt Saigon** — nằm trong nhóm đối tác khách sạn của trường.",
      "**Four Seasons Megève (Pháp)** — thông báo tuyển dụng lao động mùa vụ dành cho người học có nghề và ngoại ngữ.",
      "Các vị trí phục vụ nhà hàng, F&B được đăng theo đợt ở mục [Tin tức](/tin-tuc).",
    ],
    paragraphs: [
      "Ngành phù hợp với nhóm cơ hội này: Quản trị khách sạn, Nghiệp vụ lễ tân, Kỹ thuật chế biến món ăn, Kỹ thuật làm bánh, Nghiệp vụ pha chế — xem [chương trình đào tạo](/nganh-dao-tao).",
    ],
  },
  {
    heading: "Thiết bị thực hành từ doanh nghiệp",
    paragraphs: [
      "Nhà trường đã tổ chức **lễ bàn giao xe điện VinFast VF8 phục vụ đào tạo ngành Kỹ thuật sửa chữa ô tô**. Học viên ngành ô tô được thực hành trên xe thật, trong đó có dòng xe điện đang phổ biến trên thị trường. Lễ bàn giao và các sự kiện khác của nhà trường xem ở trang [hoạt động học viên](/hoat-dong-hoc-vien).",
    ],
  },
  {
    heading: "Y tế và chăm sóc sức khỏe",
    paragraphs: [
      "**JW Korea Hospital** nằm trong nhóm đối tác của trường, liên quan tới khối ngành chăm sóc sức khỏe và chăm sóc sắc đẹp. Người học các ngành Điều dưỡng, Chăm sóc người cao tuổi, Trợ lý nha khoa, Chăm sóc sắc đẹp có thể hỏi bộ phận tuyển sinh về cơ hội thực tập theo từng đợt. Công việc hằng ngày của điều dưỡng viên mô tả ở bài [học điều dưỡng ra làm gì](/cam-nang/hoc-dieu-duong-ra-lam-gi), nội dung nghề làm đẹp ở bài [học chăm sóc sắc đẹp học gì](/cam-nang/hoc-cham-soc-sac-dep-hoc-gi).",
    ],
  },
  {
    heading: "Liên kết đào tạo với trường đại học",
    list: [
      "**Trường Đại học Công nghệ và Quản lý Hữu Nghị** (University of Technology & Management – mã trường DCQ) — tổ chức tuyển sinh và cấp bằng cho chương trình liên thông lên đại học; trường là đơn vị liên kết.",
      "**Sun Moon University (Hàn Quốc)** — đối tác phía Hàn Quốc, gắn với định hướng học tiếng Hàn và làm việc ở nước ngoài.",
    ],
    paragraphs: [
      "Người đã tốt nghiệp trung cấp **và** có bằng THPT (hoặc giấy chứng nhận hoàn thành chương trình THPT) có thể đăng ký liên thông ngành Quản trị dịch vụ ăn uống và ẩm thực, Quản trị dịch vụ du lịch và lữ hành. Đọc thêm [liên thông đại học sau trung cấp](/cam-nang/lien-thong-dai-hoc-sau-trung-cap).",
    ],
  },
  {
    heading: "Thị trường lao động ngoài nước",
    paragraphs: [
      `Trường được Bộ Lao động – Thương binh và Xã hội thành lập năm 2007 với mục tiêu nâng cao chất lượng nguồn nhân lực đi làm việc ở nước ngoài. Giai đoạn 2008–2012, trường đã đào tạo hơn 20.000 lao động cho hàng chục công ty, cung ứng cho thị trường trong nước và các thị trường Nhật Bản, Hàn Quốc, Đài Loan. Xem thêm trang [Du học](/du-hoc) và bài [học nghề đi làm việc ở nước ngoài](/cam-nang/hoc-nghe-di-lam-viec-nuoc-ngoai); quyết định thành lập và lịch sử nhà trường ở trang [giới thiệu nhà trường](/gioi-thieu). Doanh nghiệp cần đặt hàng đào tạo hoặc tuyển dụng học viên, liên hệ ${appConfig.phone}.`,
    ],
  },
];
