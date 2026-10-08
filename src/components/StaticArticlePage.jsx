import { Link } from "react-router-dom";
import { Seo } from "./Seo";
import ContactCard from "./ContactCard";
import ContentSections, { sectionId } from "./ContentSections";
import { staticPageMeta } from "../seo/pageMeta";
import appConfig from "../configs/appConfig";

const BUTTON = "inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold transition-colors";

/** Khung chung cho các trang nội dung tĩnh: breadcrumb → H1 → mở bài → CTA → mục lục → nội dung */
function StaticArticlePage({ path, crumb, heading, lead, sections, children }) {
  const toc = sections.map((section, index) => ({ id: sectionId(index), label: section.heading }));

  return (
    <>
      <Seo meta={staticPageMeta(path)} />
      <main className="bg-slate-50 min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 text-[14px] md:text-[15px] text-slate-700 leading-relaxed">
          <header>
            <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
              <Link to="/" className="hover:text-primary">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-slate-700">{crumb}</span>
            </nav>
            <h1 className="text-[26px] md:text-[32px] font-extrabold leading-tight text-slate-900">{heading}</h1>
            <p className="mt-3">{lead}</p>
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

          {toc.length > 1 && (
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
          )}

          {children}

          <ContentSections sections={sections} />

          <ContactCard />
        </div>
      </main>
    </>
  );
}

export default StaticArticlePage;
