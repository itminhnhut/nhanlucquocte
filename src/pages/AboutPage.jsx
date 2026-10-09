import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import ContactCard from "../components/ContactCard";
import appConfig from "../configs/appConfig";
import { CORE_VALUES, FACULTY, HISTORY, MISSION, SCHOOL_UNITS, VISION } from "../content/schoolProfile";
import { PROGRAM_FIELDS } from "../content/programFields";
import { staticPageMeta } from "../seo/pageMeta";

// Nội dung viết lại từ trang Giới thiệu của trungcapnhanlucquocte.vn, chỉ giữ thông tin có căn cứ
// (quyết định thành lập, mốc hoạt động, đội ngũ, lĩnh vực đào tạo) — xem src/content/schoolProfile.ts.
const SCHOOL_FACTS = [
  { label: "Tên trường", value: appConfig.legalName },
  { label: "Thành lập", value: `Ngày 13/12/2007, theo ${appConfig.foundingDecision}` },
  { label: "Loại hình", value: "Trường trung cấp nghề, đào tạo hệ trung cấp và sơ cấp" },
  { label: "Địa chỉ", value: appConfig.address },
  { label: "Hotline", value: appConfig.phone, href: `tel:${appConfig.phoneE164}` },
  { label: "Email", value: appConfig.email, href: `mailto:${appConfig.email}` },
];

const SECTION_TITLE = "text-[18px] md:text-[20px] font-bold text-primary-dark mb-3";

function AboutPage() {
  const seoMeta = staticPageMeta("/gioi-thieu");
  return (
    <>
      <Seo meta={seoMeta} />

      <div className="max-w-7xl mx-auto px-4 py-8 text-[14px] text-slate-700 leading-relaxed space-y-8">
        <header>
          <h1 className="text-2xl md:text-[28px] font-bold text-primary-dark mb-3">
            Giới thiệu Trường Trung cấp nghề Nhân Lực Quốc Tế
          </h1>
          <p>
            <strong className="text-primary-dark">{appConfig.legalName}</strong> được Bộ Lao động –
            Thương binh và Xã hội thành lập ngày <strong>13/12/2007</strong> theo{" "}
            {appConfig.foundingDecision}, nằm trong mục tiêu nâng cao chất lượng nguồn nhân lực tại các
            tỉnh phía Nam và phục vụ hội nhập quốc tế. Trụ sở tại {appConfig.address}.
          </p>
        </header>

        <section aria-labelledby="about-facts" className="reveal">
          <h2 id="about-facts" className={SECTION_TITLE}>
            Thông tin chung
          </h2>
          <dl className="grid gap-x-6 gap-y-3 rounded-2xl bg-white border border-slate-100 shadow-sm p-5 sm:grid-cols-[160px_1fr]">
            {SCHOOL_FACTS.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="font-semibold text-slate-500">{fact.label}</dt>
                <dd className="text-slate-800">
                  {fact.href ? (
                    <a href={fact.href} className="hover:underline break-all">
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="about-history" className="reveal">
          <h2 id="about-history" className={SECTION_TITLE}>
            Quá trình hình thành và phát triển
          </h2>
          <ol className="space-y-3">
            {HISTORY.map((item) => (
              <li key={item.year} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[12px] font-semibold text-primary-dark">
                  {item.year}
                </span>
                <p className="mt-2">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="about-fields" className="reveal">
          <h2 id="about-fields" className={SECTION_TITLE}>
            Lĩnh vực đào tạo
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {PROGRAM_FIELDS.map((field) => (
              <li key={field.id} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
                <span aria-hidden="true">{field.icon}</span>
                <span>
                  <Link to={`/nganh-dao-tao#${field.anchor}`} className="font-semibold text-primary-dark hover:underline">
                    {field.name}
                  </Link>
                  <span className="block text-[13px] text-slate-600">
                    {field.programs.map((program) => program.name).join(", ")}.
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="about-values" className="reveal">
          <h2 id="about-values" className={SECTION_TITLE}>
            Giá trị cốt lõi
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            {CORE_VALUES.map((value) => (
              <li key={value.title}>
                <strong>{value.title}:</strong> {value.text}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="about-vision" className="reveal grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 id="about-vision" className="mb-2 text-[16px] font-bold text-primary-dark">
              Tầm nhìn
            </h2>
            <p>{VISION}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-[16px] font-bold text-primary-dark">Sứ mệnh</h2>
            <p>{MISSION}</p>
          </div>
        </section>

        <section aria-labelledby="about-faculty" className="reveal">
          <h2 id="about-faculty" className={SECTION_TITLE}>
            Đội ngũ giảng viên và cơ sở thực hành
          </h2>
          <p>{FACULTY}</p>
          {/* Chỉ các đơn vị nhà trường đã nêu tên trong bài của mình — xem SCHOOL_UNITS */}
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            {SCHOOL_UNITS.map((unit) => (
              <li key={unit}>{unit}</li>
            ))}
          </ul>
          <p className="mt-3">
            Xem thêm{" "}
            <Link to="/tuyen-sinh" className="font-medium text-primary underline underline-offset-2">
              thông tin tuyển sinh
            </Link>{" "}
            hoặc{" "}
            <Link to="/tra-cuu-van-bang" className="font-medium text-primary underline underline-offset-2">
              tra cứu văn bằng
            </Link>{" "}
            do trường cấp.
          </p>
          <p className="mt-3">
            Sự kiện, lễ khai giảng và lễ tốt nghiệp của nhà trường có ở trang{" "}
            <Link to="/hoat-dong-hoc-vien" className="font-medium text-primary underline underline-offset-2">
              hoạt động học viên
            </Link>
            ; cơ hội thực tập và tuyển dụng từ doanh nghiệp ở trang{" "}
            <Link to="/hop-tac-doanh-nghiep" className="font-medium text-primary underline underline-offset-2">
              hợp tác doanh nghiệp
            </Link>
            .
          </p>
        </section>

        <ContactCard />
      </div>
    </>
  );
}

export default AboutPage;
