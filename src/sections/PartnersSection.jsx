import { Link } from "react-router-dom";
import { PARTNERS } from "../content/partners";

// Dải logo chạy liên tục bằng CSS (không JS, không ảnh hưởng tốc độ tải).
// Danh sách lặp 2 lần để vòng chạy liền mạch; bản lặp thứ hai ẩn với trình đọc màn hình.
function PartnerLogo({ partner, duplicate }) {
  return (
    <li
      className="flex w-[150px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:w-[180px]"
      aria-hidden={duplicate ? "true" : undefined}
    >
      <img
        src={partner.logo}
        alt={duplicate ? "" : `Logo ${partner.name}`}
        width={partner.width}
        height={partner.height}
        loading="lazy"
        decoding="async"
        className="h-14 w-auto max-w-full object-contain"
      />
      <span className="text-center text-[12px] leading-snug text-slate-600">{partner.name}</span>
    </li>
  );
}

function PartnersSection() {
  if (PARTNERS.length === 0) return null;

  return (
    <section id="doi-tac" className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-[13px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
          Hợp tác
        </p>
        <h2 className="text-center text-[22px] font-extrabold uppercase text-primary-dark mb-5">
          Đối tác – Trường liên kết
        </h2>

        <div className="partner-marquee-mask overflow-hidden">
          <ul className="partner-marquee flex w-max gap-3">
            {PARTNERS.map((partner) => (
              <PartnerLogo key={partner.name} partner={partner} />
            ))}
            {PARTNERS.map((partner) => (
              <PartnerLogo key={`${partner.name}-2`} partner={partner} duplicate />
            ))}
          </ul>
        </div>

        <p className="mt-5 text-center text-[13px] text-slate-600">
          Doanh nghiệp muốn đặt hàng đào tạo hoặc tuyển dụng học viên,{" "}
          <Link to="/lien-he" className="font-medium text-primary underline underline-offset-2">
            liên hệ nhà trường
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export default PartnersSection;
