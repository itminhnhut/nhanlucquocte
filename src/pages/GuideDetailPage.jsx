import { Link, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import ContactCard from "../components/ContactCard";
import ContentSections, { sectionId } from "../components/ContentSections";
import NotFoundPage from "./NotFoundPage";
import appConfig from "../configs/appConfig";
import { GUIDES_PATH, guideBySlug, guidePath, otherGuides } from "../content/guides";
import { guidePageMeta } from "../seo/pageMeta";
import { formatDateVi } from "../utils/formatDate";

function GuideDetailPage() {
  const { slug } = useParams();
  const guide = guideBySlug(slug);
  if (!guide) return <NotFoundPage />;

  const related = otherGuides(guide.slug);

  return (
    <>
      <Seo meta={guidePageMeta(guide)} />

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 text-[15px] text-slate-700 leading-relaxed">
        <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <Link to={GUIDES_PATH} className="hover:text-primary">
            Cẩm nang
          </Link>
        </nav>

        <article>
          <header>
            <h1 className="text-[24px] md:text-[30px] font-extrabold text-slate-900 leading-tight">
              {guide.title}
            </h1>
            {/* Người viết + ngày cập nhật: khớp author, dateModified trong schema Article */}
            <p className="mt-2 text-[12px] text-slate-500">
              Biên soạn: <span className="font-semibold text-slate-700">{appConfig.legalName}</span>
              {" · "}Cập nhật <time dateTime={guide.dateModified}>{formatDateVi(guide.dateModified)}</time>
            </p>
            <p className="mt-4 text-[16px] text-slate-800">{guide.lead}</p>
          </header>

          <nav aria-label="Mục lục bài viết" className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <h2 className="text-[15px] font-bold text-primary-dark mb-2">Nội dung chính</h2>
            <ol className="m-0 list-decimal pl-5 space-y-1 text-[14px]">
              {guide.sections.map((section, index) => (
                <li key={section.heading}>
                  <a href={`#${sectionId(index)}`} className="text-slate-700 hover:text-primary-dark">
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ContentSections sections={guide.sections} />
        </article>

        <ContactCard />

        {related.length > 0 && (
          <section aria-labelledby="related-guides" className="mt-10">
            <h2 id="related-guides" className="text-[18px] font-bold text-primary-dark mb-3">
              Đọc tiếp trong Cẩm nang
            </h2>
            <ul className="space-y-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link to={guidePath(item.slug)} className="text-primary font-medium hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

export default GuideDetailPage;
