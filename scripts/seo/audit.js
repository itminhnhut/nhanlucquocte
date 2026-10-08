// Quét SEO toàn site qua HTTP như bot Google: đọc robots.txt + sitemap.xml, tải từng trang
// (kèm các link nội bộ tìm thấy), kiểm tra từng mục và xuất báo cáo Markdown.
// Chạy: npm run audit:seo -- https://trungcapnhanlucquocte.vn   (hoặc http://localhost:8088 sau khi build)
import appConfig from "../../src/configs/appConfig";
import { targetKeyword } from "../../src/seo/keywords";

const USER_AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const MAX_PAGES = 300;
const SITE_ORIGIN = new URL(appConfig.domain).origin;

export const LIMITS = {
  titleMin: 30,
  titleMax: 60,
  descriptionMin: 70,
  descriptionMax: 160,
  minWords: 300,
  minInternalLinks: 3,
  leadWords: 120,
};

const SKIP_PATH = /^\/(assets|images)\/|\.(js|css|png|jpe?g|webp|svg|ico|txt|xml)$/i;

// ── Đọc HTML (HTML do chính site tạo, cấu trúc ổn định → regex là đủ) ─────────────
const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

export const stripTags = (html) =>
  decode(html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, "i"));
  return match ? decode(match[1]) : null;
}

function metaContent(html, key, value) {
  const tag = (html.match(/<meta\b[^>]*>/gi) || []).find((item) => attr(item, key) === value);
  return tag ? attr(tag, "content") : null;
}

function linkHref(html, rel) {
  const tag = (html.match(/<link\b[^>]*>/gi) || []).find((item) => attr(item, "rel") === rel);
  return tag ? attr(tag, "href") : null;
}

/** Phần nội dung trang (#root, bỏ script) */
function rootHtml(html) {
  const start = html.indexOf('<div id="root">');
  const body = start >= 0 ? html.slice(start) : html;
  return body.replace(/<script[\s\S]*?<\/script>/gi, "");
}

/** Vùng nội dung chính: bỏ header site (thẻ <header> đầu tiên), menu, footer để đếm chữ và
 * lấy đoạn mở đầu. <header> sau đó là phần đầu bài viết (chứa H1) → giữ lại. */
function mainHtml(root) {
  return root
    .replace(/<header\b[\s\S]*?<\/header>/i, " ")
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, " ")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ");
}

const countWords = (text) => (text ? text.split(/\s+/).filter(Boolean).length : 0);

export function normalizeText(text) {
  return String(text ?? "")
    .normalize("NFC")
    .toLocaleLowerCase("vi")
    .replace(/[“”"'’‘:;,.!?()–—|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Bỏ dấu tiếng Việt: so từ khoá với slug URL */
export function toAscii(text) {
  return normalizeText(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

/** "exact": có đúng cụm từ; "partial": có đủ các từ nhưng không liền nhau; "missing" */
export function keywordMatch(text, keyword) {
  const haystack = ` ${normalizeText(text)} `;
  const needle = normalizeText(keyword);
  if (haystack.includes(` ${needle} `)) return "exact";
  const words = needle.split(" ");
  return words.every((word) => haystack.includes(` ${word} `)) ? "partial" : "missing";
}

export function parsePage(html, pageUrl) {
  const root = rootHtml(html);
  const main = mainHtml(root);
  const headings = [...root.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: stripTags(match[2]),
  }));
  const h1Index = main.search(/<h1\b/i);
  const afterH1 = stripTags(h1Index >= 0 ? main.slice(h1Index).replace(/<h1\b[\s\S]*?<\/h1>/i, " ") : main);
  const images = (root.match(/<img\b[^>]*>/gi) || []).map((tag) => ({
    src: attr(tag, "src"),
    alt: attr(tag, "alt"),
    hasSize: Boolean(attr(tag, "width") && attr(tag, "height")),
  }));
  const links = (root.match(/<a\b[^>]*>/gi) || [])
    .map((tag) => ({ href: attr(tag, "href"), rel: attr(tag, "rel") || "" }))
    .filter((link) => link.href);
  const internalLinks = new Set();
  links.forEach(({ href }) => {
    try {
      const url = new URL(href, pageUrl);
      if (url.origin === new URL(pageUrl).origin && !SKIP_PATH.test(url.pathname)) {
        internalLinks.add(url.pathname.replace(/\/+$/, "") || "/");
      }
    } catch {
      /* href lạ (javascript:, tel:) → bỏ qua */
    }
  });
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => {
      try {
        return { ok: true, data: JSON.parse(match[1]) };
      } catch {
        return { ok: false, data: null };
      }
    }
  );
  const schemaTypes = new Set();
  const collectTypes = (node) => {
    if (Array.isArray(node)) return node.forEach(collectTypes);
    if (!node || typeof node !== "object") return;
    if (node["@type"]) [].concat(node["@type"]).forEach((type) => schemaTypes.add(type));
    Object.values(node).forEach(collectTypes);
  };
  jsonLd.forEach((item) => collectTypes(item.data));

  return {
    lang: html.match(/<html\b[^>]*\blang="([^"]*)"/i)?.[1] ?? null,
    title: stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: metaContent(html, "name", "description"),
    robots: metaContent(html, "name", "robots"),
    canonical: linkHref(html, "canonical"),
    og: {
      title: metaContent(html, "property", "og:title"),
      description: metaContent(html, "property", "og:description"),
      image: metaContent(html, "property", "og:image"),
      url: metaContent(html, "property", "og:url"),
    },
    headings,
    h1: headings.filter((h) => h.level === 1).map((h) => h.text),
    words: countWords(stripTags(main)),
    lead: afterH1.split(/\s+/).slice(0, LIMITS.leadWords).join(" "),
    bodyText: stripTags(main),
    images,
    internalLinks: [...internalLinks],
    jsonLd,
    schemaTypes: [...schemaTypes],
  };
}

// ── Kiểm tra 1 trang ────────────────────────────────────────────────────────────
const issue = (level, check, message) => ({ level, check, message });

export function checkPage(page, { path, status, sitemapPaths }) {
  const issues = [];
  const add = (level, check, message) => issues.push(issue(level, check, message));
  const indexable = !/noindex/i.test(page.robots || "");

  if (status !== 200) add("error", "HTTP", `Trả mã ${status}`);
  if (page.lang !== "vi") add("warn", "Ngôn ngữ", `<html lang> là "${page.lang}", nên là "vi"`);
  if (!page.robots) add("warn", "Robots", "Thiếu meta robots");

  // Title / description
  const titleLength = page.title.length;
  if (!page.title) add("error", "Title", "Thiếu <title>");
  else if (titleLength > LIMITS.titleMax) add("warn", "Title", `Dài ${titleLength} ký tự (> ${LIMITS.titleMax}), Google sẽ cắt`);
  else if (titleLength < LIMITS.titleMin) add("warn", "Title", `Ngắn ${titleLength} ký tự (< ${LIMITS.titleMin})`);
  const descLength = page.description?.length ?? 0;
  if (!page.description) add("error", "Description", "Thiếu meta description");
  else if (descLength > LIMITS.descriptionMax) add("warn", "Description", `Dài ${descLength} ký tự (> ${LIMITS.descriptionMax})`);
  else if (descLength < LIMITS.descriptionMin) add("warn", "Description", `Ngắn ${descLength} ký tự (< ${LIMITS.descriptionMin})`);

  // Canonical
  if (!page.canonical) add("error", "Canonical", "Thiếu canonical");
  else {
    const canonical = new URL(page.canonical, SITE_ORIGIN);
    if (canonical.origin !== SITE_ORIGIN) add("error", "Canonical", `Trỏ sang domain khác: ${page.canonical}`);
    const canonicalPath = canonical.pathname.replace(/\/+$/, "") || "/";
    if (indexable && canonicalPath !== path) add("error", "Canonical", `Trỏ sang trang khác: ${canonicalPath}`);
  }

  // Heading
  if (page.h1.length !== 1) add("error", "H1", `Có ${page.h1.length} thẻ H1 (cần đúng 1)`);
  page.headings.forEach((heading, index) => {
    const previous = page.headings[index - 1];
    if (previous && heading.level > previous.level + 1) {
      add("info", "Heading", `Nhảy cấp H${previous.level} → H${heading.level} ở "${heading.text.slice(0, 40)}"`);
    }
  });

  // Nội dung
  if (page.words === 0) add("error", "Nội dung", "HTML không có nội dung (chưa render sẵn), bot AI không đọc được");
  else if (indexable && page.words < LIMITS.minWords) add("warn", "Nội dung", `Chỉ ${page.words} chữ (< ${LIMITS.minWords}), trang mỏng`);

  // Từ khoá
  const keyword = targetKeyword(path);
  if (keyword && indexable) {
    const where = {
      Title: keywordMatch(page.title, keyword),
      H1: keywordMatch(page.h1.join(" "), keyword),
      Description: keywordMatch(page.description, keyword),
      "Đoạn mở đầu": keywordMatch(page.lead, keyword),
    };
    // H1 và đoạn mở đầu cùng ở đầu trang: cần từ khoá ở ít nhất 1 trong 2
    const topFound = where.H1 !== "missing" || where["Đoạn mở đầu"] !== "missing";
    Object.entries(where).forEach(([field, match]) => {
      const isTop = field === "H1" || field === "Đoạn mở đầu";
      if (match === "missing") {
        const level = field === "Title" ? "error" : isTop && topFound ? "info" : "warn";
        add(level, "Từ khoá", `"${keyword}" không có trong ${field}`);
      } else if (match === "partial") add("info", "Từ khoá", `"${keyword}" trong ${field} chỉ có đủ từ, không liền cụm`);
    });
    if (!topFound) add("error", "Từ khoá", `"${keyword}" không có cả ở H1 lẫn đoạn mở đầu`);
  }

  // Ảnh
  // alt="" là ảnh trang trí hợp lệ (WCAG), vd thumbnail nằm cạnh tiêu đề trong cùng link; chỉ báo khi thiếu hẳn
  const noAlt = page.images.filter((img) => img.alt === null);
  if (noAlt.length) add("warn", "Ảnh", `${noAlt.length} ảnh thiếu thuộc tính alt`);
  const noSize = page.images.filter((img) => !img.hasSize);
  if (noSize.length) add("info", "Ảnh", `${noSize.length} ảnh không khai width/height (có thể gây CLS)`);

  // Link nội bộ
  if (indexable && page.internalLinks.length < LIMITS.minInternalLinks) {
    add("warn", "Link nội bộ", `Chỉ ${page.internalLinks.length} link nội bộ`);
  }

  // Schema + Open Graph
  if (page.jsonLd.some((item) => !item.ok)) add("error", "Schema", "JSON-LD không hợp lệ");
  if (!page.jsonLd.length) add("warn", "Schema", "Không có JSON-LD");
  if (indexable && path !== "/" && !page.schemaTypes.includes("BreadcrumbList")) add("info", "Schema", "Không có BreadcrumbList");
  ["title", "description", "image", "url"].forEach((key) => {
    if (!page.og[key]) add("warn", "Open Graph", `Thiếu og:${key}`);
  });
  if (page.og.image && !/^https:\/\//.test(page.og.image)) add("warn", "Open Graph", "og:image không phải URL https tuyệt đối");

  // Sitemap
  if (indexable && !sitemapPaths.has(path)) add("warn", "Sitemap", "Trang index được nhưng không có trong sitemap");
  if (!indexable && sitemapPaths.has(path)) add("error", "Sitemap", "Trang noindex nhưng có trong sitemap");

  return { indexable, keyword, issues };
}

// ── Kiểm tra cấp site ───────────────────────────────────────────────────────────
export function checkSite(pages) {
  const issues = [];
  const indexable = pages.filter((page) => page.result.indexable && page.status === 200);
  const duplicates = (label, pick) => {
    const seen = new Map();
    indexable.forEach((page) => {
      const value = normalizeText(pick(page));
      if (!value) return;
      seen.set(value, [...(seen.get(value) || []), page.path]);
    });
    seen.forEach((paths, value) => {
      if (paths.length > 1) issues.push(issue("warn", `${label} trùng`, `"${value.slice(0, 60)}": ${paths.join(", ")}`));
    });
  };
  duplicates("Title", (page) => page.parsed.title);
  duplicates("Description", (page) => page.parsed.description);
  duplicates("H1", (page) => page.parsed.h1.join(" "));

  // Tranh từ khoá: từ khoá của trang A nằm trọn trong title của trang B
  indexable.forEach((page) => {
    // Từ khoá thương hiệu của trang chủ nằm trong hậu tố title mọi trang: không phải tranh từ khoá
    if (!page.result.keyword || page.path === "/") return;
    indexable
      .filter((other) => other.path !== page.path && keywordMatch(other.parsed.title, page.result.keyword) === "exact")
      .forEach((other) =>
        issues.push(
          issue("info", "Tranh từ khoá", `"${page.result.keyword}" (${page.path}) cũng có trong title ${other.path}`)
        )
      );
  });

  // Trang mồ côi: không trang nào link tới
  const inbound = new Map(indexable.map((page) => [page.path, 0]));
  pages.forEach((page) =>
    page.parsed?.internalLinks.forEach((link) => {
      if (link !== page.path && inbound.has(link)) inbound.set(link, inbound.get(link) + 1);
    })
  );
  inbound.forEach((count, path) => {
    if (count === 0 && path !== "/") issues.push(issue("warn", "Trang mồ côi", `${path}: không trang nào link tới`));
  });
  return { issues, inbound };
}

// ── Crawl ───────────────────────────────────────────────────────────────────────
async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "manual" });
  return { status: res.status, location: res.headers.get("location"), text: await res.text() };
}

function sitemapPathsOf(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const url = new URL(decode(match[1]));
    return url.pathname.replace(/\/+$/, "") || "/";
  });
}

export async function crawl(baseUrl) {
  const base = new URL(baseUrl);
  const siteIssues = [];

  const robots = await fetchText(new URL("/robots.txt", base));
  if (robots.status !== 200) siteIssues.push(issue("error", "robots.txt", `Trả mã ${robots.status}`));
  if (!/^sitemap:/im.test(robots.text)) siteIssues.push(issue("warn", "robots.txt", "Không khai báo Sitemap"));
  if (/^disallow:\s*\/\s*$/im.test(robots.text)) siteIssues.push(issue("error", "robots.txt", "Chặn toàn bộ site (Disallow: /)"));

  const sitemap = await fetchText(new URL("/sitemap.xml", base));
  const sitemapList = sitemap.status === 200 ? sitemapPathsOf(sitemap.text) : [];
  if (sitemap.status !== 200) siteIssues.push(issue("error", "sitemap.xml", `Trả mã ${sitemap.status}`));
  if (!sitemapList.length) siteIssues.push(issue("error", "sitemap.xml", "Không có URL nào"));
  const withLastmod = (sitemap.text.match(/<lastmod>/g) || []).length;
  if (sitemapList.length && withLastmod < sitemapList.length) {
    siteIssues.push(issue("info", "sitemap.xml", `${withLastmod}/${sitemapList.length} URL có <lastmod>`));
  }
  const sitemapPaths = new Set(sitemapList);

  const notFound = await fetchText(new URL(`/khong-ton-tai-${Date.now()}`, base));
  if (notFound.status !== 404) siteIssues.push(issue("error", "404", `URL không tồn tại trả mã ${notFound.status} (soft 404)`));

  const queue = ["/", ...sitemapList];
  const visited = new Set();
  const pages = [];
  while (queue.length && visited.size < MAX_PAGES) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    visited.add(path);
    const res = await fetchText(new URL(path, base));
    if (res.status >= 300 && res.status < 400) {
      pages.push({ path, status: res.status, redirect: res.location, parsed: null, result: { indexable: false, issues: [] } });
      if (sitemapPaths.has(path)) siteIssues.push(issue("error", "Sitemap", `${path} chuyển hướng (${res.status}) nhưng có trong sitemap`));
      continue;
    }
    const parsed = parsePage(res.text, new URL(path, base).href);
    const result = checkPage(parsed, { path, status: res.status, sitemapPaths });
    pages.push({ path, status: res.status, parsed, result });
    parsed.internalLinks.filter((link) => !visited.has(link)).forEach((link) => queue.push(link));
  }

  const site = checkSite(pages);
  return { baseUrl: base.href, pages, siteIssues: [...siteIssues, ...site.issues], inbound: site.inbound, sitemapCount: sitemapList.length };
}

// ── Báo cáo ─────────────────────────────────────────────────────────────────────
const ICON = { error: "❌", warn: "⚠️", info: "ℹ️" };
const count = (issues, level) => issues.filter((item) => item.level === level).length;

export function toMarkdown(report) {
  const allPageIssues = report.pages.flatMap((page) => page.result.issues);
  const all = [...report.siteIssues, ...allPageIssues];
  const lines = [
    `# Báo cáo quét SEO: ${report.baseUrl}`,
    "",
    `- Trang đã quét: **${report.pages.length}** (sitemap: ${report.sitemapCount} URL)`,
    `- Lỗi: **${count(all, "error")}** · Cảnh báo: **${count(all, "warn")}** · Gợi ý: **${count(all, "info")}**`,
    "",
    "## Cấp site",
    "",
    ...(report.siteIssues.length ? report.siteIssues.map((i) => `- ${ICON[i.level]} **${i.check}:** ${i.message}`) : ["- ✅ Không có vấn đề"]),
    "",
    "## Từng trang",
    "",
    "| Trang | HTTP | Title | Desc | H1 | Chữ | Link vào | Từ khoá | Lỗi / Cảnh báo |",
    "|---|---|---|---|---|---|---|---|---|",
    ...report.pages.map((page) => {
      if (!page.parsed) return `| ${page.path} | ${page.status} → ${page.redirect ?? ""} | | | | | | | |`;
      const p = page.parsed;
      const e = count(page.result.issues, "error");
      const w = count(page.result.issues, "warn");
      return `| ${page.path} | ${page.status} | ${p.title.length} | ${p.description?.length ?? 0} | ${p.h1.length} | ${p.words} | ${report.inbound.get(page.path) ?? "-"} | ${page.result.keyword ?? "-"} | ${e ? `❌${e} ` : ""}${w ? `⚠️${w}` : e ? "" : "✅"} |`;
    }),
    "",
    "## Chi tiết",
    "",
  ];
  report.pages
    .filter((page) => page.result.issues.length)
    .forEach((page) => {
      lines.push(`### ${page.path}`, "");
      if (page.parsed) lines.push(`- Title: ${page.parsed.title}`, `- H1: ${page.parsed.h1.join(" | ")}`);
      page.result.issues.forEach((i) => lines.push(`- ${ICON[i.level]} **${i.check}:** ${i.message}`));
      lines.push("");
    });
  return lines.join("\n");
}
