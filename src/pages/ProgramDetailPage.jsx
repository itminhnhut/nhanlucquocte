import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import https from "../utils/https";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { useIsHydrated } from "../hooks/useIsHydrated";
import { Seo } from "../components/Seo";
import {
  addImageDimensions,
  demoteH1,
  dropEmptyHeadings,
  dropEmptyWrappers,
  dropForeignImages,
  fillMissingImageAlt,
  normalizeHeadingLevels,
  lazyLoadImages,
} from "../utils/html";
import { extractFaqSection, renderFaqAccordion } from "../seo/faq";
import FaqAccordion from "../components/FaqAccordion";
import ContactCard from "../components/ContactCard";
import appConfig from "../configs/appConfig";
import { trackEvent } from "../utils/analytics";
import ProgramExtras from "../components/ProgramExtras";
import { stripContactBlock } from "../utils/contactBlock";
import { programFaqGroupBySlug } from "../content/programFaqs";
import { LEVEL_LABEL, PROGRAM_FIELDS, PROGRAM_NAMES, publishedLevel } from "../content/programFields";
import { alternateProgramSlug } from "../configs/programSlugAliases";
import { notFoundPageMeta, programPageMeta } from "../seo/pageMeta";
import {
  programDisplayName,
  programHeading,
  programLead,
  upcomingOpeningDate,
} from "../seo/programCopy";


const BRAND_NAME = `${appConfig.legalName} TPHCM`;
function ProgramDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  // Đã chuyển từ slug cũ/mới 1 lần → không chuyển tiếp (tránh lặp khi cả 2 slug đều 404)
  const isFromAlias = Boolean(useLocation().state?.fromSlugAlias);

  // Ngành + tin liên quan đã nhúng sẵn trong HTML tạo trước → hiện ngay, rồi gọi API ngầm lấy bản mới nhất
  // (lần gọi đầu là "cập nhật ngầm": không hiện khung chờ, lỗi thì giữ bản đang hiện)
  const initialProgram = useInitialData(initialDataKeys.program(slug));
  const initialRelatedPosts = useInitialData(initialDataKeys.relatedPosts(slug));
  const isProgramFromHtml = useRef(Boolean(initialProgram));
  const areRelatedFromHtml = useRef(Boolean(initialRelatedPosts));

  const [program, setProgram] = useState(initialProgram ?? null);
  const [loadingProgram, setLoadingProgram] = useState(!initialProgram);
  const [error, setError] = useState("");
  // true khi API không có bản ghi → trang 404 (noindex); lỗi mạng thì không
  const [isNotFound, setIsNotFound] = useState(false);

  const [relatedPosts, setRelatedPosts] = useState(initialRelatedPosts ?? []);
  const [loadingPosts, setLoadingPosts] = useState(!initialRelatedPosts);

  useEffect(() => {
    if (!slug) return;
    const isBackgroundRefresh = isProgramFromHtml.current;
    isProgramFromHtml.current = false;

    const fetchProgram = async () => {
      try {
        if (!isBackgroundRefresh) {
          setLoadingProgram(true);
          setError("");
          setIsNotFound(false);
        }

        const res = await https.get(`/client/programs/${slug}`);
        const payload =
          res?.data && !Array.isArray(res.data) ? res.data : res || null;

        if (!payload || Array.isArray(payload)) {
          if (isBackgroundRefresh) return;
          setError("Không tìm thấy thông tin chương trình đào tạo.");
          setIsNotFound(true);
          setProgram(null);
          return;
        }

        setProgram(payload);
      } catch (err) {
        console.error("Error fetching program detail:", err);
        if (isBackgroundRefresh) return;
        // API trả HTTP 404 khi slug không tồn tại → trang 404 (noindex)
        const isMissing = err?.response?.status === 404;
        // Slug cũ/mới của ngành đổi slug (lỗi chữ "đ" ở admin) → chuyển sang slug còn lại
        const alternateSlug = isMissing && !isFromAlias ? alternateProgramSlug(slug) : null;
        if (alternateSlug) {
          navigate(`/nganh-dao-tao/${alternateSlug}`, { replace: true, state: { fromSlugAlias: true } });
          return;
        }
        setIsNotFound(isMissing);
        setError(
          isMissing
            ? "Không tìm thấy thông tin chương trình đào tạo."
            : "Không tải được thông tin chương trình. Vui lòng thử lại sau hoặc liên hệ nhà trường."
        );
        setProgram(null);
      } finally {
        setLoadingProgram(false);
      }
    };

    fetchProgram();
  }, [slug]);

  // Lấy tin tức liên quan theo program.slug
  useEffect(() => {
    const targetSlug = program?.slug || slug;
    if (!targetSlug) return;
    const isBackgroundRefresh = areRelatedFromHtml.current;
    areRelatedFromHtml.current = false;

    const fetchRelatedPosts = async () => {
      try {
        if (!isBackgroundRefresh) setLoadingPosts(true);
        const res = await https.get("/client/posts", {
          params: {
            noPaginate: false,
            programSlug: targetSlug,
            page: 1,
            limit: 10,
          },
        });

        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        setRelatedPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching related posts:", err);
        if (isBackgroundRefresh) return;
        setRelatedPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchRelatedPosts();
    // Theo slug (không theo object program) → cập nhật ngầm ngành không gọi lại tin liên quan
  }, [program?.slug, slug]);

  const hasProgram = !!program;
  // Nội dung CMS: hạ h1 → h2, mục "Câu hỏi thường gặp" → dạng bấm-để-mở
  const contentHtml = useMemo(() => {
    // Gỡ khối liên hệ của bài gốc → hạ h1 → bỏ ảnh mượn của site khác → bỏ heading rỗng →
    // mục "Câu hỏi thường gặp" thành dạng bấm-để-mở → ảnh tải trễ, có alt và có kích thước
    const base = normalizeHeadingLevels(
      dropEmptyWrappers(dropEmptyHeadings(dropForeignImages(demoteH1(stripContactBlock(program?.content)))))
    );
    const withAlt = fillMissingImageAlt(lazyLoadImages(renderFaqAccordion(base)), program?.title);
    return addImageDimensions(withAlt);
  }, [program?.content, program?.title]);
  // Chưa có mục FAQ trong nội dung CMS → hiện câu hỏi soạn sẵn cho ngành (src/content/programFaqs.ts)
  const presetFaqGroup = useMemo(
    () => (extractFaqSection(demoteH1(stripContactBlock(program?.content))) ? null : programFaqGroupBySlug(slug)),
    [program?.content, slug]
  );

  // Meta SEO dùng chung với HTML tạo sẵn (src/seo/pageMeta.ts)
  const seoMeta = hasProgram
    ? programPageMeta(program, slug)
    : isNotFound
    ? notFoundPageMeta()
    : null;

  // Đoạn mở đầu có từ khoá (cùng nội dung meta description); `description` từ API chỉ là
  // "KHAI GIẢNG NGÀY …" → hiện riêng thành nhãn, và chỉ khi ngày chưa qua
  const heading = hasProgram ? programHeading(program.title, slug) : "";
  const leadText = hasProgram ? programLead(slug, program) : "";
  // Lần render đầu dùng đúng thời điểm server đã render → nhãn khai giảng khớp HTML tạo sẵn
  const renderedAt = useInitialData(initialDataKeys.renderedAt);
  const isHydrated = useIsHydrated();
  const now = !isHydrated && renderedAt ? new Date(renderedAt) : new Date();

  // Mốc đầu của phễu tuyển sinh: người dùng đã xem một ngành cụ thể
  useEffect(() => {
    if (!program) return;
    trackEvent("view_program", { program_slug: slug, program_name: PROGRAM_NAMES[slug] ?? slug });
  }, [program, slug]);

  // Thông tin nhanh: chỉ những gì kiểm chứng được từ danh mục ngành + cấu hình trường
  const quickFacts = useMemo(() => {
    const field = PROGRAM_FIELDS.find((item) => item.programs.some((entry) => entry.slug === slug));
    const level = publishedLevel(slug);
    const openingDate = program ? upcomingOpeningDate(program, now) : null;
    return [
      field && { label: "Lĩnh vực", value: field.name },
      level && { label: "Hệ đào tạo", value: LEVEL_LABEL[level] },
      openingDate && { label: "Khai giảng", value: openingDate },
      // Trường không công bố hình thức tuyển sinh cho hệ trung cấp, sơ cấp (và trang liên thông
      // của trường còn nêu khả năng phải thi môn cơ sở ngành) → chỉ nêu đối tượng đã công bố
      { label: "Đối tượng", value: "Tốt nghiệp THCS, THPT trở lên" },
      { label: "Địa điểm học", value: appConfig.address },
      { label: "Hotline", value: appConfig.phone },
    ].filter(Boolean);
  }, [slug, program, now]);

  const openingDate = hasProgram ? upcomingOpeningDate(program, now) : null;

  return (
    <section className="py-6 md:py-8">
      <Seo meta={seoMeta} />
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb + Back link */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="text-[12px] text-slate-500">
            <Link to="/" className="hover:text-primary-dark transition-colors">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link
              to="/nganh-dao-tao"
              className="hover:text-primary-dark transition-colors"
            >
              Chương trình đào tạo
            </Link>
            {hasProgram && (
              <>
                <span className="mx-1.5">/</span>
                <span className="text-slate-700 line-clamp-1">
                  {programDisplayName(program.title, program.slug)}
                </span>
              </>
            )}
          </div>

          <Link
            to="/nganh-dao-tao"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white text-primary-dark text-[12px] px-3 py-1 hover:border-primary-dark/60 hover:shadow-sm transition"
          >
            ← Quay lại danh sách
          </Link>
        </div>

        {/* Error state */}
        {error && !loadingProgram && (
          <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(260px,1.4fr)] gap-6 lg:gap-8 items-start">
          {/* LEFT – DETAIL */}
          <div>
            {/* Loading skeleton */}
            {loadingProgram && (
              // Cùng khung với nội dung thật (nhãn, H1, chip, ảnh 3:2) → không nhảy bố cục khi tải xong
              <div className="animate-pulse space-y-4 min-h-[100vh]" aria-hidden="true">
                <div className="mb-4">
                  <div className="h-3 w-40 bg-slate-200 rounded mb-2" />
                  <div className="h-7 w-3/4 bg-slate-200 rounded-lg mb-2" />
                  <div className="h-6 w-56 bg-slate-200 rounded-full" />
                </div>
                <div className="w-full aspect-[3/2] max-h-[320px] md:max-h-[380px] bg-slate-200 rounded-2xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-3 bg-slate-200 rounded" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 rounded w-4/6" />
                </div>
              </div>
            )}

            {/* Actual data */}
            {!loadingProgram && hasProgram && (
              <>
                {/* Title + meta */}
                <div className="mb-4">
                  {/* Tên trường ngay trên H1: rõ đây là ngành của Trường Trung cấp nghề Nhân Lực Quốc Tế */}
                  <p className="text-[13px] font-semibold text-primary-dark uppercase tracking-wide mb-1">
                    {BRAND_NAME} · Chương trình đào tạo
                  </p>
                  <h1 className="text-[20px] md:text-[24px] font-extrabold text-slate-900 leading-snug mb-2">
                    {heading}
                  </h1>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                    {openingDate && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                        Khai giảng: {openingDate}
                      </span>
                    )}
                    {program.level && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {program.level}
                      </span>
                    )}
                    {program.category && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                        {program.category}
                      </span>
                    )}
                    {program.duration && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Thời gian: {program.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hero image */}
                {program.image && (
                  <div className="mb-5">
                    <img
                      src={program.image}
                      alt={heading}
                      width="1200"
                      height="800"
                      fetchpriority="high"
                      className="w-full h-auto aspect-[3/2] max-h-[320px] md:max-h-[380px] object-cover rounded-2xl shadow-[0_15px_40px_rgba(15,23,42,0.3)]"
                    />
                  </div>
                )}

                {/* Short description */}
                <p className="text-[13px] md:text-[14px] text-slate-700 mb-4">
                  {leadText}
                </p>

                {/* Body content – nếu BE trả content dạng HTML */}
                {program.content ? (
                  <div className="rich-text">
                    <div
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[13px] text-slate-600">
                    Nội dung chi tiết chương trình đang được cập nhật. Vui lòng
                    liên hệ phòng tuyển sinh để được tư vấn cụ thể hơn về lộ
                    trình học, học phí và cơ hội việc làm sau tốt nghiệp.
                  </div>
                )}

                {presetFaqGroup && (
                  <section className="mt-8">
                    <h2 className="text-[18px] md:text-[20px] font-bold text-primary-dark mb-3">
                      Câu hỏi thường gặp về ngành {presetFaqGroup.name}
                    </h2>
                    <FaqAccordion faqs={presetFaqGroup.faqs} questionTag="h3" />
                    <p className="mt-3 text-[13px] text-slate-600">
                      Xem thêm{" "}
                      <Link to="/cau-hoi-thuong-gap" className="text-primary underline underline-offset-2">
                        câu hỏi thường gặp về tuyển sinh, bằng cấp, học phí
                      </Link>
                      .
                    </p>
                  </section>
                )}

                <ProgramExtras slug={slug} />

                <ContactCard programName={programDisplayName(program.title, program.slug)} />
              </>
            )}
          </div>

          {/* RIGHT – SIDE INFO + RELATED NEWS */}
          <aside className="space-y-6 self-start">
            {/* Box thông tin nhanh */}
            {hasProgram && !loadingProgram && (
              <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4 md:p-5">
                <h2 className="text-[15px] font-bold text-primary-dark mb-3 flex items-center gap-2">
                  <span className="inline-block h-4 w-1 rounded-full bg-primary-dark" />
                  <span>Thông tin nhanh</span>
                </h2>
                {/* Dùng dữ liệu có thật: API ngành chỉ trả id/title/slug/image/description/content.
                    Hệ đào tạo chỉ nêu khi trường đã công bố rõ (publishedLevel). */}
                <ul className="space-y-2.5 text-[13px] text-slate-700">
                  {quickFacts.map((fact) => (
                    <li key={fact.label} className="flex justify-between gap-3">
                      <span className="shrink-0 text-slate-500">{fact.label}:</span>
                      <span className="text-right font-semibold">{fact.value}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/#register"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary-dark text-white text-[13px] font-semibold px-4 py-2.5 hover:bg-primary-dark/90 shadow-sm hover:shadow-md transition"
                >
                  Đăng ký tư vấn ngay
                </Link>
              </div>
            )}

            {/* RELATED NEWS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                  <span className="inline-block h-4 w-1 rounded-full bg-primary-dark" />
                  <span>Tin tức liên quan</span>
                </h2>
                {!loadingPosts && relatedPosts.length > 0 && (
                  <span className="text-[11px] text-slate-500">
                    {relatedPosts.length} bài viết
                  </span>
                )}
              </div>

              {/* Loading skeleton for posts */}
              {loadingPosts && (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="w-20 h-16 bg-slate-200 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-5/6" />
                        <div className="h-3 bg-slate-200 rounded w-4/6" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingPosts && relatedPosts.length === 0 && (
                <p className="text-[12px] text-slate-500 italic">
                  Chưa có bài viết liên quan cho chương trình này.
                </p>
              )}

              {!loadingPosts && relatedPosts.length > 0 && (
                <div className="space-y-3">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/tin-tuc/${post.slug}`}
                      className="group flex gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      {post.image && (
                        <div className="w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            width="80"
                            height="64"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 group-hover:text-primary-dark line-clamp-2">
                          {post.title}
                        </p>
                        {post.summary && (
                          <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">
                            {post.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ProgramDetailPage;
