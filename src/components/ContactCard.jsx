import { Link } from "react-router-dom";
import appConfig from "../configs/appConfig";

// Thẻ liên hệ cuối trang ngành — thay khối "Thông tin liên hệ" gõ tay trong CMS
// (đã bỏ bằng utils/contactBlock.ts). Một nguồn dữ liệu (appConfig) → tên, địa chỉ,
// số điện thoại giống hệt footer, trang Liên hệ và schema.
function ContactRow({ icon, label, children }) {
  return (
    <li className="group flex items-start gap-3">
      <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[15px] shadow-sm transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <div className="text-[14px] text-slate-800">{children}</div>
      </div>
    </li>
  );
}

function ContactCard({ programName }) {
  const phoneHref = `tel:${appConfig.phoneE164}`;
  return (
    <section
      aria-labelledby="contact-card-title"
      className="reveal mt-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-6 shadow-soft"
    >
      <h2 id="contact-card-title" className="text-[18px] md:text-[20px] font-bold text-primary-dark">
        Liên hệ tư vấn tuyển sinh
      </h2>
      <p className="mt-1 text-[13px] text-slate-600">
        {programName ? `Cần tư vấn về ${programName}? ` : ""}
        Liên hệ {appConfig.legalName} để được tư vấn ngành học, lịch khai giảng và học phí.
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        <ContactRow icon="📍" label="Địa chỉ">
          <a href={appConfig.mapLink} target="_blank" rel="noreferrer" className="hover:underline">
            {appConfig.address}
          </a>
        </ContactRow>
        <ContactRow icon="📞" label="Hotline">
          <a href={phoneHref} className="font-semibold hover:underline">
            {appConfig.phone}
          </a>
        </ContactRow>
        <ContactRow icon="✉️" label="Email">
          <a href={`mailto:${appConfig.email}`} className="break-all hover:underline">
            {appConfig.email}
          </a>
        </ContactRow>
        <ContactRow icon="💬" label="Zalo">
          <a href={appConfig.zalo} target="_blank" rel="noreferrer" className="hover:underline">
            Nhắn tin Zalo tư vấn
          </a>
        </ContactRow>
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={phoneHref}
          className="inline-flex items-center justify-center rounded-full bg-primary-dark px-4 py-2 text-[13px] font-semibold text-white shadow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-dark/90 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Gọi {appConfig.phone}
        </a>
        <Link
          to="/#register"
          className="inline-flex items-center justify-center rounded-full border border-primary-dark px-4 py-2 text-[13px] font-semibold text-primary-dark transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-blue-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Đăng ký tư vấn
        </Link>
      </div>
    </section>
  );
}

export default ContactCard;
