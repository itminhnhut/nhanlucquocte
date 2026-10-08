// Render thẻ <head> từ PageMeta thành chuỗi HTML (dùng khi tạo HTML sẵn).
// Mọi thẻ có data-rh="true" → react-helmet-async coi là của nó và thay thế
// khi app chạy, nên không bị trùng meta sau khi React render.
import type { PageMeta } from "./pageMeta";
import { buildHeadTags, type HeadTag } from "./headTags";

export const SEO_BLOCK_START = "<!--seo:start-->";
export const SEO_BLOCK_END = "<!--seo:end-->";

const SEO_BLOCK_PATTERN = new RegExp(`\\s*${SEO_BLOCK_START}[\\s\\S]*?${SEO_BLOCK_END}`, "g");

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toAttrs(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(" ");
}

function renderTag(tag: HeadTag): string {
  switch (tag.kind) {
    case "title":
      return `<title>${escapeHtml(tag.text)}</title>`;
    case "meta":
      return `<meta ${toAttrs(tag.attrs)} data-rh="true" />`;
    case "link":
      return `<link ${toAttrs(tag.attrs)} data-rh="true" />`;
    case "jsonld":
      return `<script type="application/ld+json" data-rh="true">${tag.json}</script>`;
    // Không gắn data-rh: Helmet không quản lý preload, tránh bị gỡ khi app chạy
    case "preload":
      return `<link ${toAttrs(tag.attrs)} />`;
  }
}

export function renderHeadTags(meta: PageMeta): string {
  return buildHeadTags(meta)
    .map((tag) => `    ${renderTag(tag)}`)
    .join("\n");
}

/** Bỏ block SEO đã chèn trước đó → lấy lại template gốc */
export function stripSeoBlock(html: string): string {
  return html.replace(SEO_BLOCK_PATTERN, "");
}

/** Chèn block SEO trước </head>; chạy lại nhiều lần vẫn chỉ có 1 block */
export function injectHead(template: string, meta: PageMeta): string {
  const base = stripSeoBlock(template);
  const headEnd = base.indexOf("</head>");
  if (headEnd === -1) throw new Error("Template HTML không có </head>");
  const block = `\n    ${SEO_BLOCK_START}\n${renderHeadTags(meta)}\n    ${SEO_BLOCK_END}\n  `;
  return `${base.slice(0, headEnd).trimEnd()}${block}${base.slice(headEnd)}`;
}
