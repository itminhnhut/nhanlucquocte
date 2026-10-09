import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { staticPageMeta } from "../seo/pageMeta";
import appConfigs from "../configs/appConfig";
import InlineText from "../components/InlineText";
import { LANDMARKS, ROUTES, TRANSPORT_NOTES, VISIT_NOTES } from "../content/directions";

function ContactPage() {
  const schoolName = appConfigs.legalName;

  const address = appConfigs.address;
  const hotline = appConfigs.phone;
  const email = appConfigs.email;
  const seoMeta = staticPageMeta("/lien-he");

  return (
    <>
      <Seo meta={seoMeta} />

      <main className="bg-slate-50">
        <section className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
          {/* Title */}
          <header className="text-center mb-8 lg:mb-10">
            <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold text-primary-dark leading-snug">
              Liên hệ {schoolName}
            </h1>
            <p className="mt-3 text-[13px] sm:text-[14px] text-slate-600 max-w-2xl mx-auto">
              Trường ở số 6 Phan Đình Giót, phường Tân Sơn Hòa (Quận Tân Bình cũ), TP. Hồ Chí Minh,
              ngay trục đường vào sân bay Tân Sơn Nhất. Cần tư vấn tuyển sinh, ngành học, hồ sơ nhập học
              hay học phí, bạn gọi hotline, nhắn Zalo hoặc{" "}
              <Link to="/tuyen-sinh" className="text-primary font-medium underline underline-offset-2">
                xem thông tin tuyển sinh
              </Link>
              .
            </p>
          </header>

          {/* Content */}
          <div className="grid lg:grid-cols-[1.1fr_minmax(0,1.1fr)] gap-6 lg:gap-10 items-start">
            {/* Info block */}
            <section className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 lg:p-7 text-[13px] sm:text-[14px] text-slate-700">
              <h2 className="text-[16px] sm:text-[18px] font-bold text-primary-dark mb-3">
                Địa chỉ, hotline và email tuyển sinh
              </h2>
              <p className="mb-4">
                {schoolName} đào tạo nghề hệ trung cấp chú trọng thực hành, gắn
                kết doanh nghiệp và hỗ trợ học viên phát triển kỹ năng nghề
                nghiệp. Mọi thắc mắc về tuyển sinh hệ trung cấp, khóa học ngắn
                hạn hoặc các chương trình hợp tác, bạn có thể liên hệ trực tiếp:
              </p>

              <ul className="space-y-2.5 mb-5">
                <li className="flex items-start gap-2">
                  <span className="mt-[2px] text-primary-dark">📍</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Địa chỉ cơ sở chính
                    </p>
                    <address className="not-italic">
                      <a href={appConfigs.mapLink} target="_blank" rel="noreferrer" className="hover:underline">
                        {address}
                      </a>
                    </address>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[2px] text-primary-dark">📞</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Hotline / Tư vấn tuyển sinh
                    </p>
                    <a
                      href={`tel:${appConfigs.phoneE164}`}
                      className="text-slate-800 underline"
                    >
                      {hotline}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[2px] text-primary-dark">💬</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Zalo tư vấn tuyển sinh
                    </p>
                    <a
                      href={appConfigs.zalo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-800 underline"
                    >
                      Nhắn tin Zalo tư vấn
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[2px] text-primary-dark">✉️</span>
                  <div>
                    <p className="font-semibold text-slate-800">Email</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-slate-800 hover:underline break-all"
                    >
                      {email}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="border-t border-dashed border-slate-200 pt-4 mt-2 flex flex-wrap gap-2.5">
                <a
                  href={`tel:${appConfigs.phoneE164}`}
                  className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-dark"
                >
                  Gọi {hotline}
                </a>
                <a
                  href={appConfigs.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-primary px-5 py-2.5 font-semibold text-primary-dark hover:bg-blue-50"
                >
                  Nhắn Zalo
                </a>
                <Link
                  to="/#register"
                  className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Để lại thông tin tư vấn
                </Link>
              </div>

              <p className="mt-5 text-[12px] text-slate-500 italic">
                Nên gọi hotline hoặc nhắn Zalo trước khi đến để nhà trường bố trí
                người tư vấn và hướng dẫn lối vào.
              </p>
            </section>

            {/* Map */}
            <section className="space-y-3">
              <h2 className="text-[15px] sm:text-[16px] font-semibold text-primary-dark">
                Bản đồ đến Trường Trung cấp nghề Nhân Lực Quốc Tế
              </h2>
              <p className="text-[12px] sm:text-[13px] text-slate-600 mb-1">
                Trường nằm tại số <strong>6</strong> Phan Đình Giót, phường Tân Sơn Hòa (Phường 2, Quận Tân
                Bình cũ), trên trục đường vào sân bay Tân Sơn Nhất. Nên đến sớm 10-15 phút trước giờ hẹn
                để được hỗ trợ tốt nhất.
              </p>

              <div className="relative w-full overflow-hidden rounded-2xl shadow-soft bg-slate-200">
                <div className="pt-[62%] sm:pt-[60%] lg:pt-[70%]" />
                <iframe
                  title="Bản đồ đến Trường Trung cấp nghề Nhân Lực Quốc Tế, số 6 Phan Đình Giót, Tân Bình"
                  src={appConfigs.mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              <div className="bg-white/60 border border-dashed border-primary-dark/20 rounded-xl px-4 py-3 text-[12px] sm:text-[13px] text-slate-600">
                <p className="font-semibold text-primary-dark mb-1">Mốc dễ nhận ra quanh trường</p>
                <ul className="list-disc pl-4 space-y-1">
                  {LANDMARKS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <section aria-labelledby="duong-den-truong" className="mt-8 rounded-2xl bg-white p-5 shadow-soft sm:p-6 lg:p-7">
            <h2 id="duong-den-truong" className="text-[16px] sm:text-[18px] font-bold text-primary-dark mb-2">
              Đường đến Trường Trung cấp nghề Nhân Lực Quốc Tế
            </h2>
            <p className="text-[13px] sm:text-[14px] text-slate-600">
              Trường nằm trên đường Phan Đình Giót, phường Tân Sơn Hòa (Quận Tân Bình cũ), ngay khu vực
              vòng xoay Lăng Cha Cả và trục đường vào ga quốc nội sân bay Tân Sơn Nhất, nên đi lại thuận
              tiện từ hầu hết các quận.
            </p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {ROUTES.map((item) => (
                <li key={item.from} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                  <p className="text-[13px] font-bold text-primary-dark">{item.from}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{item.route}</p>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 mb-1.5">Phương tiện và lưu ý</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-slate-600">
                  {TRANSPORT_NOTES.map((item) => (
                    <li key={item}>
                      <InlineText text={item} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 mb-1.5">Khi đến trường</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-slate-600">
                  {VISIT_NOTES.map((item) => (
                    <li key={item}>
                      <InlineText text={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

export default ContactPage;
