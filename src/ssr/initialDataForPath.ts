// Dữ liệu cần nhúng cho từng URL khi tạo HTML sẵn — lấy từ danh sách programs/posts
// đã tải 1 lần (scripts/seo/content.js). API danh sách trả đủ trường như API chi tiết.
import { initialDataKeys, type InitialData } from "../data/initialData";
import { itemSlug, type ContentItem } from "../seo/pageMeta";

interface SiteContent {
  programs: ContentItem[];
  news: (ContentItem & { programs?: { slug?: string }[] })[];
}

// Trùng tham số trang gọi API: NewsSection/NewsPage lấy trang 1, 10 bài
const POSTS_PAGE_SIZE = 10;
const RELATED_POSTS_LIMIT = 10;

// Thẻ danh sách không hiện nội dung bài → bỏ `content` cho HTML nhẹ
const withoutContent = <T extends { content?: unknown }>({ content: _content, ...rest }: T) => rest;

function firstPostsPage(news: SiteContent["news"]) {
  return {
    data: news.slice(0, POSTS_PAGE_SIZE).map(withoutContent),
    meta: { page: 1, totalPages: Math.max(1, Math.ceil(news.length / POSTS_PAGE_SIZE)) },
  };
}

const findBySlug = <T extends ContentItem>(items: T[], slug: string) =>
  items.find((item) => itemSlug(item) === slug);

function programPageData(slug: string, content: SiteContent): InitialData {
  const program = findBySlug(content.programs, slug);
  if (!program) return {};
  const related = content.news
    .filter((post) => post.programs?.some((item) => item?.slug === slug))
    .slice(0, RELATED_POSTS_LIMIT)
    .map(withoutContent);
  return {
    [initialDataKeys.program(slug)]: program,
    [initialDataKeys.relatedPosts(slug)]: related,
  };
}

// Trang ngành hiện nhãn khai giảng theo "hôm nay" → nhúng thời điểm render để hydrate khớp
const withRenderedAt = (data: InitialData, now: Date): InitialData =>
  Object.keys(data).length ? { ...data, [initialDataKeys.renderedAt]: now.toISOString() } : data;

// "Bài viết khác": 3 bài cũ hơn + 2 bài mới hơn (API trả bài mới trước). Mỗi bài đều được bài
// liền sau nó link tới → bot đi hết mọi bài qua link trong HTML, kể cả bài không còn ở trang 1 /news
export const OLDER_NEARBY = 3;
export const NEWER_NEARBY = 2;

export function nearbyPosts(news: SiteContent["news"], slug: string) {
  const index = news.findIndex((post) => itemSlug(post) === slug);
  if (index === -1) return [];
  return [...news.slice(index + 1, index + 1 + OLDER_NEARBY), ...news.slice(Math.max(0, index - NEWER_NEARBY), index)]
    .filter((post) => itemSlug(post))
    .map(({ id, slug: postSlug, title, createdAt }) => ({ id, slug: postSlug, title, createdAt }));
}

/** 5 bài mới nhất, bỏ bài đang xem — dùng cho cột phải trang bài */
export function latestPosts(news: SiteContent["news"], slug: string) {
  return news
    .filter((post) => itemSlug(post) && itemSlug(post) !== slug)
    .slice(0, 5)
    .map(({ id, slug: postSlug, title, createdAt, image }) => ({ id, slug: postSlug, title, createdAt, image }));
}

function newsPageData(slug: string, content: SiteContent): InitialData {
  const post = findBySlug(content.news, slug);
  return post
    ? {
        [initialDataKeys.post(slug)]: post,
        [initialDataKeys.nearbyPosts(slug)]: nearbyPosts(content.news, slug),
        [initialDataKeys.latestPosts(slug)]: latestPosts(content.news, slug),
      }
    : {};
}

/** Bài thuộc danh mục "du học", bỏ phần content cho nhẹ (trang chỉ hiện tiêu đề + tóm tắt) */
function studyAbroadPosts(news: SiteContent["news"]) {
  return news
    .filter((post) => String((post as { category?: unknown }).category ?? "").toLowerCase() === "du học")
    .map(withoutContent);
}

export function initialDataForPath(path: string, content: SiteContent, now: Date = new Date()): InitialData {
  const [section, slug] = path.split("/").filter(Boolean);
  const programs = () => content.programs.map(withoutContent);

  if (!section) {
    return { [initialDataKeys.programs]: programs(), [initialDataKeys.firstPostsPage]: firstPostsPage(content.news) };
  }
  if (section === "nganh-dao-tao") {
    // Danh sách ngành cũng hiện nhãn khai giảng theo "hôm nay" → nhúng thời điểm render
    return withRenderedAt(slug ? programPageData(slug, content) : { [initialDataKeys.programs]: programs() }, now);
  }
  if (section === "tuyen-sinh" && !slug) {
    // Trang tuyển sinh hiện lịch khai giảng từng ngành theo "hôm nay"
    return withRenderedAt({ [initialDataKeys.programs]: programs() }, now);
  }
  if (section === "du-hoc" && !slug) {
    return { [initialDataKeys.studyAbroadPosts]: studyAbroadPosts(content.news) };
  }
  if (section === "tin-tuc") {
    return slug ? newsPageData(slug, content) : { [initialDataKeys.firstPostsPage]: firstPostsPage(content.news) };
  }
  return {};
}
