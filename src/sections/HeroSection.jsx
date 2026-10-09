import appConfig from "@/configs/appConfig";
import { HIGHLIGHTS } from "@/content/schoolProfile";
import { HERO_IMAGE, HERO_IMAGE_MOBILE } from "@/configs/heroImage";

// Banner: ảnh nền KHÔNG có chữ, toàn bộ chữ là HTML đè lên.
// Lý do: chữ nằm trong ảnh thì mờ và nhỏ trên điện thoại, đồng thời LCP là ảnh nặng;
// để chữ dạng HTML thì LCP là text (hiện gần như tức thì) và đọc được ở mọi kích thước màn hình.
// Chỉ nêu điều trường đã công bố: đối tượng tuyển sinh và việc khai giảng nhiều đợt.
// KHÔNG viết "không thi tuyển" hay "nhận hồ sơ quanh năm" — site của trường không nói vậy, và
// trang liên thông của trường còn ghi rõ "Hoặc thi tuyển: Một số trường yêu cầu thi môn cơ sở ngành".
const BENEFITS = ["Nhận từ tốt nghiệp THCS", "Khai giảng nhiều đợt trong năm", "Học đi đôi với thực hành"];

function HeroSection() {
  return (
    <main className="max-w-7xl mx-auto">
      <section id="hero" className="pb-12">
        <div className="relative w-full overflow-hidden rounded-b-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
          <picture>
            <source media="(max-width: 639px)" srcSet={HERO_IMAGE_MOBILE.srcSet} sizes={HERO_IMAGE_MOBILE.sizes} type="image/webp" />
            <source srcSet={HERO_IMAGE.srcSet} sizes={HERO_IMAGE.sizes} type="image/webp" />
            <img
              src={HERO_IMAGE.src}
              alt="Học viên Trường Trung cấp nghề Nhân Lực Quốc Tế trong giờ học trên lớp"
              width="2000"
              height="760"
              className="absolute inset-0 h-full w-full object-cover object-right"
              loading="eager"
              fetchpriority="high"
            />
          </picture>

          {/* Lớp phủ đỏ bên trái để chữ luôn đủ tương phản, kể cả khi ảnh đổi */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/80 to-transparent sm:from-primary-dark/95 sm:via-primary-dark/55"
          />

          <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 sm:h-16 sm:w-16">
                <img
                  src={appConfig.logo}
                  alt=""
                  width="64"
                  height="64"
                  className="h-full w-full object-contain"
                  loading="eager"
                />
              </span>
              <span className="leading-tight text-white">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-yellow-300 sm:text-[15px]">
                  Trường Trung cấp nghề
                </span>
                <span className="block text-[18px] font-extrabold uppercase sm:text-[26px]">
                  Nhân Lực Quốc Tế
                </span>
              </span>
            </div>

            <h1 className="mt-5 text-white sm:mt-7">
              <span className="block text-[34px] font-extrabold uppercase leading-none sm:text-[52px] lg:text-[64px]">
                Tuyển sinh{" "}
              </span>
              <span className="mt-1 block text-[20px] font-extrabold uppercase leading-tight text-yellow-300 sm:text-[32px] lg:text-[40px]">
                Trung cấp &amp; sơ cấp tại Tân Bình, TPHCM
              </span>
            </h1>

            <span aria-hidden="true" className="mt-4 block h-1 w-20 rounded-full bg-yellow-300 sm:mt-5 sm:w-28" />

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-red-50 sm:mt-5 sm:text-[15px]">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-yellow-300">
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
              <a
                href="#register"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[14px] font-bold uppercase text-primary-dark transition-colors hover:bg-red-50 sm:text-[16px]"
              >
                Đăng ký tư vấn miễn phí
              </a>
              <a
                href={`tel:${appConfig.phoneE164}`}
                className="text-[15px] font-bold text-white hover:underline sm:text-[18px]"
              >
                Hotline {appConfig.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Thẻ nội dung nổi dưới banner */}
        <div className="-mt-4 px-4">
          <div className="mx-auto rounded-3xl bg-white/95 shadow-[0_18px_40px_rgba(15,23,42,0.16)] px-4 py-5 md:px-8 md:py-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-[11px] font-semibold text-primary-dark">
                  <span>🎓 Tuyển sinh trung cấp &amp; sơ cấp</span>
                  <span className="hidden text-[10px] text-blue-700 md:inline">Khai giảng nhiều đợt</span>
                </div>

                <p className="mt-2 text-[22px] md:text-[28px] font-extrabold uppercase leading-snug text-primary-dark">
                  Học nghề vững, đi làm sớm
                </p>

                <p className="mt-1 text-[14px] font-semibold text-slate-800">
                  Trường Trung cấp nghề Nhân Lực Quốc Tế – Tuyển sinh trung cấp, sơ cấp tại Tân Bình,
                  TP. Hồ Chí Minh
                </p>

                <p className="mt-2 text-[13px] text-slate-600 max-w-xl">
                  Thành lập năm 2007 theo Quyết định 1777/LĐTBXH-QĐ của Bộ Lao động – Thương binh
                  và Xã hội, trường đào tạo nghề gắn với nhu cầu tuyển dụng thực tế trong nước và
                  thị trường lao động ngoài nước, chú trọng thực hành và kỹ năng làm việc.
                </p>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <a
                  href="#register"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(219,16,16,0.35)] transition-colors hover:bg-primary-dark"
                >
                  <span aria-hidden="true">📝</span>
                  <span>Đăng ký tư vấn tuyển sinh</span>
                </a>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-[11px]">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label} className="rounded-2xl bg-blue-50 px-3 py-2 shadow-sm">
                  <div className="text-[15px] font-extrabold text-primary-dark">{item.value}</div>
                  <div className="text-[11px] text-slate-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HeroSection;
