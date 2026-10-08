import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import ContactCard from "../components/ContactCard";
import { GUIDES, GUIDES_PATH, guidePath } from "../content/guides";
import { staticPageMeta } from "../seo/pageMeta";

function GuidesPage() {
  const seoMeta = staticPageMeta(GUIDES_PATH);

  return (
    <>
      <Seo meta={seoMeta} />

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 text-[14px] text-slate-700">
        <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">Cẩm nang tuyển sinh</span>
        </nav>

        <h1 className="text-[24px] md:text-[28px] font-extrabold text-primary-dark leading-snug">
          Cẩm nang tuyển sinh trung cấp và chọn ngành học nghề
        </h1>
        <p className="mt-2 text-slate-600 leading-relaxed">
          Cẩm nang tuyển sinh trung cấp giải đáp những câu hỏi thường gặp trước khi đi học nghề: học gì sau lớp 9, nên chọn nghề nào,
          học trung cấp hay cao đẳng, vừa đi làm vừa đi học có được không. Nội dung do Trường Trung cấp
          Nhân Lực Quốc Tế TPHCM biên soạn.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                to={guidePath(guide.slug)}
                className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <h2 className="text-[16px] md:text-[17px] font-bold text-slate-900 leading-snug group-hover:text-primary-dark">
                  {guide.title}
                </h2>
                <p className="mt-2 flex-1 text-slate-600 leading-relaxed">{guide.excerpt}</p>
                <span className="mt-3 text-[13px] font-semibold text-primary">Đọc bài →</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-slate-600">
          Xem thêm{" "}
          <Link to="/cau-hoi-thuong-gap" className="text-primary font-medium underline underline-offset-2">
            câu hỏi thường gặp
          </Link>{" "}
          và{" "}
          <Link to="/nganh-dao-tao" className="text-primary font-medium underline underline-offset-2">
            các ngành đào tạo
          </Link>
          .
        </p>

        <ContactCard />
      </main>
    </>
  );
}

export default GuidesPage;
