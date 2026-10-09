import { Seo } from "../components/Seo";
import { newsListPageMeta, staticPageMeta } from "../seo/pageMeta";
import { programDisplayName } from "../seo/programCopy";
import { PROGRAM_FIELDS } from "../content/programFields";
import appConfig from "../configs/appConfig";
import { GUIDES, guidePath } from "../content/guides";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import https from "../utils/https";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { formatDateVi } from "../utils/formatDate";

const LIMIT = 10;
// Số bài ở cột "Mới cập nhật" cạnh bài nổi bật, và số bài cẩm nang ở sidebar
const LATEST_COUNT = 4;
const SIDEBAR_GUIDE_COUNT = 6;

function NewsPage() {

  // Trang 1 đã nhúng sẵn trong HTML tạo trước → hiện ngay, rồi gọi API ngầm lấy bản mới nhất
  const initialPage = useInitialData(initialDataKeys.firstPostsPage);
  const [posts, setPosts] = useState(initialPage?.data ?? []);
  const [loading, setLoading] = useState(!initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPage ? 1 < initialPage.meta.totalPages : true);

  // isBackgroundRefresh: đang hiện dữ liệu nhúng sẵn → không hiện khung chờ, lỗi thì giữ bản đang hiện
  const fetchPosts = async (targetPage = 1, append = false, isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        append ? setLoadingMore(true) : setLoading(true);
        if (!append) setError("");
      }

      const res = await https.get("/client/posts", {
        params: {
          page: targetPage,
          limit: LIMIT,
          noPaginate: false,
        },
      });

      const payload =
        res && typeof res === "object" && !Array.isArray(res)
          ? res
          : { data: res };

      const data = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(res)
        ? res
        : [];

      setPosts((prev) => {
        const combined = append ? [...prev, ...data] : data;
        // Remove duplicates based on slug/id while keeping original order
        const seen = new Set();
        const unique = [];
        for (const item of combined) {
          const key = item?.slug || item?.id;
          if (!key) {
            unique.push(item);
            continue;
          }
          if (seen.has(key)) continue;
          seen.add(key);
          unique.push(item);
        }
        return unique;
      });

      setPage(targetPage);
      const totalPages = payload?.meta?.totalPages ?? res?.meta?.totalPages;
      if (typeof totalPages === "number") {
        setHasMore(targetPage < totalPages);
      } else {
        setHasMore(data.length === LIMIT);
      }
    } catch (err) {
      console.error("Error fetching news list:", err);
      if (isBackgroundRefresh) return;
      setError("Không tải được danh sách tin tức. Vui lòng thử lại sau.");
      if (!append) setPosts([]);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, false, Boolean(initialPage));
  }, []);

  const featured = posts[0] || null;
  const latest = posts.slice(1, 1 + LATEST_COUNT);
  const gridPosts = posts.slice(1 + LATEST_COUNT);
  const seoMeta = posts.length ? newsListPageMeta(posts) : staticPageMeta("/tin-tuc");

  return (
    <>
      <Seo meta={seoMeta} />

      <section className="bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <header className="mb-6 max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-2">
              <Link to="/" className="hover:text-primary">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-slate-700">Tin tức</span>
            </nav>
            <h1 className="text-[28px] md:text-[34px] font-extrabold text-slate-900 leading-tight">
              Tin tuyển sinh trung cấp TPHCM
            </h1>
            <p className="text-[14px] text-slate-600 mt-2">
              Tin tuyển sinh trung cấp của Trường Trung cấp nghề Nhân Lực Quốc Tế TPHCM: thông báo tuyển sinh, lịch khai
              giảng từng đợt, hướng nghiệp và hoạt động học viên.
            </p>
          </header>

          {loading && <NewsSkeleton />}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-[14px] text-slate-600">
              Chưa có bài viết nào. Xem{" "}
              <Link to="/cam-nang" className={LINK}>
                cẩm nang tuyển sinh
              </Link>{" "}
              trong lúc chờ tin mới.
            </div>
          )}

          {!loading && !error && featured && (
            <>
              {/* Hàng đầu: bài nổi bật + mới cập nhật → không còn khoảng trống bên phải */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <FeaturedPost post={featured} />
                <div className="flex flex-col gap-6">
                  {latest.length > 0 && (
                    <section aria-labelledby="news-latest" className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                      <h2 id="news-latest" className="text-[16px] font-bold text-slate-900 mb-1">
                        Mới cập nhật
                      </h2>
                      <ul className="divide-y divide-slate-100">
                        {latest.map((post) => (
                          <li key={post.id || post.slug}>
                            <Link to={`/tin-tuc/${post.slug}`} className="group flex gap-3 py-3.5 focus-visible:outline-2 focus-visible:outline-primary">
                              {post.image && (
                                <img
                                  src={post.image}
                                  alt=""
                                  width="96"
                                  height="64"
                                  loading="lazy"
                                  decoding="async"
                                  className="h-16 w-24 shrink-0 rounded-xl object-cover"
                                />
                              )}
                              <div className="min-w-0">
                                <h3 className="text-[14px] font-semibold leading-snug text-slate-900 line-clamp-3 group-hover:text-primary-dark">
                                  {post.title}
                                </h3>
                                <PostDate value={post.createdAt} className="mt-1 block text-[12px] text-slate-500" />
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  <ConsultCard />
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
                <div>
                  {gridPosts.length > 0 && (
                    <section aria-labelledby="news-all">
                      <h2 id="news-all" className="text-[20px] font-bold text-slate-900 mb-4">
                        Tất cả bài viết
                      </h2>
                      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {gridPosts.map((post) => (
                          <li key={post.id || post.slug}>
                            <PostCard post={post} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {hasMore && (
                    <div className="flex justify-center pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          if (loadingMore) return;
                          fetchPosts(page + 1, true);
                        }}
                        disabled={loadingMore}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 bg-white text-[13px] font-semibold text-slate-700 hover:border-primary-dark hover:text-primary-dark transition disabled:cursor-wait disabled:opacity-60"
                      >
                        {loadingMore ? "Đang tải..." : "Xem thêm bài viết"}
                      </button>
                    </div>
                  )}
                </div>

                <NewsSidebar />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

const LINK = "text-primary font-medium underline underline-offset-2";

function PostDate({ value, className }) {
  if (!value) return null;
  return (
    <time dateTime={value} className={className}>
      {formatDateVi(value)}
    </time>
  );
}

/** Ngành liên quan (dữ liệu thật của bài) thay cho nhãn "Tin tức" gắn cứng */
function ProgramTag({ post }) {
  const program = post.programs?.find((item) => item?.title);
  if (!program) return null;
  return (
    <span className="inline-block max-w-full truncate align-top rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary-dark">
      {programDisplayName(program.title, program.slug)}
    </span>
  );
}

function FeaturedPost({ post }) {
  return (
    <Link
      to={`/tin-tuc/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-primary"
    >
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          width="1200"
          height="675"
          fetchpriority="high"
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 font-bold text-orange-700">Mới nhất</span>
          <ProgramTag post={post} />
          <PostDate value={post.createdAt} className="text-slate-500" />
        </div>
        <h2 className="text-[20px] md:text-[24px] font-bold leading-snug text-slate-900 group-hover:text-primary-dark">
          {post.title}
        </h2>
        {post.summary && <p className="text-[14px] text-slate-600 line-clamp-3">{post.summary}</p>}
        <span className="mt-auto text-[13px] font-semibold text-primary">Đọc bài →</span>
      </div>
    </Link>
  );
}

function PostCard({ post }) {
  return (
    <Link
      to={`/tin-tuc/${post.slug}`}
      className="group flex h-full gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary sm:flex-col sm:gap-0 sm:p-0"
    >
      {/* Mobile: ảnh nhỏ bên trái cho gọn; từ sm: ảnh 16:9 phía trên */}
      {post.image && (
        <img
          src={post.image}
          alt=""
          width="600"
          height="338"
          loading="lazy"
          decoding="async"
          className="h-20 w-28 shrink-0 rounded-xl object-cover sm:h-auto sm:w-full sm:rounded-none sm:aspect-[16/9]"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <ProgramTag post={post} />
          <PostDate value={post.createdAt} className="text-slate-500" />
        </div>
        <h3 className="text-[15px] sm:text-[16px] font-bold leading-snug text-slate-900 line-clamp-3 group-hover:text-primary-dark">
          {post.title}
        </h3>
        {post.summary && <p className="hidden text-[13px] text-slate-600 line-clamp-2 sm:block">{post.summary}</p>}
      </div>
    </Link>
  );
}

function ConsultCard() {
  return (
    <section aria-labelledby="news-cta" className="rounded-2xl bg-gradient-to-br from-primary-dark to-primary p-5 text-white shadow-md">
      <h2 id="news-cta" className="text-[17px] font-bold">
        Tư vấn tuyển sinh miễn phí
      </h2>
      <p className="mt-1 text-[13px] text-blue-100">
        Hỏi về ngành học, lịch khai giảng, học phí.
      </p>
      <div className="mt-4 grid gap-2">
        <Link
          to="/#register"
          className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-primary-dark hover:bg-blue-50"
        >
          Đăng ký tư vấn
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${appConfig.phoneE164}`}
            className="inline-flex items-center justify-center rounded-full border border-white/60 px-3 py-2 text-[13px] font-semibold hover:bg-white/10"
          >
            {appConfig.phone}
          </a>
          <a
            href={appConfig.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/60 px-3 py-2 text-[13px] font-semibold hover:bg-white/10"
          >
            Nhắn Zalo
          </a>
        </div>
      </div>
    </section>
  );
}

function NewsSidebar() {
  return (
    <aside className="space-y-5 self-start" aria-label="Thông tin tuyển sinh">

      <section aria-labelledby="news-guides" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 id="news-guides" className="text-[16px] font-bold text-slate-900 mb-2">
          Cẩm nang tuyển sinh
        </h2>
        <ul className="divide-y divide-slate-100">
          {GUIDES.slice(0, SIDEBAR_GUIDE_COUNT).map((guide) => (
            <li key={guide.slug}>
              <Link to={guidePath(guide.slug)} className="block py-2.5 text-[14px] leading-snug text-slate-800 hover:text-primary-dark">
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/cam-nang" className="mt-2 inline-flex text-[13px] font-semibold text-primary hover:underline">
          Xem tất cả cẩm nang →
        </Link>
      </section>

      <section aria-labelledby="news-fields" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 id="news-fields" className="text-[16px] font-bold text-slate-900 mb-3">
          Lĩnh vực đào tạo
        </h2>
        <ul className="flex flex-wrap gap-2">
          {PROGRAM_FIELDS.map((field) => (
            <li key={field.id}>
              <Link
                to={`/nganh-dao-tao#${field.anchor}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[13px] text-slate-700 hover:border-primary/40 hover:text-primary-dark"
              >
                <span aria-hidden="true">{field.icon}</span>
                {field.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function NewsSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden">
          <div className="aspect-[16/9] w-full bg-slate-200" />
          <div className="space-y-3 p-6">
            <div className="h-6 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-5/6 rounded bg-slate-200" />
          </div>
        </div>
        <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-4">
          {Array.from({ length: LATEST_COUNT }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="h-16 w-24 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded bg-slate-200" />
                <div className="h-3 w-2/3 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:w-2/3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl bg-white border border-slate-100 overflow-hidden">
            <div className="aspect-[16/9] w-full bg-slate-200" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-4/5 rounded bg-slate-200" />
              <div className="h-3 w-2/3 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsPage;
