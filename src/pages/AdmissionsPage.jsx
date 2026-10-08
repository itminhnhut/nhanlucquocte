import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import ContactCard from "../components/ContactCard";
import ContentSections, { sectionId } from "../components/ContentSections";
import { staticPageMeta } from "../seo/pageMeta";
import { ADMISSIONS_LEAD, ADMISSIONS_PATH, ADMISSIONS_SECTIONS } from "../content/admissions";
import { LEVEL_LABEL, PROGRAM_FIELDS } from "../content/programFields";
import appConfig from "../configs/appConfig";

const PROGRAMS_SECTION_ID = "nganh-tuyen-sinh";
const BUTTON = "inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold transition-colors";

// Danh mục ngành tĩnh: bài ngành chưa import vào database nên chưa link sang trang ngành,
// chỉ nêu tên ngành kèm trình độ để người đọc biết trường đang đào tạo gì.
function ProgramCatalog() {
  return (
    // Xếp theo cột (không phải lưới) → thẻ lĩnh vực ít ngành không bị kéo cao, không để khoảng trống
    <div className="gap-4 sm:columns-2">
      {PROGRAM_FIELDS.map((field) => (
        <div key={field.id} className="mb-4 min-w-0 break-inside-avoid rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <span aria-hidden="true">{field.icon}</span>
            {field.name}
          </h3>
          <ul className="divide-y divide-slate-100">
            {field.programs.map((program) => (
              <li key={program.slug} className="py-2 first:pt-0 last:pb-0">
                <span className="font-semibold text-slate-800">{program.name}</span>
                {program.levelConfirmed && (
                  <span className="mt-0.5 block text-[12px] text-slate-600">{LEVEL_LABEL[program.level]}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function AdmissionsPage() {
  const toc = [
    { id: PROGRAMS_SECTION_ID, label: "Ngành tuyển sinh theo lĩnh vực" },
    ...ADMISSIONS_SECTIONS.map((section, index) => ({ id: sectionId(index), label: section.heading })),
  ];

  return (
    <>
      <Seo meta={staticPageMeta(ADMISSIONS_PATH)} />
      <main className="bg-slate-50 min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 text-[14px] md:text-[15px] text-slate-700 leading-relaxed">
          <header>
            <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
              <Link to="/" className="hover:text-primary">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-slate-700">Tuyển sinh</span>
            </nav>
            <h1 className="text-[26px] md:text-[32px] font-extrabold leading-tight text-slate-900">
              Tuyển sinh trung cấp nghề Nhân Lực Quốc Tế TPHCM
            </h1>
            <p className="mt-3">{ADMISSIONS_LEAD}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/#register" className={`${BUTTON} bg-primary-dark text-white hover:bg-primary`}>
                Đăng ký tư vấn
              </Link>
              <a href={`tel:${appConfig.phoneE164}`} className={`${BUTTON} border border-primary-dark text-primary-dark hover:bg-blue-50`}>
                Gọi {appConfig.phone}
              </a>
              <a
                href={appConfig.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BUTTON} border border-primary-dark text-primary-dark hover:bg-blue-50`}
              >
                Nhắn Zalo
              </a>
            </div>
          </header>

          <nav aria-label="Mục lục" className="mt-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900 mb-2">Nội dung trang</p>
            <ol className="list-decimal pl-5 space-y-1 text-[14px]">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-primary hover:underline underline-offset-2">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <section id={PROGRAMS_SECTION_ID} className="mt-8 scroll-mt-24">
            <h2 className="text-[19px] md:text-[21px] font-bold text-primary-dark mb-3">
              Ngành tuyển sinh theo lĩnh vực
            </h2>
            <p className="mb-4">
              Trường khai giảng nhiều đợt trong năm. Lịch khai giảng gần nhất của từng ngành thay đổi theo đợt,
              hãy hỏi khi đăng ký tư vấn.
            </p>
            <ProgramCatalog />
          </section>

          <ContentSections sections={ADMISSIONS_SECTIONS} />

          <ContactCard />
        </div>
      </main>
    </>
  );
}

export default AdmissionsPage;
