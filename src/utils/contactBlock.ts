// Bỏ khối "Thông tin liên hệ" gõ tay ở cuối nội dung ngành (Quill, admin-edu): bài ngành thường
// kết bằng khối địa chỉ + hotline với nhiều kiểu định dạng khác nhau. Trang ngành
// hiện thẻ liên hệ chuẩn (components/ContactCard.jsx) từ appConfig thay thế.
// Chỉ cắt khi chắc chắn là khối liên hệ ngắn ở cuối; không khớp → giữ nguyên HTML (không mất nội dung).
// Xử lý chuỗi thuần → server tạo HTML sẵn và trình duyệt cho cùng kết quả khi hydrate.

const PARAGRAPH_PATTERN = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
// Khối liên hệ thật chỉ có đoạn văn ngắn (tên trường, địa chỉ, hotline, website, email)
const BLOCK_ONLY_PARAGRAPHS_PATTERN = /<(h[1-6]|img|table|ul|ol|iframe|figure)\b/i;
const MAX_BLOCK_TEXT_LENGTH = 400;
const SCHOOL_ADDRESS_MARKER = "phan đình giót";
const TRAILING_EMPTY_PARAGRAPHS_PATTERN = /(\s*<p\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>)+\s*$/i;

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/[·:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("vi");
}

/** Vị trí thẻ <p> cuối cùng chỉ chứa tiêu đề "Thông tin liên hệ"; -1 nếu không có */
function lastContactHeadingIndex(html: string): number {
  let index = -1;
  for (const match of html.matchAll(PARAGRAPH_PATTERN)) {
    if (plainText(match[1]) === "thông tin liên hệ" && match.index !== undefined) index = match.index;
  }
  return index;
}

function isShortContactBlock(blockHtml: string): boolean {
  if (BLOCK_ONLY_PARAGRAPHS_PATTERN.test(blockHtml)) return false;
  const text = plainText(blockHtml);
  return text.includes(SCHOOL_ADDRESS_MARKER) && text.length <= MAX_BLOCK_TEXT_LENGTH;
}

export function stripContactBlock(html: unknown): string {
  if (typeof html !== "string") return "";
  const start = lastContactHeadingIndex(html);
  if (start === -1 || !isShortContactBlock(html.slice(start))) return html;
  return html.slice(0, start).replace(TRAILING_EMPTY_PARAGRAPHS_PATTERN, "");
}
