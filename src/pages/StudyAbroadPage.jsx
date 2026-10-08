import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import ContactCard from "../components/ContactCard";
import ContentSections, { sectionId } from "../components/ContentSections";
import { staticPageMeta } from "../seo/pageMeta";
import { STUDY_ABROAD_LEAD, STUDY_ABROAD_PATH, STUDY_ABROAD_SECTIONS } from "../content/studyAbroad";
import appConfig from "../configs/appConfig";
import https from "../utils/https";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { formatDateVi } from "../utils/formatDate";

const BUTTON = "inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold transition-colors";

function StudyAbroadPage() {
  const toc = STUDY_ABROAD_SECTIONS.map((section, index) => ({ id: sectionId(index), label: section.heading }));
  // Bài du học đã nhúng sẵn trong HTML → hiện ngay; sau đó gọi API ngầm lấy bản mới nhất
  const initialPosts = useInitialData(initialDataKeys.studyAbroadPosts);
  const [posts, setPosts] = useState(initialPosts ?? []);

  useEffect(() => {
    let alive = true;
    https
      .get("client/posts", { params: { category: "du học", page: 1, limit: 12 } })
      .then((res) => {
        if (alive && Array.isArray(res?.data)) setPosts(res.data);
      })
      .catch((err) => {
        // Lỗi mạng → giữ nguyên danh sách đã nhúng sẵn
        console.error("Error fetching study abroad posts:", err);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Seo meta={staticPageMeta(STUDY_ABROAD_PATH)} />
      <main className="bg-slate-50 min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 text-[14px] md:text-[15px] text-slate-700 leading-relaxed">
          <header>
            <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
              <Link to="/" className="hover:text-primary">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-slate-700">Du học</span>
            </nav>
            <h1 className="text-[26px] md:text-[32px] font-extrabold leading-tight text-slate-900">
              Du học và làm việc ở nước ngoài
            </h1>
            <p className="mt-3">{STUDY_ABROAD_LEAD}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/#register" className={`${BUTTON} bg-primary-dark text-white hover:bg-primary`}>
                Đăng ký tư vấn
              </Link>
              <a href={`tel:${appConfig.phoneE164}`} className={`${BUTTON} border border-primary-dark text-primary-dark hover:bg-blue-50`}>
                Gọi {appConfig.phone}
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

          <ContentSections sections={STUDY_ABROAD_SECTIONS} />

          {posts.length > 0 && (
            <section aria-labelledby="bai-du-hoc" className="mt-8">
              <h2 id="bai-du-hoc" className="text-[19px] md:text-[21px] font-bold text-primary-dark mb-3">
                Bài viết về du học
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {posts.map((post) => (
                  <li key={post.slug} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <Link
                      to={`/tin-tuc/${post.slug}`}
                      className="text-[15px] font-bold text-primary-dark hover:underline"
                    >
                      {post.title}
                    </Link>
                    {post.createdAt && (
                      <p className="mt-1 text-[12px] text-slate-500">{formatDateVi(post.createdAt)}</p>
                    )}
                    {post.summary && <p className="mt-1.5 text-[13px] text-slate-600">{post.summary}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="mt-8">
            Muốn học nghề trong nước trước khi đi, xem{" "}
            <Link to="/nganh-dao-tao" className="font-medium text-primary underline underline-offset-2">
              chương trình đào tạo
            </Link>{" "}
            và{" "}
            <Link to="/tuyen-sinh" className="font-medium text-primary underline underline-offset-2">
              thông tin tuyển sinh
            </Link>
            .
          </p>

          <ContactCard />
        </div>
      </main>
    </>
  );
}

export default StudyAbroadPage;
