import appConfig from "../configs/appConfig";
import FaqAccordion from "./FaqAccordion";

// Hướng dẫn dưới form tra cứu văn bằng (/tra-cuu-van-bang). Chỉ mô tả đúng những gì form làm
// (tra theo CCCD, các trường hiển thị) + đầu mối liên hệ — không nêu quy trình chưa được trường xác nhận.
const LOOKUP_STEPS = [
  "Nhập số CCCD bạn đã đăng ký khi nhập học vào ô tra cứu phía trên.",
  "Bấm “Xem văn bằng” và chờ hệ thống tìm dữ liệu.",
  "Kiểm tra thông tin hiển thị; nếu có nhiều văn bằng, chứng chỉ, tất cả sẽ được liệt kê bên dưới.",
];

const SHOWN_FIELDS = [
  "Họ tên, số CCCD và ngày sinh của học viên",
  "Số hiệu văn bằng",
  "Ngành tốt nghiệp",
  "Xếp loại và năm tốt nghiệp",
];

const DEGREE_FAQS = [
  {
    question: "Tra cứu văn bằng Trường Trung cấp nghề Nhân Lực Quốc Tế cần thông tin gì?",
    answer:
      "Chỉ cần số CCCD đã đăng ký khi nhập học. Hệ thống hiển thị văn bằng, chứng chỉ do Trường Trung cấp nghề Nhân Lực Quốc Tế cấp gắn với số CCCD đó.",
  },
  {
    question: "Nhập đúng số CCCD nhưng không thấy văn bằng thì làm sao?",
    answer: `Dữ liệu một số khóa có thể chưa được cập nhật lên hệ thống. Vui lòng liên hệ phòng đào tạo qua hotline ${appConfig.phone} hoặc email ${appConfig.email} để được kiểm tra.`,
  },
  {
    question: "Doanh nghiệp muốn xác minh văn bằng của ứng viên thì làm thế nào?",
    answer: `Doanh nghiệp có thể tra cứu bằng số CCCD của ứng viên (khi ứng viên đồng ý) hoặc gửi yêu cầu xác minh văn bằng tới phòng đào tạo qua email ${appConfig.email}, kèm họ tên và số hiệu văn bằng.`,
  },
];

function DegreesGuide() {
  return (
    <div className="mt-8 space-y-8 text-[14px] text-slate-700">
      <section aria-labelledby="degrees-how-to" className="reveal">
        <h2 id="degrees-how-to" className="text-[18px] font-bold text-primary-dark mb-3">
          Cách tra cứu văn bằng
        </h2>
        <ol className="grid gap-3 md:grid-cols-3">
          {LOOKUP_STEPS.map((step, index) => (
            <li key={step} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
              <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary-dark text-[13px] font-bold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <div className="reveal grid gap-6 md:grid-cols-2">
        <section aria-labelledby="degrees-fields" className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 id="degrees-fields" className="text-[16px] font-bold text-primary-dark mb-2">
            Thông tin hiển thị khi tra cứu
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {SHOWN_FIELDS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="degrees-not-found" className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 id="degrees-not-found" className="text-[16px] font-bold text-primary-dark mb-2">
            Không tìm thấy kết quả?
          </h2>
          <p>
            Kiểm tra lại số CCCD (đủ 12 chữ số, không có khoảng trắng). Nếu vẫn không có kết quả, liên hệ
            phòng đào tạo qua hotline{" "}
            <a href={`tel:${appConfig.phoneE164}`} className="font-semibold text-primary-dark underline">
              {appConfig.phone}
            </a>{" "}
            hoặc email{" "}
            <a href={`mailto:${appConfig.email}`} className="font-semibold text-primary-dark underline break-all">
              {appConfig.email}
            </a>{" "}
            ({appConfig.openingHoursLabel}).
          </p>
        </section>
      </div>

      <section aria-labelledby="degrees-faq" className="reveal">
        <h2 id="degrees-faq" className="text-[18px] font-bold text-primary-dark mb-3">
          Câu hỏi thường gặp về tra cứu văn bằng
        </h2>
        <FaqAccordion faqs={DEGREE_FAQS} />
      </section>
    </div>
  );
}

export default DegreesGuide;
