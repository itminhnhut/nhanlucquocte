// Chuẩn bị HTML bài viết từ CMS: hạ h1 → h2, bỏ mục lục cũ của Quill, gắn id duy nhất cho
// h1–h3 để làm mục lục. Xử lý bằng chuỗi (không DOMParser) → chạy được cả trên server
// tạo HTML sẵn lẫn trình duyệt, cho ra cùng kết quả khi hydrate.
import { demoteH1, fillMissingImageAlt, lazyLoadImages } from "./html";
import { renderFaqAccordion } from "../seo/faq";

export interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}

// Mục lục Quill (admin-edu quillToc.ts): <div class="ql-toc-block"> có div lồng bên trong
const QUILL_TOC_OPEN_PATTERN = /<div\b[^>]*class="[^"]*\bql-toc-block\b[^"]*"[^>]*>/i;
const DIV_TAG_PATTERN = /<(\/?)div\b[^>]*>/gi;
const HEADING_PATTERN = /<h([1-3])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
const ID_ATTR_PATTERN = /\sid="([^"]*)"/i;

const slugifyHeading = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");

const decodeText = (html: string): string =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

/** Vị trí ngay sau thẻ </div> đóng div mở tại `start` (đếm div lồng); -1 nếu HTML thiếu thẻ đóng */
function matchingDivEnd(html: string, start: number): number {
  const tags = new RegExp(DIV_TAG_PATTERN.source, "gi");
  tags.lastIndex = start;
  let depth = 0;
  for (let tag = tags.exec(html); tag; tag = tags.exec(html)) {
    depth += tag[1] ? -1 : 1;
    if (depth === 0) return tags.lastIndex;
  }
  return -1;
}

function removeQuillToc(html: string): string {
  let result = html;
  for (let open = result.match(QUILL_TOC_OPEN_PATTERN); open?.index !== undefined; open = result.match(QUILL_TOC_OPEN_PATTERN)) {
    const end = matchingDivEnd(result, open.index);
    // Thiếu thẻ đóng → chỉ bỏ thẻ mở, không cắt mất phần bài phía sau
    result = result.slice(0, open.index) + (end === -1 ? result.slice(open.index + open[0].length) : result.slice(end));
  }
  return result;
}

function uniqueId(base: string, usedIds: Set<string>): string {
  let id = base;
  for (let count = 2; usedIds.has(id); count++) id = `${base}-${count}`;
  usedIds.add(id);
  return id;
}

export function prepareArticleContent(
  html: unknown,
  title?: unknown
): { html: string; headings: ArticleHeading[] } {
  if (typeof html !== "string" || !html) return { html: "", headings: [] };

  const usedIds = new Set<string>();
  const headings: ArticleHeading[] = [];
  // Mục "Câu hỏi thường gặp" → accordion như trang ngành (trước bước gắn id để mục lục vẫn trỏ đúng)
  const withIds = renderFaqAccordion(removeQuillToc(demoteH1(html))).replace(HEADING_PATTERN, (_match, level: string, attrs = "", inner: string) => {
      const text = decodeText(inner) || "Tiêu đề chưa có nội dung";
      const existingId = attrs.match(ID_ATTR_PATTERN)?.[1] ?? "";
      const id = uniqueId(slugifyHeading(existingId || text) || "heading", usedIds);
      headings.push({ id, text, level: Number(level) });
      const otherAttrs = attrs.replace(ID_ATTR_PATTERN, "");
      return `<h${level} id="${id}"${otherAttrs}>${inner}</h${level}>`;
    });

  return { html: fillMissingImageAlt(lazyLoadImages(withIds), title), headings };
}
