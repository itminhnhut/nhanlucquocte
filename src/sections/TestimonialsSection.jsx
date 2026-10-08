import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { REASONS, TESTIMONIALS } from "../content/testimonials";
import { programHref } from "../content/programFields";

const SECTION_TITLE = "text-center text-[22px] font-extrabold uppercase text-primary-dark mb-5";
const EYEBROW = "text-center text-[13px] font-semibold uppercase tracking-wide text-slate-500 mb-1";

// Chưa có cảm nhận thật của học viên → hiện lý do chọn trường (không bịa lời chứng thực)
function Reasons() {
  return (
    <section id="vi-sao-chon-truong" className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <p className={EYEBROW}>Vì sao chọn trường</p>
        <h2 className={SECTION_TITLE}>Học nghề tại Trường Trung cấp nghề Nhân Lực Quốc Tế</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <li key={reason.title} className="reveal rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span aria-hidden="true" className="text-[22px]">
                {reason.icon}
              </span>
              <h3 className="mt-2 text-[15px] font-bold text-primary-dark">{reason.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{reason.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  if (TESTIMONIALS.length === 0) return <Reasons />;

  return (
    <section id="testimonials" className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <p className={EYEBROW}>Nhận xét</p>
        <h2 className={SECTION_TITLE}>Cảm nhận học viên Trường Trung cấp nghề Nhân Lực Quốc Tế</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          watchSlidesProgress
          grabCursor
          centeredSlides
          slidesPerView={1.1}
          spaceBetween={24}
          rewind
          breakpoints={{
            768: { slidesPerView: 1.2, spaceBetween: 24 },
            1024: { slidesPerView: 1.3, spaceBetween: 28 },
          }}
          pagination={{ clickable: true }}
          className="max-w-3xl mx-auto pb-8"
        >
          {TESTIMONIALS.map((item) => (
            <SwiperSlide key={item.major}>
              <figure className="testimonial-gradient rounded-3xl shadow-soft p-5 md:p-6 text-[13px] text-slate-600 min-h-[140px] flex flex-col justify-center">
                <blockquote className="italic mb-3 leading-relaxed">“{item.content}”</blockquote>
                <figcaption className="flex items-center gap-3">
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt={`Ảnh ${item.major}`}
                      width={320}
                      height={320}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  )}
                  <span>
                  <div className="font-semibold text-primary-dark">{item.name}</div>
                  {item.programSlug ? (
                    <Link
                      to={programHref(item.programSlug)}
                      className="text-[12px] text-slate-500 underline-offset-2 hover:text-primary hover:underline"
                    >
                      {item.major}
                    </Link>
                  ) : (
                    <div className="text-[12px] text-slate-500">{item.major}</div>
                  )}
                  </span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default TestimonialsSection;
