import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import FaqAccordion from "../components/FaqAccordion";
import { FAQ_PAGE_PATH, staticPageMeta } from "../seo/pageMeta";
import { SITE_FAQS } from "../content/faqs";
import { PROGRAM_FAQ_GROUPS } from "../content/programFaqs";
import { programHref } from "../content/programFields";
import { GUIDES, guidePath } from "../content/guides";
import appConfig from "../configs/appConfig";

// id mục theo ngành: dùng slug đầu tiên của nhóm (ổn định, không dấu)
const groupAnchor = (group) => `nganh-${group.slugs[0].replace(/^tuyen-sinh-(nganh|lop|khoa-hoc)-/, "")}`;

function FaqPage() {
  const seoMeta = staticPageMeta(FAQ_PAGE_PATH);

  return (
    <>
      <Seo meta={seoMeta} />

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 text-[14px] text-slate-700">
        <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">Câu hỏi thường gặp</span>
        </nav>

        <h1 className="text-[24px] md:text-[28px] font-extrabold text-primary-dark leading-snug">
          Câu hỏi thường gặp khi học trung cấp tại trường
        </h1>
        <p className="mt-2 text-slate-600">
          Học trung cấp mấy năm, bằng có giá trị không, tốt nghiệp THCS có học được không? Giải đáp thắc
          mắc về tuyển sinh, thời gian học, bằng cấp, học phí và cơ hội việc làm của từng ngành tại
          Trường Trung cấp nghề Nhân Lực Quốc Tế TPHCM.
        </p>

        <section id="tuyen-sinh" className="mt-6">
          <h2 className="text-[19px] md:text-[21px] font-bold text-primary-dark mb-3">
            Tuyển sinh, bằng cấp và học phí
          </h2>
          <FaqAccordion faqs={SITE_FAQS} questionTag="h3" openFirst />
        </section>

        <section id="theo-nganh" className="mt-10">
          <h2 className="text-[19px] md:text-[21px] font-bold text-primary-dark">
            Học ngành gì, ra làm gì?
          </h2>
          <p className="mt-1 mb-3 text-slate-600">Chọn ngành để xem nhanh:</p>
          <ul className="flex flex-wrap gap-2 mb-6">
            {PROGRAM_FAQ_GROUPS.map((group) => (
              <li key={group.name}>
                <a
                  href={`#${groupAnchor(group)}`}
                  className="inline-flex rounded-full border border-primary/20 bg-white px-3 py-1 text-[13px] text-primary-dark hover:bg-primary/5"
                >
                  {group.name}
                </a>
              </li>
            ))}
          </ul>

          {PROGRAM_FAQ_GROUPS.map((group) => (
            <section key={group.name} id={groupAnchor(group)} className="mb-6">
              <h3 className="text-[16px] md:text-[17px] font-bold text-slate-800 mb-2">
                Ngành{" "}
                <Link to={programHref(group.slugs[0])} className="text-primary hover:underline">
                  {group.name}
                </Link>
              </h3>
              <FaqAccordion faqs={group.faqs} questionTag="h4" />
            </section>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-[19px] md:text-[21px] font-bold text-primary-dark mb-3">Cẩm nang tuyển sinh</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link to={guidePath(guide.slug)} className="text-primary hover:underline">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl bg-primary/5 border border-primary/10 px-5 py-5 text-center">
          <h2 className="text-[17px] font-bold text-primary-dark">Chưa tìm thấy câu trả lời?</h2>
          <p className="mt-1 text-slate-600">
            Gọi hotline{" "}
            <a href={`tel:${appConfig.phoneE164}`} className="font-semibold text-primary">
              {appConfig.phone}
            </a>{" "}
            hoặc để lại thông tin, nhà trường sẽ tư vấn miễn phí.
          </p>
          <Link
            to="/#register"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 font-semibold text-white hover:opacity-90"
          >
            Đăng ký tư vấn
          </Link>
        </section>
      </main>
    </>
  );
}

export default FaqPage;
