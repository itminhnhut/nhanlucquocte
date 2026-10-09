import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import https from "../utils/https";
import { trackEvent } from "../utils/analytics";
import { useRef } from "react";
import { PRIVACY_POLICY_PATH, consentNote } from "../content/privacy";
import appConfig from "../configs/appConfig";

const REGISTER_POINTS = [
  "Nhận người tốt nghiệp THCS, THPT — khai giảng nhiều đợt trong năm",
  "Hệ trung cấp và các khóa sơ cấp, ngắn hạn cấp chứng chỉ",
  "Nhận cả học viên tốt nghiệp THCS, học thêm văn hóa THPT",
  "Tư vấn miễn phí về ngành học, lịch khai giảng và học phí",
];

function RegisterSection() {
  // Người dùng chạm vào form lần đầu → bước giữa của phễu (biết ai bỏ dở form)
  const startedRef = useRef(false);
  const onFormStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("form_start", { form_name: "dang_ky_tu_van" });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = async (values) => {
    try {
      // Map data đúng với API /client/consultations
      const payload = {
        fullName: values.fullName,
        phone: values.phone,
      };
      if (values.email) payload.email = values.email;
      // Bằng chứng đồng ý (Luật BVDLCN): API chưa có trường riêng → ghi kèm vào ghi chú
      payload.note = [values.message, consentNote()].filter(Boolean).join("\n");

      await https.post("client/consultations", payload);
      trackEvent("generate_lead", { form_name: "dang_ky_tu_van" });

      toast.success(
        "Gửi đăng ký thành công! Bộ phận tuyển sinh sẽ liên hệ sớm."
      );
      reset();
    } catch (error) {
      console.error("Register submit error:", error);
      trackEvent("form_error", { form_name: "dang_ky_tu_van" });
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <section id="register" className="register-gradient py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-[22px] sm:text-[24px] font-extrabold uppercase text-primary-dark mb-1">
          Đăng ký tuyển sinh
        </h2>
        <p className="text-center text-[13px] text-slate-500 mb-6 max-w-2xl mx-auto">
          Điền thông tin bên dưới, bộ phận tuyển sinh sẽ liên hệ tư vấn chi tiết
          cho bạn trong thời gian sớm nhất.
        </p>

        {/* Nền là ảnh học viên thực hành (không có chữ) — banner tuyển sinh đã có chữ sẵn nên không dùng lại ở đây */}
        <div
          className="
    relative rounded-[28px] overflow-hidden bg-primary-dark bg-cover bg-center bg-no-repeat px-5 py-8 sm:px-8 sm:py-10
    bg-[url('/images/sections/register/bg_800.webp')]
    md:bg-[url('/images/sections/register/bg_1600.webp')]
  "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/70 via-primary-dark/30 to-transparent" />

          <div className="relative grid items-center gap-7 lg:grid-cols-[1fr_minmax(0,27rem)]">
            <div className="text-white">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
                Khai giảng nhiều đợt
              </p>
              <h3 className="mt-3 text-[22px] sm:text-[26px] font-extrabold leading-snug">
                Để lại số điện thoại, nhà trường gọi tư vấn miễn phí
              </h3>
              <ul className="mt-4 space-y-2 text-[14px] text-red-50">
                {REGISTER_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-[2px] text-yellow-300">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  href={`tel:${appConfig.phoneE164}`}
                  className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-primary-dark hover:bg-red-50"
                >
                  Gọi {appConfig.phone}
                </a>
                <a
                  href={appConfig.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-white/70 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-white/10"
                >
                  Nhắn Zalo
                </a>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-soft p-5 sm:p-6 text-[13px] w-full">
            {/* Badge nhỏ tạo điểm nhấn */}
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/5 text-primary-dark text-[11px] font-semibold px-3 py-1 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Đăng ký tư vấn miễn phí
            </div>

            <h3 className="text-[16px] font-semibold text-primary-dark mb-1">
              Form đăng ký nhanh
            </h3>
            <p className="text-[12px] text-slate-500 mb-3">
              Để lại thông tin, đội ngũ tuyển sinh sẽ gọi lại cho bạn trong giờ
              hành chính.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} onFocusCapture={onFormStart} className="space-y-3">
              {/* Họ và tên */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-fullName" className="font-semibold text-[13px]">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input id="reg-fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className={`rounded-xl border px-3 py-2 text-[13px] outline-none transition focus:ring-1 focus:ring-primary/40 focus:border-primary ${
                    errors.fullName
                      ? "border-red-400 bg-red-50/40"
                      : "border-slate-200 bg-slate-50/60 hover:bg-white"
                  }`}
                  {...register("fullName", {
                    required: "Vui lòng nhập họ và tên",
                  })}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-phone" className="font-semibold text-[13px]">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input id="reg-phone"
                  type="tel"
                  placeholder="09xx xxx xxx"
                  className={`rounded-xl border px-3 py-2 text-[13px] outline-none transition focus:ring-1 focus:ring-primary/40 focus:border-primary ${
                    errors.phone
                      ? "border-red-400 bg-red-50/40"
                      : "border-slate-200 bg-slate-50/60 hover:bg-white"
                  }`}
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /^(0|\+84)\d{8,10}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-email" className="font-semibold text-[13px]">Email</label>
                <input id="reg-email"
                  type="email"
                  placeholder="email@domain.com"
                  className={`rounded-xl border px-3 py-2 text-[13px] outline-none transition focus:ring-1 focus:ring-primary/40 focus:border-primary ${
                    errors.email
                      ? "border-red-400 bg-red-50/40"
                      : "border-slate-200 bg-slate-50/60 hover:bg-white"
                  }`}
                  {...register("email", {
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Tin nhắn */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-message" className="font-semibold text-[13px]">Tin nhắn</label>
                <textarea id="reg-message"
                  placeholder="Ví dụ: Mong muốn được tư vấn ngành học, thời gian học, ký túc xá..."
                  className={`rounded-xl border px-3 py-2 text-[13px] outline-none resize-y min-h-[80px] transition focus:border-primary focus:ring-1 focus:ring-primary/40 ${
                    errors.message
                      ? "border-red-400 bg-red-50/40"
                      : "border-slate-200 bg-slate-50/60 hover:bg-white"
                  }`}
                  {...register("message")}
                />
              </div>

              {/* Đồng ý xử lý dữ liệu: không tích sẵn, bắt buộc */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-consent" className="flex items-start gap-2 text-[12px] text-slate-600 leading-snug">
                  <input
                    id="reg-consent"
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    {...register("consent", {
                      required: "Vui lòng đồng ý để nhà trường liên hệ tư vấn",
                    })}
                  />
                  <span>
                    Tôi đồng ý để Trường Trung cấp nghề Nhân Lực Quốc Tế dùng họ tên, số điện thoại, email tôi cung cấp để
                    liên hệ tư vấn tuyển sinh, theo{" "}
                    <Link to={PRIVACY_POLICY_PATH} className="text-primary underline underline-offset-2">
                      Chính sách bảo vệ dữ liệu cá nhân
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-red-500 mt-0.5">{errors.consent.message}</p>
                )}
              </div>

              {/* Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary text-white text-[13px] font-semibold px-6 py-2.5 min-w-[150px] justify-center shadow-[0_10px_24px_rgba(219,16,16,0.35)] hover:bg-primary-dark transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "13px",
            borderRadius: "999px",
            padding: "8px 14px",
          },
          success: {
            style: {
              background: "#16a34a",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "#fff",
            },
          },
        }}
      />
    </section>
  );
}

export default RegisterSection;
