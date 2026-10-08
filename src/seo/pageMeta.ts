// Meta + JSON-LD cho từng loại trang. Hàm thuần (không DOM) để dùng được
// cả trong React lẫn server tạo HTML sẵn (scripts/seo/pages.js).
import appConfig from "../configs/appConfig";
import { DISABLED_PATHS } from "../configs/navigation";
import { HERO_IMAGE, HERO_IMAGE_MOBILE } from "../configs/heroImage";
import { BRAND_SUFFIX, MAX_TITLE_LENGTH, getSeoConfig, withBrandFit } from "../configs/seo.config";
import { parseProgramName, programDisplayName, programSeoCopy, upcomingOpeningDate } from "./programCopy";
import { publishedLevel } from "../content/programFields";
import { extractFaqSection, faqSchema } from "./faq";
import { SITE_FAQS, answerText } from "../content/faqs";
import { programFaqGroupBySlug } from "../content/programFaqs";
import { GUIDES, GUIDES_PATH, type Guide, guideBySlug, guidePath } from "../content/guides";
import { STUDY_ABROAD_PATH } from "../content/studyAbroad";
import { FEES_PATH } from "../content/fees";
import { PARTNERSHIP_PATH } from "../content/partnership";
import { ACTIVITIES_PATH } from "../content/activities";
import { GALLERY_PATH } from "../content/gallery";
import { ADMISSIONS_PATH } from "../content/admissions";
import { demoteH1 } from "../utils/html";
import { stripContactBlock } from "../utils/contactBlock";
import {
  articleSchema,
  breadcrumbSchema,
  courseListSchema,
  courseSchema,
  linkListSchema,
  programSchema,
  organizationSchema,
  staticPageNodes,
  toGraph,
  websiteSchema,
} from "./schema";
import { absoluteUrl, isSafeSlug } from "./url";

export type OgType = "website" | "article";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  ogType: OgType;
  publishedTime?: string;
  modifiedTime?: string;
  isIndexable: boolean;
  jsonLd: unknown[];
  /** Ảnh LCP cần tải sớm — chỉ render trong HTML tạo sẵn */
  preloadImage?: PreloadImage | PreloadImage[];
}

export interface PreloadImage {
  href: string;
  srcSet: string;
  sizes: string;
  /** Khớp với thuộc tính media của <source> tương ứng, để mỗi màn hình chỉ tải 1 ảnh */
  media?: string;
}

/** Item từ API client/programs, client/posts */
export interface ContentItem {
  id?: string | number;
  slug?: string;
  title?: string;
  summary?: string;
  description?: string;
  metaDescription?: string;
  content?: string;
  image?: string | null;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  modifiedAt?: string;
}

/** Trang tĩnh có route thật trong src/router.jsx */
export const STATIC_PATHS = [
  "/",
  "/gioi-thieu",
  "/nganh-dao-tao",
  STUDY_ABROAD_PATH,
  ADMISSIONS_PATH,
  FEES_PATH,
  PARTNERSHIP_PATH,
  ACTIVITIES_PATH,
  GALLERY_PATH,
  "/tra-cuu-van-bang",
  "/tin-tuc",
  "/lien-he",
  "/cau-hoi-thuong-gap",
  GUIDES_PATH,
  ...GUIDES.map((guide) => guidePath(guide.slug)),
  "/cong-khai",
  "/chinh-sach-bao-mat",
  "/tim-kiem",
];

export const FAQ_PAGE_PATH = "/cau-hoi-thuong-gap";

function toFaqItems(faqs: readonly { question: string; answer: string }[] = []) {
  return faqs.map((faq) => ({ question: faq.question, answerHtml: "", answerText: answerText(faq.answer) }));
}

// Trang hỏi đáp: node trang là FAQPage kèm câu hỏi chung (câu hỏi theo ngành đã đánh dấu ở trang ngành)
function staticPageExtra(path: string): Record<string, unknown> {
  if (path !== FAQ_PAGE_PATH) return {};
  return { mainEntity: faqSchema(toFaqItems(SITE_FAQS)).mainEntity };
}

// Trang tìm kiếm + các trang chưa mở (ngành đào tạo, tin tức — chờ dữ liệu của trường)
const NOINDEX_PATHS = new Set(["/tim-kiem", ...DISABLED_PATHS]);

/** Mục chưa mở (chưa có dữ liệu của trường) → trang chi tiết trong mục đó cũng không cho index */
export function isSectionIndexable(sectionPath: string): boolean {
  return !NOINDEX_PATHS.has(sectionPath);
}

const DEFAULT_IMAGE = {
  image: absoluteUrl(appConfig.defaultOgImage),
  imageWidth: appConfig.defaultOgImageWidth,
  imageHeight: appConfig.defaultOgImageHeight,
};

/** Ảnh riêng của bài/ngành (không rõ kích thước) hoặc ảnh mặc định có kích thước */
function pageImage(image: unknown): Pick<PageMeta, "image" | "imageWidth" | "imageHeight"> {
  const url = absoluteUrl(image);
  return url && url !== DEFAULT_IMAGE.image ? { image: url } : DEFAULT_IMAGE;
}

export function stripHtml(html: unknown): string {
  if (typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Slug dùng trong URL; null nếu thiếu hoặc không an toàn */
export function itemSlug(item: ContentItem): string | null {
  const slug = String(item?.slug || item?.id || "").trim();
  return slug && isSafeSlug(slug) ? slug : null;
}

const MAX_DESCRIPTION_LENGTH = 155;

/** Cắt mô tả ≤ maxLength ở ranh giới từ, thêm "…" nếu bị cắt */
export function truncateAtWord(text: string, maxLength = MAX_DESCRIPTION_LENGTH): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/u, "")}…`;
}

function firstText(...values: unknown[]): string {
  for (const value of values) {
    const text = stripHtml(value);
    if (text) return text;
  }
  return "";
}

function toIsoDate(value: unknown): string | undefined {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Bài cẩm nang: Article + breadcrumb Cẩm nang → bài */
export function guidePageMeta(guide: Guide): PageMeta {
  const path = guidePath(guide.slug);
  const publishedIso = toIsoDate(guide.datePublished);
  const modifiedIso = toIsoDate(guide.dateModified) || publishedIso;
  const nodes = [
    organizationSchema(),
    websiteSchema(),
    articleSchema({
      path,
      headline: guide.title,
      description: guide.description,
      image: DEFAULT_IMAGE.image,
      datePublished: publishedIso,
      dateModified: modifiedIso,
    }),
    breadcrumbSchema([
      { name: "Cẩm nang tuyển sinh", path: GUIDES_PATH },
      { name: guide.title, path },
    ]),
  ];
  return {
    path,
    title: guide.metaTitle,
    description: guide.description,
    ...DEFAULT_IMAGE,
    ogType: "article",
    publishedTime: publishedIso,
    modifiedTime: modifiedIso,
    isIndexable: isSectionIndexable("/tin-tuc"),
    jsonLd: [toGraph(nodes)],
  };
}

export function staticPageMeta(path: string): PageMeta | null {
  if (path.startsWith(`${GUIDES_PATH}/`)) {
    const guide = guideBySlug(path.slice(GUIDES_PATH.length + 1));
    return guide ? guidePageMeta(guide) : null;
  }
  const seo = getSeoConfig(path);
  if (!seo) return null;
  return {
    path,
    title: seo.title,
    description: seo.description,
    ...pageImage(seo.ogImage),
    ogType: "website",
    isIndexable: !NOINDEX_PATHS.has(path),
    // 2 thẻ preload khớp đúng 2 <source> của banner: điện thoại tải bản dọc, máy tính tải bản ngang
    ...(path === "/"
      ? {
          preloadImage: [
            { href: HERO_IMAGE_MOBILE.src, srcSet: HERO_IMAGE_MOBILE.srcSet, sizes: HERO_IMAGE_MOBILE.sizes, media: "(max-width: 639px)" },
            { href: HERO_IMAGE.src, srcSet: HERO_IMAGE.srcSet, sizes: HERO_IMAGE.sizes, media: "(min-width: 640px)" },
          ],
        }
      : {}),
    jsonLd: [toGraph(staticPageNodes(path, seo.title, seo.description, staticPageExtra(path)))],
  };
}

/** /programs khi đã có danh sách ngành: thêm ItemList các Course (Google "Course list") */
export function programsListPageMeta(programs: ContentItem[]): PageMeta | null {
  const base = staticPageMeta("/nganh-dao-tao");
  if (!base) return null;
  const courses = programs.flatMap((program) => {
    const slug = itemSlug(program);
    if (!slug) return [];
    const { description } = programSeoCopy(slug, program);
    return [{ name: programDisplayName(program.title, slug), description, path: `/nganh-dao-tao/${slug}` }];
  });
  if (!courses.length) return base;
  const nodes = [...staticPageNodes("/nganh-dao-tao", base.title, base.description), courseListSchema(courses)];
  return { ...base, jsonLd: [toGraph(nodes)] };
}

/** /news khi đã có danh sách bài (trang 1): thêm ItemList các bài đang hiện */
export function newsListPageMeta(posts: ContentItem[]): PageMeta | null {
  const base = staticPageMeta("/tin-tuc");
  if (!base) return null;
  const links = posts.flatMap((post) => {
    const slug = itemSlug(post);
    const name = String(post.title ?? "").trim();
    return slug && name ? [{ name, path: `/tin-tuc/${slug}` }] : [];
  });
  if (!links.length) return base;
  const nodes = [...staticPageNodes("/tin-tuc", base.title, base.description), linkListSchema(links)];
  return { ...base, jsonLd: [toGraph(nodes)] };
}

export function programPageMeta(program: ContentItem, slug: string): PageMeta {
  const path = `/nganh-dao-tao/${slug}`;
  const { title, description } = programSeoCopy(slug, program);
  const images = pageImage(program.image);
  const name = programDisplayName(program.title, slug);
  // Hệ đào tạo chỉ khai khi trường đã công bố rõ — không suy từ ngữ pháp tiêu đề bài
  const level = publishedLevel(slug);
  const credentialByLevel = {
    "trung-cap": { programType: "Trung cấp", credential: "Bằng tốt nghiệp trung cấp" },
    "so-cap": { programType: "Sơ cấp, ngắn hạn", credential: "Chứng chỉ" },
    "lien-thong": { programType: "Liên thông đại học", credential: "" },
  } as const;
  const openingDate = upcomingOpeningDate(program);
  const nodes = [
    organizationSchema(),
    websiteSchema(),
    programSchema(
      {
        name,
        description,
        path,
        programType: level ? credentialByLevel[level].programType : "",
        credential: level ? credentialByLevel[level].credential : "",
        startDate: openingDate?.split(".").reverse().join("-"),
      },
      images.image
    ),
    breadcrumbSchema([
      { name: "Ngành đào tạo", path: "/nganh-dao-tao" },
      { name, path },
    ]),
  ];
  // FAQPage: mục "Câu hỏi thường gặp" trong nội dung CMS, không có thì dùng FAQ soạn sẵn theo ngành
  const faqItems = extractFaqSection(demoteH1(stripContactBlock(program.content)))?.items ?? toFaqItems(programFaqGroupBySlug(slug)?.faqs);
  if (faqItems.some((item) => item.answerText)) nodes.push(faqSchema(faqItems));
  return {
    path,
    title,
    description,
    ...images,
    ogType: "website",
    isIndexable: isSectionIndexable("/nganh-dao-tao"),
    jsonLd: [toGraph(nodes)],
  };
}

export function newsPageMeta(post: ContentItem, slug: string): PageMeta {
  const path = `/tin-tuc/${slug}`;
  const description = truncateAtWord(
    firstText(post.metaDescription, post.summary, post.description, post.content) ||
      "Tin tức, sự kiện và hoạt động mới nhất tại Trường Trung cấp nghề Nhân Lực Quốc Tế TPHCM."
  );
  const images = pageImage(post.image);
  const publishedIso = toIsoDate(post.createdAt);
  const modifiedIso = toIsoDate(post.updatedAt || post.modifiedAt) || publishedIso;
  const headline = String(post.title ?? "").trim();
  const nodes = [
    organizationSchema(),
    websiteSchema(),
    articleSchema({
      path,
      headline,
      description,
      image: images.image,
      datePublished: publishedIso,
      dateModified: modifiedIso,
    }),
    breadcrumbSchema([
      { name: "Tin tức", path: "/tin-tuc" },
      { name: headline, path },
    ]),
  ];
  // Tiêu đề bài CMS có thể rất dài → cắt cho thẻ <title>, H1 và og:title vẫn giữ đủ
  const metaTitle = withBrandFit(headline);
  return {
    path,
    title: metaTitle.length <= MAX_TITLE_LENGTH ? metaTitle : truncateAtWord(headline, MAX_TITLE_LENGTH),
    description,
    ...images,
    ogType: "article",
    publishedTime: publishedIso,
    modifiedTime: modifiedIso,
    isIndexable: isSectionIndexable("/tin-tuc"),
    jsonLd: [toGraph(nodes)],
  };
}

export function notFoundPageMeta(): PageMeta {
  return {
    path: "/404",
    title: `Không tìm thấy trang | ${BRAND_SUFFIX}`,
    description: "Trang bạn tìm không tồn tại hoặc đã được di chuyển.",
    ...DEFAULT_IMAGE,
    ogType: "website",
    isIndexable: false,
    jsonLd: [],
  };
}
