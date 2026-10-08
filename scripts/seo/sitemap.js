import { STATIC_PATHS, isSectionIndexable, itemSlug, staticPageMeta } from "../../src/seo/pageMeta";
import { canonicalUrl } from "../../src/seo/url";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toUrlEntry({ path, changefreq, priority, lastmod }) {
  return [
    "  <url>",
    `    <loc>${escapeXml(canonicalUrl(path))}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

function toDetailEntries(basePath, items, priority) {
  // Mục chưa mở (ngành, tin tức) → không đưa trang chi tiết vào sitemap
  if (!isSectionIndexable(basePath)) return [];
  return items
    .map((item) => ({ slug: itemSlug(item), createdAt: item?.createdAt }))
    .filter((item) => item.slug)
    .map(({ slug, createdAt }) => ({
      path: `${basePath}/${slug}`,
      changefreq: "weekly",
      priority,
      // Bài tin có ngày đăng → khai lastmod; trang ngành không có trường ngày nên bỏ qua
      lastmod: typeof createdAt === "string" && createdAt.length >= 10 ? createdAt.slice(0, 10) : undefined,
    }));
}

// Trang gần như không đổi → không khai "daily"
const EVERGREEN_PATHS = new Set(["/gioi-thieu", "/cong-khai", "/chinh-sach-bao-mat", "/tra-cuu-van-bang"]);

export function buildSitemap({ programs = [], news = [] }) {
  // Chỉ bài cẩm nang có ngày cập nhật đáng tin (khai báo trong code); API chưa trả updatedAt
  // nên trang ngành/tin không ghi lastmod (lastmod sai làm Google bỏ qua cả sitemap)
  const staticEntries = STATIC_PATHS.map((path) => staticPageMeta(path))
    .filter((meta) => meta?.isIndexable)
    .map((meta) => ({
      path: meta.path,
      changefreq: EVERGREEN_PATHS.has(meta.path) ? "monthly" : meta.ogType === "article" ? "monthly" : "daily",
      priority: meta.path === "/" ? "1.0" : "0.8",
      lastmod: meta.ogType === "article" ? meta.modifiedTime?.slice(0, 10) : undefined,
    }));

  const entries = [
    ...staticEntries,
    ...toDetailEntries("/nganh-dao-tao", programs, "0.7"),
    ...toDetailEntries("/tin-tuc", news, "0.6"),
  ];

  const seen = new Set();
  const uniqueEntries = entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniqueEntries.map(toUrlEntry),
    "</urlset>",
    "",
  ].join("\n");
}
