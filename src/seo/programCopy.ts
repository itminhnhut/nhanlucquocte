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
    // "Liên thông đại học Liên thông từ trung cấp lên đại học" → tên đã có chữ đó thì để trần
    if (level === "lien-thong")
      return /liên thông/iu.test(catalogName) ? catalogName : `${LEVEL_LABEL[level]} ${catalogName}`;
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

/**
 * Câu mô tả mặc định. KHÔNG được khẳng định hệ đào tạo khi trường chưa công bố:
 * ba ngành (Chăm sóc da, Beauty Therapy, Trợ lý nha khoa) không có hệ nào trên trang của
 * trường, mà câu cũ vẫn ghi "Tuyển sinh trung cấp …" cho mọi ngành không phải sơ cấp — tức
 * description nói ngược lại chính nội dung trang (trang ghi "gọi hotline để được xác nhận").
 */
function defaultDescription(name: string, level: string | null): string {
  // Tên danh mục của ngành liên thông đã chứa chữ "Liên thông" → không ghép tiền tố lần nữa
  const alreadyLabelled = /liên thông/iu.test(name);
  const label =
    level === "trung-cap"
      ? `trung cấp ${name}`
      : level === "so-cap"
        ? `khóa học ${name}`
        : level === "lien-thong"
          ? alreadyLabelled
            ? name
            : `liên thông đại học ${name}`
          : `ngành ${name}`;
  // Giữ ngắn để còn chỗ ghép "Khai giảng dd.mm.yyyy." mà không vượt 160 ký tự
  return `Tuyển sinh ${label} tại TPHCM – Trường Trung cấp nghề Nhân Lực Quốc Tế, Tân Bình. Đăng ký tư vấn miễn phí.`;
}

type ProgramInput = { title?: unknown; description?: unknown; metaDescription?: unknown };

/** Đoạn mở đầu có từ khoá (dùng cho meta description và đoạn đầu trang ngành) */
export function programLead(slug: string, program: ProgramInput): string {
  // Ngành có trong danh mục → dùng tên gọn đã chốt; nếu không thì tách từ tiêu đề bài
  // Ngành TRONG danh mục: chỉ nêu hệ khi trường đã công bố (null → không khẳng định gì).
  // Ngành NGOÀI danh mục (BE vừa thêm, mình chưa đối chiếu): suy theo ngữ pháp tiêu đề y như
  // programDisplayName đang làm, để title và description không nói khác nhau.
  const catalogName = PROGRAM_NAMES[slug];
  const parsed = parseProgramName(program.title);
  const name = catalogName ?? parsed.name;
  const level = catalogName
    ? publishedLevel(slug)
    : parsed.kind === "ngành"
      ? "trung-cap"
      : "so-cap";
  return (
    (typeof program.metaDescription === "string" && program.metaDescription.trim()) ||
    PROGRAM_COPY[slug]?.description ||
    defaultDescription(name, level)
  );
}

/**
 * Mô tả hiện trên THẺ ngành (trang chủ, /nganh-dao-tao) — lấy từ `description` của API.
 *
 * Trước đây thẻ nào cũng hiện đúng một câu sinh sẵn giống hệt nhau cho cả 26 ngành, tức là
 * nhân viên viết mô tả trong trang quản trị xong website không dùng. Nhưng chữ từ CMS không
 * dùng thẳng được: phần lớn mở đầu bằng một dòng tiêu đề IN HOA ("TUYỂN SINH HỆ TRUNG CẤP
 * KHÓA 107 - KỸ THUẬT BÁNH CHUYÊN NGHIỆP NGÀY KHAI GIẢNG : 05.05.2026") rồi mới tới câu mô
 * tả thật. Bỏ dòng tiêu đề đó đi, còn lại mới là thứ đáng hiện trên thẻ.
 *
 * Giữ nguyên câu sinh sẵn làm phương án dự phòng: mô tả trống, hoặc sau khi dọn còn quá ngắn
 * thì thà hiện câu chung còn hơn hiện một mẩu cụt.
 */
const MIN_USEFUL_LEAD = 40;

/** Một "từ" coi là IN HOA khi không có chữ thường nào (số và dấu câu tính là trung tính) */
function isUpperWord(word: string): boolean {
  return word.length > 0 && word === word.toUpperCase() && /\p{L}/u.test(word);
}

/**
 * Bỏ dòng tiêu đề IN HOA ở đầu mô tả CMS.
 * Chữ trong CMS không có dấu chấm câu nên tiêu đề chạy thẳng vào thân — tách theo câu không
 * ăn thua, phải cắt theo chữ in hoa.
 */
function stripUpperHeadline(text: string): string {
  const words = text.split(" ");
  let cut = 0;
  while (cut < words.length && (isUpperWord(words[cut]) || !/\p{L}/u.test(words[cut]))) cut += 1;
  if (cut < 3) return text; // chỉ vài chữ viết hoa, không phải tiêu đề
  const rest = words.slice(cut).join(" ").trim();
  return rest.length >= MIN_USEFUL_LEAD ? rest : text;
}

/**
 * Đoạn mở đầu có đọc như lời giới thiệu không, hay là dòng biểu mẫu?
 *
 * Mô tả trong CMS phần lớn là bản sao thông báo tuyển sinh: "Tên ngành, nghề : Quản trị kinh
 * doanh Mã ngành, nghề : 5340404", "Khai giảng: 10/11/2025 Thời gian đào tạo: 02 năm",
 * "(Thời gian đào tạo: 24 tháng) I. MỤC TIÊU…". Đưa mấy thứ đó lên thẻ thì vừa khó đọc, vừa
 * hiện NGÀY KHAI GIẢNG ĐÃ QUA — mà ngày khai giảng đã có chỗ riêng và chỉ hiện khi chưa tới.
 */
function looksLikeProse(text: string): boolean {
  const opening = text.split(/\s+/u).slice(0, 8).join(" ");
  if (/:/u.test(opening)) return false; // cặp nhãn – giá trị
  if (/^(\(|\d+\.|[IVX]+\.)/u.test(text)) return false; // mục đánh số, chú thích trong ngoặc
  if (/\d{1,2}[./-]\d{1,2}[./-]\d{4}/u.test(opening)) return false; // mở đầu bằng một ngày
  return true;
}

/**
 * Mô tả hiện trên THẺ ngành (trang chủ, /nganh-dao-tao).
 *
 * Ưu tiên `description` nhân viên viết trong trang quản trị — trước đây mọi thẻ đều hiện đúng
 * một câu sinh sẵn giống hệt nhau cho cả 26 ngành, tức là viết mô tả xong website không dùng.
 * Nhưng chỉ nhận khi nó thật sự đọc được; còn lại vẫn dùng câu sinh sẵn, vì thà hiện câu chung
 * còn hơn hiện một mẩu biểu mẫu kèm ngày đã qua.
 */
export function programCardLead(slug: string, program: ProgramInput): string {
  const raw = typeof program.description === "string" ? program.description.replace(/\s+/g, " ").trim() : "";
  const cleaned = raw ? stripUpperHeadline(raw) : "";
  if (cleaned.length < MIN_USEFUL_LEAD || !looksLikeProse(cleaned)) return programLead(slug, program);
  // KHÔNG cắt bằng "…": thẻ đã có line-clamp-3 của CSS lo phần nhìn thấy, mà chữ đầy đủ vẫn
  // nằm trong trang cho Google đọc. Cắt tay là vừa mất nội dung vừa thừa dấu ba chấm.
  return cleaned;
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
