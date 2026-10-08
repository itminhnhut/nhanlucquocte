import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import { Link } from "react-router-dom";
import appConfig from "../configs/appConfig";
import { useIsHydrated } from "../hooks/useIsHydrated";

// Ảnh thật của trường (lớp học, lễ khai giảng, hoạt động hiến máu)
const baseIntroImages = [
  "/images/intro/intro-01.webp",
  "/images/intro/intro-02.webp",
  "/images/intro/intro-03.webp",
  "/images/intro/intro-04.webp",
  "/images/intro/intro-05.webp",
];

const introImages = baseIntroImages;

function IntroSection() {
  // Ảnh slider tải sau khi trang đã hiện: HTML tạo sẵn có mọi ảnh sẽ làm banner (LCP) tải chậm.
  // Khung slider cao cố định → hiện ảnh sau không làm xê dịch bố cục.
  const isHydrated = useIsHydrated();
  return (
    <section id="about" className="pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid gap-8 md:grid-cols-2 items-center">
        <div className="bg-white rounded-[16px] shadow-soft p-5 text-[13px] text-slate-600">
          <h2 className="text-[18px] font-semibold text-primary-dark mb-2">
            Giới thiệu Trường Trung cấp nghề Nhân Lực Quốc Tế
          </h2>
          <p className="mb-2">
            <strong>Trường Trung cấp nghề Nhân Lực Quốc Tế</strong> được Bộ Lao động – Thương binh và
            Xã hội thành lập ngày <strong>13/12/2007</strong> theo Quyết định số 1777/LĐTBXH-QĐ, với
            mục tiêu nâng cao chất lượng nguồn nhân lực tại các tỉnh phía Nam và phục vụ hội nhập
            quốc tế.
          </p>
          <p className="mb-2">
            Trong 5 năm đầu hoạt động, trường đã đào tạo <strong>hơn 20.000 lao động</strong> cho hàng
            chục công ty, cung ứng cho thị trường trong nước và các thị trường Nhật Bản, Hàn Quốc,
            Đài Loan. Hiện nay trường tuyển sinh hệ trung cấp và sơ cấp theo chỉ tiêu nhà nước, với
            hơn <strong>2.500 lượt học viên mỗi năm</strong>.
          </p>
          <p>
            Trụ sở tại <strong>{appConfig.address}</strong>, hệ thống trang thiết bị giảng dạy phục vụ
            đào tạo nguồn nhân lực chất lượng cao.{" "}
            <Link to="/gioi-thieu" className="font-medium text-primary underline underline-offset-2">
              Xem chi tiết về trường
            </Link>
            .
          </p>
        </div>
        <div className="relative rounded-[28px] overflow-hidden shadow-xl">
          <button className="intro-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm">
            ‹
          </button>

          <button className="intro-next absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm">
            ›
          </button>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".intro-prev",
              nextEl: ".intro-next",
            }}
            loop
            loopAdditionalSlides={5}
            watchOverflow={false}
            observer={true}
            observeParents={true}
            slidesPerView={1.1}
            spaceBetween={12}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 16 },
              1024: { slidesPerView: 1.35, spaceBetween: 24 },
            }}
            className="intro-swiper h-[260px] md:h-[320px] lg:h-[360px]"
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            speed={500}
            watchSlidesProgress={true}
            grabCursor={true}
            rewind={true}
          >
            {introImages.map((src, index) => (
              <SwiperSlide key={src} className="!h-full bg-slate-200">
                {isHydrated && (
                  <img
                    src={src}
                    alt={`Học viên và cơ sở Trường Trung cấp nghề Nhân Lực Quốc Tế, ảnh ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default IntroSection;
