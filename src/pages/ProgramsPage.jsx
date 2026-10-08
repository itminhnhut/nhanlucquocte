// src/pages/ProgramsPage.jsx
import { Seo } from "../components/Seo";
import { programsListPageMeta, staticPageMeta } from "../seo/pageMeta";
import { Link } from "react-router-dom";
import appConfig from "../configs/appConfig";
import ContactCard from "../components/ContactCard";
import FaqAccordion from "../components/FaqAccordion";
import ProgramCard from "../components/ProgramCard";
import { PROGRAM_FIELDS, groupProgramsByField } from "../content/programFields";
import { fieldGuides } from "../content/programExtras";
import { usePrograms } from "../hooks/usePrograms";
import { SITE_FAQS } from "../content/faqs";

// Câu hỏi hay gặp khi chọn ngành — chọn theo id trong src/content/faqs.ts (không so khớp câu chữ,
// vì sửa câu hỏi một chữ là khối này sẽ rỗng mà không ai biết).
const PROGRAMS_PAGE_FAQ_IDS = ["thoi-gian-hoc", "tot-nghiep-thcs", "van-bang", "lien-thong", "vua-hoc-vua-lam", "hoc-phi"];
const PROGRAMS_PAGE_FAQS = PROGRAMS_PAGE_FAQ_IDS.map((id) => SITE_FAQS.find((faq) => faq.id === id)).filter(Boolean);

// Gợi ý nhanh: sở thích → lĩnh vực (nhảy tới nhóm ngành bên dưới)
function InterestGuide() {
  return (
    <section aria-labelledby="interest-guide" className="mb-10">
      <h2 id="interest-guide" className="text-[16px] md:text-[18px] font-bold text-primary-dark mb-3">
        Chọn ngành theo sở thích
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {PROGRAM_FIELDS.map((field) => (
          <li key={field.id}>
            <a
              href={`#${field.anchor}`}
              className="group flex h-full items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[17px] transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none">
                {field.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold leading-snug text-primary-dark">{field.name}</span>
                <span className="block text-[11px] leading-snug text-slate-500">{field.interest}</span>
              </span>
              <span aria-hidden="true" className="shrink-0 text-slate-300 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-primary-dark motion-reduce:transition-none">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProgramsPage() {
  const { programs, loading, error, now } = usePrograms();

  // Có danh sách ngành → thêm ItemList Course vào schema (khớp HTML tạo sẵn)
  const seoMeta = programs.length ? programsListPageMeta(programs) : staticPageMeta("/nganh-dao-tao");

  const groups = groupProgramsByField(programs);

  return (
    <>
      <Seo meta={seoMeta} />

      <main className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* HEADER NỔI BẬT */}
          <header className="mb-8">
            <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-2">
              <Link to="/" className="hover:text-primary">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-slate-700">Ngành đào tạo</span>
            </nav>
            <h1 className="text-[28px] md:text-[34px] font-extrabold leading-tight text-slate-900">
              Ngành đào tạo trung cấp nghề và sơ cấp tại TPHCM
            </h1>
            <p className="mt-2 max-w-4xl text-[14px] md:text-[15px] text-slate-600 leading-relaxed">
              Ngành đào tạo trung cấp nghề và các khóa sơ cấp, ngắn hạn {appConfig.legalName} đang tuyển sinh tại{" "}
              {appConfig.address}. Chương trình chú trọng thực hành; hoàn thành chương trình trung cấp được cấp bằng
              tốt nghiệp trung cấp theo Luật Giáo dục nghề nghiệp số 124/2025/QH15, khóa sơ cấp được cấp
              chứng chỉ.
            </p>
            {programs.length > 0 && (
              <p className="mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-600">
                <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-primary-dark">
                  {programs.length} ngành và khóa học đang tuyển sinh
                </span>
                <Link to="/cau-hoi-thuong-gap" className="text-primary font-medium underline underline-offset-2">
                  Chưa biết chọn ngành nào?
                </Link>
              </p>
            )}
          </header>

          <InterestGuide />

          {/* STATES */}
          {loading && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 animate-pulse"
                >
                  <div className="h-4 w-2/3 bg-slate-200 rounded mb-3"></div>
                  <div className="h-3 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-5/6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-4/6 bg-slate-200 rounded mb-4"></div>
                  <div className="h-3 w-1/3 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-red-500 text-sm py-6">{error}</div>
          )}

          {!loading && !error && programs.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-6">
              Hiện chưa có ngành đào tạo nào.
            </div>
          )}

          {/* NGÀNH THEO LĨNH VỰC – LẤY ALL, KHÔNG SLICE */}
          {!loading && !error && programs.length > 0 && (
            <div className="space-y-10">
              {groups.map(({ field, programs: fieldPrograms }) => {
                const guides = fieldGuides(field.id);
                return (
                  <section
                    key={field.id}
                    aria-labelledby={field.anchor}
                    className="reveal scroll-mt-24 grid grid-cols-1 gap-5 border-t border-slate-200 pt-8 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)]"
                  >
                    {/* Trái: lĩnh vực + bài so sánh; phải: thẻ ngành → không còn khoảng trống khi lĩnh vực ít ngành */}
                    <div>
                      <h2 id={field.anchor} className="flex items-center gap-2 text-[20px] md:text-[22px] font-bold text-primary-dark">
                        <span aria-hidden="true">{field.icon}</span>
                        {field.name}
                      </h2>
                      <p className="mt-2 text-[14px] text-slate-600 leading-relaxed">{field.intro}</p>
                      {guides.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-[14px]">
                          {guides.map((guide) => (
                            <li key={guide.path}>
                              <Link to={guide.path} className="text-primary font-medium underline underline-offset-2 hover:text-primary-dark">
                                {guide.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                      {fieldPrograms.map((program, index) => (
                        <li key={program.id || program.slug || index}>
                          <ProgramCard program={program} now={now} />
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}

          <section aria-labelledby="programs-faq" className="reveal mt-12">
            <h2 id="programs-faq" className="text-[18px] md:text-[20px] font-bold text-primary-dark mb-3">
              Câu hỏi thường gặp khi chọn ngành trung cấp
            </h2>
            {/* Không đánh schema FAQPage ở đây: các câu này đã đánh dấu ở /cau-hoi-thuong-gap */}
            <FaqAccordion faqs={PROGRAMS_PAGE_FAQS} />
          </section>

          <ContactCard />
        </div>
      </main>
    </>
  );
}

export default ProgramsPage;
