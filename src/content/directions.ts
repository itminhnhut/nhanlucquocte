// Hướng dẫn đường đến trường (/lien-he). Mục tiêu: người ở các quận lân cận biết đi thế nào,
// đi mất bao lâu, gửi xe ở đâu — tăng độ tin cậy và phục vụ tìm kiếm theo khu vực
// ("trường trung cấp nghề gần sân bay", "trường nghề Tân Bình", "học nghề ở Gò Vấp").
//
// CHỈ nêu điều kiểm chứng được trên bản đồ: trục đường chính quanh vòng xoay Lăng Cha Cả và
// khu vực sân bay Tân Sơn Nhất. KHÔNG ghi số phút cụ thể, số nhà đối diện, bãi xe của bên thứ ba.
// TODO nhà trường xác nhận: chỗ để xe cho học viên, lối vào, có cần đăng ký trước khi đến không.
import appConfig from "../configs/appConfig";

export interface RouteGuide {
  /** Khu vực người học xuất phát */
  from: string;
  /**
   * Chuỗi mốc đi qua, theo đúng thứ tự.
   *
   * Trước đây mỗi tuyến là một câu dài liền mạch ("Đi Nam Kỳ Khởi Nghĩa hoặc Cách Mạng Tháng
   * Tám hướng sân bay, qua Nguyễn Văn Trỗi – Hoàng Văn Thụ tới vòng xoay Lăng Cha Cả rồi rẽ
   * vào Phan Đình Giót") — đúng nhưng phải đọc hết mới biết đi đâu. Tách thành chuỗi mốc thì
   * người đọc bắt được tuyến của mình trong một lượt nhìn, và trên điện thoại chữ không dồn
   * thành khối.
   */
  steps: readonly string[];
}

/** Mốc dễ nhận ra quanh trường */
export const LANDMARKS: readonly string[] = [
  "Vòng xoay Lăng Cha Cả — nút giao Hoàng Văn Thụ, Cộng Hòa, Trần Quốc Hoàn, Bùi Thị Xuân",
  "Ga quốc nội sân bay Tân Sơn Nhất, đi theo đường Trường Sơn",
  "Trục Cộng Hòa – Hoàng Văn Thụ, hướng từ Tân Bình về trung tâm thành phố",
];

export const ROUTES: readonly RouteGuide[] = [
  {
    from: "Quận 1, Quận 3 (trung tâm)",
    steps: ["Nam Kỳ Khởi Nghĩa hoặc Cách Mạng Tháng Tám", "Nguyễn Văn Trỗi", "Hoàng Văn Thụ", "Vòng xoay Lăng Cha Cả", "Phan Đình Giót"],
  },
  {
    from: "Phú Nhuận, Bình Thạnh",
    steps: ["Phan Đình Phùng hoặc Phan Đăng Lưu", "Hoàng Văn Thụ", "Vòng xoay Lăng Cha Cả", "Phan Đình Giót"],
  },
  {
    from: "Gò Vấp, Quận 12",
    steps: ["Nguyễn Kiệm hoặc Quang Trung – Nguyễn Oanh", "Hoàng Văn Thụ", "Vòng xoay Lăng Cha Cả", "Phan Đình Giót"],
  },
  {
    from: "Tân Phú, Bình Tân",
    steps: ["Trường Chinh hoặc Âu Cơ", "Cộng Hòa", "Vòng xoay Lăng Cha Cả", "Phan Đình Giót"],
  },
  {
    from: "Quận 7, Nhà Bè",
    steps: ["Nguyễn Văn Linh – Nguyễn Hữu Thọ", "Nguyễn Văn Trỗi", "Hoàng Văn Thụ", "Vòng xoay Lăng Cha Cả", "Phan Đình Giót"],
  },
  {
    from: "Thủ Đức, Bình Dương, Đồng Nai",
    steps: ["Phạm Văn Đồng", "Hoàng Văn Thụ (qua ngã tư Nguyễn Kiệm)", "Vòng xoay Lăng Cha Cả", "Phan Đình Giót"],
  },
  {
    from: "Long An, miền Tây",
    steps: ["Quốc lộ 1 – Trường Chinh", "Cộng Hòa", "Vòng xoay Lăng Cha Cả", "Phan Đình Giót"],
  },
];

export interface TravelNote {
  /** Nhãn ngắn đứng đầu dòng, để mắt bắt ngay chủ đề thay vì đọc cả câu */
  label: string;
  text: string;
}

export const TRANSPORT_NOTES: readonly TravelNote[] = [
  {
    label: "Xe buýt",
    text: "Các tuyến chạy qua Hoàng Văn Thụ – Cộng Hòa – Trường Sơn đều có trạm gần vòng xoay Lăng Cha Cả, xuống trạm rồi đi bộ vào Phan Đình Giót.",
  },
  {
    label: "Đi máy bay tới",
    text: "Từ ga quốc nội Tân Sơn Nhất ra đường Trường Sơn là tới khu vực trường, rất gần nếu bạn ở tỉnh lên nhập học.",
  },
  {
    label: "Giờ cao điểm",
    text: "Khu vực Lăng Cha Cả – Cộng Hòa thường đông vào 7:00–8:30 và 16:30–18:30, nên trừ hao thời gian khi có lịch hẹn.",
  },
  {
    label: "Ở gần trường",
    text: "Người học tại Tân Bình, Tân Phú, Phú Nhuận, Gò Vấp đọc thêm bài [trường trung cấp nghề ở Tân Bình](/cam-nang/truong-trung-cap-nghe-tan-binh) để biết các nghề đang đào tạo và đường đi theo từng khu vực.",
  },
  {
    label: "Trước khi đến",
    text: `Gọi ${appConfig.phone} hoặc nhắn Zalo để được hướng dẫn lối vào và chỗ để xe, nhất là khi đi theo đoàn hoặc mang hồ sơ nhập học.`,
  },
];

export const VISIT_NOTES: readonly string[] = [
  "Mang theo giấy tờ tùy thân và bằng/giấy chứng nhận tốt nghiệp khi đến nộp hồ sơ.",
  "Phụ huynh, học sinh đi theo đoàn hoặc trường THPT muốn tham quan nên đặt lịch trước để nhà trường bố trí người hướng dẫn.",
];
