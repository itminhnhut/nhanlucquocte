// Lấy danh sách chương trình + tin tức cho sitemap và HTML tạo sẵn — nguồn duy nhất là API của
// trường (VITE_API_URL). Chưa khai báo hoặc API lỗi → isComplete = false, nơi gọi giữ nguyên
// sitemap và các trang đã tạo thay vì ghi đè bằng dữ liệu thiếu.
import { itemSlug } from "../../src/seo/pageMeta";

const PAGE_LIMIT = 100;
const MAX_PAGES = 50;
const REQUEST_TIMEOUT_MS = 20000;

// Lúc docker build VITE_API_URL là placeholder "__VITE_API_URL__" → coi như chưa set
export function isUsableUrl(value) {
  return typeof value === "string" && /^https?:\/\//.test(value) && !value.includes("__");
}

export function resolveApiUrl(env) {
  if (!isUsableUrl(env.VITE_API_URL)) return "";
  const url = env.VITE_API_URL;
  return url.endsWith("/") ? url : `${url}/`;
}

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

async function fetchAllPages(apiUrl, endpoint) {
  const items = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const body = await fetchJson(`${apiUrl}${endpoint}?page=${page}&limit=${PAGE_LIMIT}&noPaginate=false`);
    if (!Array.isArray(body?.data)) throw new Error(`Response ${endpoint} không có mảng data`);
    items.push(...body.data);
    const totalPages = body.meta?.totalPages || body.pagination?.totalPages;
    if (!totalPages || page >= totalPages) return items;
  }
  return items;
}

/** Chỉ giữ item đang active, có slug an toàn, không trùng slug */
export function toPublishableItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const slug = itemSlug(item);
    if (!slug || item?.active === false || seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}

async function fetchEndpoint(apiUrl, endpoint) {
  try {
    return { items: toPublishableItems(await fetchAllPages(apiUrl, endpoint)), isComplete: true };
  } catch (err) {
    console.warn(`⚠️  Lỗi khi lấy ${endpoint}:`, err.message);
    return { items: [], isComplete: false };
  }
}

/**
 * isComplete = false khi có endpoint lỗi → nơi gọi không được xoá trang cũ
 * hay ghi đè sitemap bằng dữ liệu thiếu.
 */
/** Bài tin trùng slug với trang ngành → bỏ, tránh 2 URL cùng nội dung cùng cho index */
function withoutProgramDuplicates(news, programs) {
  const programSlugs = new Set(programs.map(itemSlug).filter(Boolean));
  return news.filter((item) => !programSlugs.has(itemSlug(item)));
}

export async function loadContent(apiUrl) {
  if (!apiUrl) {
    // Bình thường ở bước docker build: VITE_API_URL còn là placeholder __VITE_API_URL__.
    // Trang chi tiết và sitemap đầy đủ được tạo lúc container khởi động, khi đã có URL thật.
    console.warn("ℹ️  Chưa có VITE_API_URL (bước build) — chỉ tạo phần tĩnh, chưa lấy ngành/tin.");
    return { programs: [], news: [], isComplete: false };
  }
  const [programs, news] = await Promise.all([
    fetchEndpoint(apiUrl, "client/programs"),
    fetchEndpoint(apiUrl, "client/posts"),
  ]);
  return {
    programs: programs.items,
    news: withoutProgramDuplicates(news.items, programs.items),
    isComplete: programs.isComplete && news.isComplete,
  };
}
