// Title + description SEO cho trang ngành (/nganh-dao-tao/:slug).
// - Viết tay theo slug cho các ngành hiện có (chỉ dùng thông tin có trong nội dung ngành).
// - Ngành mới chưa có trong danh sách → tự tạo từ tên ngành theo mẫu chung.
// - Ngày khai giảng lấy động từ trường `description` của API ("KHAI GIẢNG NGÀY 07.09.2026").
import { withBrandFit } from "../configs/seo.config";
import { LEVEL_LABEL, PROGRAM_NAMES, publishedLevel } from "../content/programFields";

const MAX_DESCRIPTION_LENGTH = 160;

interface ProgramCopy {
  /** Phần chính của title, chưa có thương hiệu (withBrandFit tự thêm hậu tố vừa 60 ký tự) */
  headline?: string;
  /** H1 khi từ khoá của title khác tên ngành chính thức (mặc định "<Tên ngành> tại TPHCM") */
  heading?: string;
  description: string;
}

// Title/description viết tay theo slug. Bài ngành của trường chưa import vào database nên để
// trống: mọi ngành dùng mẫu chung ở defaultDescription/programDisplayName bên dưới.
// Sau khi import: thêm từng slug thật vào đây cho các ngành ưu tiên SEO (điều dưỡng, dược,
// chăm sóc sắc đẹp, chế biến món ăn, ô tô…), mô tả chỉ lấy từ nội dung bài gốc của trường.
const PROGRAM_COPY: Record<string, ProgramCopy> = {};

// Tên riêng giữ viết hoa khi chuyển tên ngành IN HOA → chữ thường
const PROPER_NOUN_PATTERN = /\b(tiếng|ngôn ngữ) (anh|việt|hàn|nhật|trung|pháp|đức)\b/giu;
// Tiêu đề bài trên CMS thường là thông báo: "TUYỂN SINH NGÀNH X HỆ TRUNG CẤP KHAI GIẢNG NGÀY …",
// "THÔNG BÁO TUYỂN SINH …", "KHAI GIẢNG …" → cắt phần thông báo, chỉ giữ tên nghề.
const PROGRAM_PREFIX_PATTERN =
  /^(?:thông báo\s+)?(?:tuyển sinh|khai giảng)\s+(?:trung cấp\s+)?(ngành|lớp|khóa học|khoá học|chuyên ngành)?\s*/iu;
// "KỸ THUẬT XÂY DỰNG HỆ TRUNG CẤP" → bỏ đuôi, tránh title lặp "Trung cấp … hệ trung cấp"
const LEVEL_SUFFIX_PATTERN = /\s*(?:[-–,]\s*)?(?:hệ\s+)?(?:trung cấp|sơ cấp|ngắn hạn)\s*(?:\(.*?\))?$/iu;
// "… KHAI GIẢNG NGÀY 16/03/2026", "… KHÓA 106", "… ( NGẮN HẠN )" → bỏ phần đợt/ngày khai giảng
const OPENING_SUFFIX_PATTERN = /\s*(?:khai giảng|khóa|khoá)\s+(?:ngày\s+)?[\d./-]+.*$/iu;
const BRACKET_PATTERN = /\s*\(([^)]*)\)\s*$/u;

function capitalizeFirst(text: string): string {
  return text.charAt(0).toLocaleUpperCase("vi") + text.slice(1);
}

/** "TUYỂN SINH NGÀNH NGÔN NGỮ ANH" → { name: "Ngôn ngữ Anh", kind: "ngành" } */
export function parseProgramName(rawTitle: unknown): { name: string; kind: string } {
  const title = String(rawTitle ?? "").trim().replace(/\s+/g, " ");
  const kind = (title.match(PROGRAM_PREFIX_PATTERN)?.[1] ?? "ngành").toLocaleLowerCase("vi");
  const lower = title
    .replace(PROGRAM_PREFIX_PATTERN, "")
    .replace(OPENING_SUFFIX_PATTERN, "")
    .replace(BRACKET_PATTERN, "")
    .replace(LEVEL_SUFFIX_PATTERN, "")
    .trim()
    .toLocaleLowerCase("vi");
  const name = lower.replace(
    PROPER_NOUN_PATTERN,
    (_match, prefix: string, noun: string) => `${prefix} ${capitalizeFirst(noun)}`
  );
  return { name: capitalizeFirst(name), kind };
}

// "Trung cấp Kỹ thuật làm bánh" dễ bị đọc thành tên trường ("Trường Trung cấp Kỹ thuật …")
const TECHNICAL_NAME_PATTERN = /^(kỹ thuật|công nghệ kỹ thuật)\b/iu;

/** Tên hiển thị cho schema/breadcrumb: "Trung cấp Kế toán doanh nghiệp", "Trung cấp ngành Kỹ thuật làm bánh",
 * "Khóa học Nghiệp vụ bảo mẫu" */
export function programDisplayName(rawTitle: unknown, slug?: string): string {
  // Ngành có trong danh mục → dùng tên gọn đã chốt, kèm trình độ đúng
  const catalogName = slug ? PROGRAM_NAMES[slug] : undefined;
  if (catalogName) {
    // Chỉ gắn tiền tố hệ đào tạo khi trường đã công bố rõ; chưa rõ thì để tên ngành trần
    const level = publishedLevel(slug!);
    if (!level) return catalogName;
    if (level === "so-cap") return `Khóa học ${catalogName}`;
    if (level === "lien-thong") return `${LEVEL_LABEL[level]} ${catalogName}`;
    return TECHNICAL_NAME_PATTERN.test(catalogName) ? `Trung cấp ngành ${catalogName}` : `Trung cấp ${catalogName}`;
  }
  const { name, kind } = parseProgramName(rawTitle);
  if (kind !== "ngành") return `Khóa học ${name}`;
  return TECHNICAL_NAME_PATTERN.test(name) ? `Trung cấp ngành ${name}` : `Trung cấp ${name}`;
}

/** Lấy "dd.mm.yyyy" từ chuỗi kiểu "KHAI GIẢNG NGÀY 07.09.2026" */
export function parseOpeningDate(text: unknown): string | null {
  const match = String(text ?? "").match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (!match) return null;
  const [, day, month, year] = match;
  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
}

/** H1 trang ngành: "Trung cấp Điều dưỡng tại TPHCM" (thay tên IN HOA "TUYỂN SINH NGÀNH …" từ CMS) */
export function programHeading(rawTitle: unknown, slug?: string): string {
  return (slug && PROGRAM_COPY[slug]?.heading) || `${programDisplayName(rawTitle, slug)} tại TPHCM`;
}

const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Ngày "dd.mm.yyyy" chưa qua so với `now`, tính theo ngày ở Việt Nam (server chạy giờ UTC) */
export function isUpcomingDate(date: string, now: Date = new Date()): boolean {
  const [day, month, year] = date.split(".").map(Number);
  const vietnamNow = new Date(now.getTime() + VIETNAM_OFFSET_MS);
  const today = Date.UTC(vietnamNow.getUTCFullYear(), vietnamNow.getUTCMonth(), vietnamNow.getUTCDate());
  return Date.UTC(year, month - 1, day) >= today;
}

/** Ngày khai giảng từ API, chỉ khi chưa qua — ngày cũ trên SERP/trang làm người đọc hiểu nhầm */
export function upcomingOpeningDate(program: { description?: unknown }, now: Date = new Date()): string | null {
  const openingDate = parseOpeningDate(program.description);
  return openingDate && isUpcomingDate(openingDate, now) ? openingDate : null;
}

function defaultDescription(name: string, kind: string): string {
  const label = kind === "ngành" ? `trung cấp ${name}` : `khóa học ${name}`;
  // Giữ ngắn để còn chỗ ghép "Khai giảng dd.mm.yyyy." mà không vượt 160 ký tự
  return `Tuyển sinh ${label} tại TPHCM – Trường Trung cấp nghề Nhân Lực Quốc Tế, Tân Bình. Đăng ký tư vấn miễn phí.`;
}

type ProgramInput = { title?: unknown; description?: unknown; metaDescription?: unknown };

/** Đoạn mở đầu có từ khoá (dùng cho meta description và đoạn đầu trang ngành) */
export function programLead(slug: string, program: ProgramInput): string {
  // Ngành có trong danh mục → dùng tên gọn đã chốt; nếu không thì tách từ tiêu đề bài
  const catalogName = PROGRAM_NAMES[slug];
  const level = catalogName ? publishedLevel(slug) : null;
  const { name, kind } = catalogName
    ? { name: catalogName, kind: level === "so-cap" ? "khóa học" : "ngành" }
    : parseProgramName(program.title);
  return (
    (typeof program.metaDescription === "string" && program.metaDescription.trim()) ||
    PROGRAM_COPY[slug]?.description ||
    defaultDescription(name, kind)
  );
}

export function programSeoCopy(
  slug: string,
  program: ProgramInput,
  now: Date = new Date()
): { title: string; description: string } {
  const lead = programLead(slug, program);
  const openingDate = upcomingOpeningDate(program, now);
  const withDate = openingDate ? `${lead} Khai giảng ${openingDate}.` : lead;
  const headline = PROGRAM_COPY[slug]?.headline ?? `${programDisplayName(program.title, slug)} TPHCM`;
  return {
    title: withBrandFit(headline),
    description: withDate.length <= MAX_DESCRIPTION_LENGTH ? withDate : lead,
  };
}
