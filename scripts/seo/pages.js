// Tạo HTML riêng cho từng URL từ index.html (template): <head> theo meta của trang +
// <body> render sẵn bằng app React (src/ssr) kèm dữ liệu để trình duyệt hydrate.
// Trang chủ ghi đè chính index.html → luôn strip block SEO/body cũ khi đọc template.
import fs from "fs";
import path from "path";
import {
  STATIC_PATHS,
  itemSlug,
  newsPageMeta,
  notFoundPageMeta,
  programPageMeta,
  programsListPageMeta,
  newsListPageMeta,
  staticPageMeta,
} from "../../src/seo/pageMeta";
import { injectHead, stripSeoBlock } from "../../src/seo/renderHead";
import { hasEmbeddedData, injectBody, stripBody } from "../../src/ssr/injectBody";
import { initialDataForPath } from "../../src/ssr/initialDataForPath";
import { renderAppHtml } from "../../src/ssr/renderPage";

const DETAIL_DIRS = ["nganh-dao-tao", "tin-tuc"];

export function writeFileAtomic(filePath, content) {
  const tmpPath = `${filePath}.tmp`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(tmpPath, content);
  fs.renameSync(tmpPath, filePath);
}

export function pageFilePath(rootDir, pagePath) {
  if (pagePath === "/") return path.join(rootDir, "index.html");
  return path.join(rootDir, ...pagePath.split("/").filter(Boolean), "index.html");
}

// Số bài trang 1 của /news (khớp NewsPage LIMIT và initialDataForPath)
const NEWS_FIRST_PAGE = 10;

// /programs, /news có ItemList khi đã lấy được danh sách từ API
export function buildStaticPages(programs = [], news = []) {
  return STATIC_PATHS.map((pagePath) => {
    if (pagePath === "/nganh-dao-tao" && programs.length) return programsListPageMeta(programs);
    if (pagePath === "/tin-tuc" && news.length) return newsListPageMeta(news.slice(0, NEWS_FIRST_PAGE));
    return staticPageMeta(pagePath);
  }).filter(Boolean);
}

export function buildDetailPages({ programs = [], news = [] }) {
  const toPages = (items, toMeta) =>
    items.flatMap((item) => {
      const slug = itemSlug(item);
      return slug ? [toMeta(item, slug)] : [];
    });
  return [...toPages(programs, programPageMeta), ...toPages(news, newsPageMeta)];
}

// Xoá thư mục trang chi tiết không còn trong API (bài/ngành đã xoá)
function removeStaleDetailPages(rootDir, detailPages) {
  const keep = new Set(detailPages.map((page) => page.path));
  DETAIL_DIRS.forEach((dir) => {
    const dirPath = path.join(rootDir, dir);
    if (!fs.existsSync(dirPath)) return;
    fs.readdirSync(dirPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !keep.has(`/${dir}/${entry.name}`))
      .forEach((entry) => fs.rmSync(path.join(dirPath, entry.name), { recursive: true, force: true }));
  });
}

// URL trang 404 khi render: route "*" (NotFoundPage), không trùng trang nào
const NOT_FOUND_RENDER_PATH = "/404";

// Nội dung phụ thuộc query string (/tim-kiem?q=…): HTML tạo sẵn không có q → hydrate sẽ lệch.
// Chỉ tạo <head> (noindex), phần thân để trình duyệt tự render.
const HEAD_ONLY_PATHS = new Set(["/tim-kiem"]);

function renderPage(template, meta, content, renderPath = meta.path) {
  if (HEAD_ONLY_PATHS.has(renderPath)) return injectHead(template, meta);
  const data = content.isComplete ? initialDataForPath(renderPath, content) : {};
  return injectBody(injectHead(template, meta), renderAppHtml(renderPath, data), data);
}

// API lỗi lúc refresh → không đè trang đã render đủ dữ liệu bằng bản đang tải (skeleton)
function shouldKeepExisting(filePath, content) {
  return !content.isComplete && fs.existsSync(filePath) && hasEmbeddedData(fs.readFileSync(filePath, "utf8"));
}

// Thời điểm render nhúng trong dữ liệu đổi mỗi lần chạy → bỏ qua khi so sánh nội dung trang
const RENDERED_AT_PATTERN = /"renderedAt":"[^"]*"/g;
const withoutRenderTime = (html) => html.replace(RENDERED_AT_PATTERN, "");

function hasPageChanged(filePath, html) {
  if (!fs.existsSync(filePath)) return true;
  return withoutRenderTime(fs.readFileSync(filePath, "utf8")) !== withoutRenderTime(html);
}

/**
 * Luôn ghi trang tĩnh + 404.html. Trang chi tiết chỉ ghi (và dọn trang cũ)
 * khi content.isComplete — API lỗi thì giữ nguyên trang đã có.
 * @returns {{ pageCount: number, changedPaths: string[] }} changedPaths: trang được index có HTML
 *   khác lần trước (để báo IndexNow)
 */
export function writePages(rootDir, content) {
  const template = stripBody(stripSeoBlock(fs.readFileSync(path.join(rootDir, "index.html"), "utf8")));
  const detailPages = content.isComplete ? buildDetailPages(content) : [];
  const pages = [
    ...buildStaticPages(content.isComplete ? content.programs : [], content.isComplete ? content.news : []),
    ...detailPages,
  ];

  const changedPaths = [];
  pages.forEach((meta) => {
    const filePath = pageFilePath(rootDir, meta.path);
    if (shouldKeepExisting(filePath, content)) return;
    const html = renderPage(template, meta, content);
    if (meta.isIndexable && hasPageChanged(filePath, html)) changedPaths.push(meta.path);
    writeFileAtomic(filePath, html);
  });
  writeFileAtomic(
    path.join(rootDir, "404.html"),
    renderPage(template, notFoundPageMeta(), content, NOT_FOUND_RENDER_PATH)
  );
  // Fallback cho trang chi tiết chưa có HTML riêng: template gốc, không mang
  // canonical/meta của trang chủ (index.html giờ là trang chủ đã chèn meta)
  writeFileAtomic(path.join(rootDir, "spa.html"), template);

  if (content.isComplete) removeStaleDetailPages(rootDir, detailPages);
  return { pageCount: pages.length, changedPaths };
}
