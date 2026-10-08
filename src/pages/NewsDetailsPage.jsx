import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import https from "../utils/https";
import { Seo } from "../components/Seo";
import ContactCard from "../components/ContactCard";
import OtherPosts from "../components/OtherPosts";
import { prepareArticleContent } from "../utils/articleContent";
import { formatDateVi } from "../utils/formatDate";
import { isReservedSlug } from "../configs/navigation";
import { ALL_PROGRAMS, programHref } from "../content/programFields";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { newsPageMeta, notFoundPageMeta } from "../seo/pageMeta";
import { programDisplayName } from "../seo/programCopy";
import appConfig from "../configs/appConfig";

function NewsDetailsPage() {
  const { slug } = useParams();

  // Bài đã nhúng sẵn trong HTML tạo trước → hiện ngay, rồi gọi API ngầm lấy bản mới nhất
  const initialPost = useInitialData(initialDataKeys.post(slug));
  const isPostFromHtml = useRef(Boolean(initialPost));

  const [post, setPost] = useState(initialPost ?? null);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState("");
  // true khi API không có bản ghi → trang 404 (noindex); lỗi mạng thì không
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    // Lần đầu có bài nhúng sẵn → cập nhật ngầm: không hiện khung chờ, lỗi thì giữ bản đang hiện
    const isBackgroundRefresh = isPostFromHtml.current;
    isPostFromHtml.current = false;

    const fetchPost = async () => {
      try {
        if (!isBackgroundRefresh) {
          setLoading(true);
          setError("");
          setIsNotFound(false);
        }

        const res = await https.get(`/client/posts/${slug}`);
        const data =
          res?.data && !Array.isArray(res.data) ? res.data : res || null;

        if (!data || Array.isArray(data)) {
          if (isBackgroundRefresh) return;
          setError("Không tìm thấy bài viết.");
          setIsNotFound(true);
          setPost(null);
          return;
        }

        setPost(data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
        if (isBackgroundRefresh) return;
        // API trả HTTP 404 khi slug không tồn tại → trang 404 (noindex)
        const isMissing = err?.response?.status === 404;
        setIsNotFound(isMissing);
        setError(isMissing ? "Không tìm thấy bài viết." : "Không tải được bài viết. Vui lòng thử lại sau.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const hasPost = !!post;
  // Bỏ bản ghi "ngành" có slug trùng đường dẫn của mục trên site (dữ liệu CMS gõ nhầm) → tránh link gãy
  const relatedPrograms = (post?.programs ?? []).filter((program) => !isReservedSlug(program?.slug));
  // Đã nhúng sẵn trong HTML tạo trước → hiện ngay; chạy dev (không có HTML sẵn) thì gọi API
  const embeddedLatest = useInitialData(initialDataKeys.latestPosts(slug));
  const [latestPosts, setLatestPosts] = useState(embeddedLatest ?? []);

  useEffect(() => {
    if (embeddedLatest?.length) return undefined;
    let alive = true;
    https
      .get("client/posts", { params: { page: 1, limit: 6 } })
      .then((res) => {
        if (!alive || !Array.isArray(res?.data)) return;
        setLatestPosts(res.data.filter((item) => item.slug !== slug).slice(0, 5));
      })
      .catch(() => setLatestPosts([]));
    return () => {
      alive = false;
    };
  }, [slug, embeddedLatest]);
  // Ngành gợi ý ở cột phải: lấy từ danh mục (luôn có, không phụ thuộc dữ liệu bài)
  const suggestedPrograms = ALL_PROGRAMS.filter((program) => program.levelConfirmed).slice(0, 6);
  const articleContent = useMemo(
    () => prepareArticleContent(post?.content, post?.title),
    [post?.content, post?.title]
  );
  const publishedDate = formatDateVi(post?.createdAt);

  // Meta SEO dùng chung với HTML tạo sẵn (src/seo/pageMeta.ts)
  const seoMeta = hasPost
    ? newsPageMeta(post, slug)
    : isNotFound
    ? notFoundPageMeta()
    : null;

  return (
    <section className="py-6 md:py-10">
      <Seo meta={seoMeta} />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-4 text-[12px] text-slate-500">
          <div className="flex items-center flex-wrap gap-1">
            <Link to="/" className="hover:text-primary-dark transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/tin-tuc" className="hover:text-primary-dark transition">
              Tin tức
            </Link>
            {hasPost && (
              <>
                <span>/</span>
                <span className="text-slate-700 line-clamp-1">
                  {post.title}
                </span>
              </>
            )}
          </div>

          <Link
            to="/tin-tuc"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white text-primary-dark px-3 py-1 hover:border-primary-dark/60 text-[12px]"
          >
            ← Quay lại
          </Link>
        </div>

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)] gap-6 lg:gap-8 items-start">
          <div>
            {loading && (
              // Cùng khung với bài thật (H1 2 dòng, ảnh 3:2, thân bài) → không nhảy bố cục khi tải xong
              <div className="animate-pulse space-y-4 min-h-[100vh]" aria-hidden="true">
                <div>
                  <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
                  <div className="h-7 w-full bg-slate-200 rounded mb-2" />
                  <div className="h-7 w-2/3 bg-slate-200 rounded" />
                  <div className="h-3 w-48 bg-slate-200 rounded mt-2" />
                </div>
                <div className="w-full aspect-[3/2] max-h-[420px] bg-slate-200 rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 rounded w-4/6" />
                </div>
              </div>
            )}

            {!loading && hasPost && (
              <article className="space-y-4">
                <div>
                  {post.category && (
                    <p className="text-[12px] font-semibold uppercase text-primary-dark mb-1 tracking-wide">
                      {post.category}
                    </p>
                  )}
                  <h1 className="text-[22px] md:text-[26px] font-extrabold text-slate-900 leading-tight">
                    {post.title}
                  </h1>
                  {/* Người đăng + ngày đăng: khớp author/publisher, datePublished trong schema Article */}
                  <p className="text-[12px] text-slate-500 mt-1">
                    Đăng bởi <span className="font-semibold text-slate-700">{appConfig.legalName}</span>
                    {publishedDate && (
                      <>
                        {" · "}
                        <time dateTime={post.createdAt}>{publishedDate}</time>
                      </>
                    )}
                  </p>
                </div>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={post.image}
                      alt={post.title}
                      width="1200"
                      height="800"
                      fetchpriority="high"
                      className="w-full h-auto aspect-[3/2] max-h-[420px] object-cover"
                    />
                  </div>
                )}

                {post.summary && (
                  <p className="text-[14px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    {post.summary}
                  </p>
                )}

                {articleContent.html ? (
                  <>
                    {articleContent.headings.length > 0 && (
                      <nav
                        className="rounded-xl border border-blue-100 bg-blue-50/60 p-4"
                        aria-label="Mục lục bài viết"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h2 className="text-[15px] font-bold text-primary-dark">
                            Mục lục bài viết
                          </h2>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            {articleContent.headings.length} mục
                          </span>
                        </div>
                        <ol className="m-0 grid list-none gap-1 p-0 text-[13px]">
                          {articleContent.headings.map((heading, index) => (
                            <li
                              key={heading.id}
                              style={{
                                paddingLeft: `${Math.max(
                                  0,
                                  heading.level - 1
                                ) * 14}px`,
                              }}
                            >
                              <a
                                href={`#${heading.id}`}
                                className="flex gap-2 rounded-md px-2 py-1.5 text-slate-700 transition hover:bg-white hover:text-primary-dark"
                              >
                                <span className="shrink-0 font-semibold text-primary-dark">
                                  {index + 1}.
                                </span>
                                <span>{heading.text}</span>
                              </a>
                            </li>
                          ))}
                        </ol>
                      </nav>
                    )}

                    <div className="rich-text">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: articleContent.html,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-[13px] text-slate-500 border border-slate-200 rounded-xl p-4">
                    Nội dung bài viết đang được cập nhật.
                  </div>
                )}

                <ContactCard />

                <OtherPosts key={slug} slug={slug} />
              </article>
            )}
          </div>

          <aside className="space-y-4 self-start">
            {hasPost && relatedPrograms.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <h2 className="text-[14px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="inline-block h-4 w-1 rounded-full bg-primary-dark" />
                  <span>Chương trình liên quan</span>
                </h2>

                <div className="divide-y divide-slate-100 text-[13px]">
                  {relatedPrograms.map((program) => (
                    <Link
                      key={program.id || program.slug}
                      to={`/nganh-dao-tao/${program.slug}`}
                      className="flex items-center justify-between gap-2 py-2.5 hover:text-primary-dark hover:bg-slate-50/70 px-1 rounded-md transition"
                    >
                      <span className="line-clamp-2">{programDisplayName(program.title)}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">
                        Chi tiết
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {latestPosts.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-slate-900">
                  <span className="inline-block h-4 w-1 rounded-full bg-primary-dark" />
                  <span>Tin mới nhất</span>
                </h2>
                <ul className="divide-y divide-slate-100 text-[13px]">
                  {latestPosts.map((item) => (
                    <li key={item.slug} className="py-2 first:pt-0 last:pb-0">
                      <Link
                        to={`/tin-tuc/${item.slug}`}
                        className="font-medium text-slate-800 hover:text-primary-dark line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      {item.createdAt && (
                        <span className="mt-0.5 block text-[11px] text-slate-500">
                          {formatDateVi(item.createdAt)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <Link to="/tin-tuc" className="mt-3 inline-flex text-[12px] font-semibold text-primary hover:underline">
                  Xem tất cả tin tức →
                </Link>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-slate-900">
                <span className="inline-block h-4 w-1 rounded-full bg-primary-dark" />
                <span>Ngành đang tuyển sinh</span>
              </h2>
              <ul className="flex flex-wrap gap-1.5">
                {suggestedPrograms.map((program) => (
                  <li key={program.slug}>
                    <Link
                      to={programHref(program.slug)}
                      className="inline-flex rounded-full border border-slate-200 px-2.5 py-1 text-[12px] text-slate-700 hover:border-primary hover:text-primary-dark"
                    >
                      {programDisplayName(program.name, program.slug)}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/nganh-dao-tao"
                className="mt-3 inline-flex text-[12px] font-semibold text-primary hover:underline"
              >
                Xem tất cả ngành đào tạo →
              </Link>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-[13px] text-slate-700">
              <p className="font-semibold text-primary-dark mb-1">
                Bạn cần hỗ trợ?
              </p>
              <p className="mb-3">
                Liên hệ phòng tuyển sinh để nhận tư vấn chi tiết về chương trình
                phù hợp.
              </p>
              <Link
                to="/lien-he"
                className="inline-flex items-center justify-center w-full rounded-full bg-primary-dark text-white text-[13px] font-semibold px-4 py-2 hover:bg-primary-dark/90 transition"
              >
                Liên hệ ngay
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default NewsDetailsPage;
