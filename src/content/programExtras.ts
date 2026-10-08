// Khối "Ngành này có phù hợp với bạn?" cuối trang ngành: làm dày trang ngành bằng thông tin đã
// có trong repo (lĩnh vực, trình độ, đầu vào, ngành cùng lĩnh vực). Không phụ thuộc CMS, không
// thêm học phí hay số liệu. Thông tin riêng từng ngành (lịch học, điều kiện đặc thù) chờ nhà
// trường xác nhận sau khi import bài ngành vào database.
import { PROGRAM_FIELDS, PROGRAM_NAMES, programHref, publishedLevel } from "./programFields";
import { guideBySlug, guidePath } from "./guides";

export interface ProgramLink {
  name: string;
  path: string;
}

export interface ProgramExtras {
  name: string;
  fieldName: string;
  interest: string;
  entry: string;
  schedule?: string;
  /** Câu mô tả văn bằng; null = trường chưa công bố rõ hệ đào tạo → không hiện mục này */
  credential: string | null;
  sameField: ProgramLink[];
  guides: ProgramLink[];
}

const ENTRY_BY_LEVEL: Record<string, string> = {
  "trung-cap":
    "Nhận người tốt nghiệp THCS, THPT. Người tốt nghiệp THCS được học trình độ trung cấp và học thêm khối lượng kiến thức văn hóa THPT theo quy định của Bộ Giáo dục và Đào tạo.",
  "so-cap": "Khóa sơ cấp, ngắn hạn, cấp chứng chỉ sau khi hoàn thành. Điều kiện đầu vào của từng khóa được tư vấn khi đăng ký.",
  "lien-thong":
    "Dành cho người đã tốt nghiệp trung cấp chuyên nghiệp hoặc trung cấp nghề VÀ có bằng tốt nghiệp THPT hoặc giấy chứng nhận hoàn thành chương trình THPT.",
};
const DEFAULT_ENTRY = "Điều kiện đầu vào được tư vấn khi đăng ký.";

const CREDENTIAL_BY_LEVEL: Record<string, string> = {
  "trung-cap":
    "Hoàn thành chương trình được cấp bằng tốt nghiệp trung cấp, có thể học liên thông lên trình độ cao hơn theo Thông tư 52/2026/TT-BGDĐT.",
  "so-cap": "Hoàn thành khóa học được cấp chứng chỉ.",
  "lien-thong":
    "Bằng đại học do trường đại học liên kết cấp. Trường Trung cấp nghề Nhân Lực Quốc Tế là đơn vị liên kết, không cấp bằng đại học.",
};

const MAX_GUIDES = 3;
const COMMON_GUIDES: readonly string[] = [];

/** Nhãn nhanh cho thẻ ngành: văn bằng theo trình độ (chỉ thông tin đã có căn cứ) */
export function programHighlights(slug: string): string[] {
  // Chưa biết chắc hệ đào tạo thì không gắn nhãn văn bằng
  const level = publishedLevel(slug);
  if (!level) return [];
  if (level === "trung-cap") return ["Cấp bằng trung cấp"];
  if (level === "so-cap") return ["Cấp chứng chỉ"];
  return ["Liên thông đại học"];
}

/** Bài cẩm nang so sánh các ngành trong 1 lĩnh vực (id trong PROGRAM_FIELDS) */
export function fieldGuides(_fieldId: string): ProgramLink[] {
  return [];
}

/** null khi ngành chưa có trong danh mục (ngành mới thêm ở CMS) */
export function programExtras(slug: string): ProgramExtras | null {
  const name = PROGRAM_NAMES[slug];
  const field = PROGRAM_FIELDS.find((item) => item.programs.some((entry) => entry.slug === slug));
  if (!name || !field) return null;

  const level = publishedLevel(slug);
  const sameField = field.programs
    .filter((item) => item.slug !== slug)
    .map((item) => ({ name: item.name, path: programHref(item.slug) }));

  const guides = [...new Set(COMMON_GUIDES)]
    .map(guideBySlug)
    .filter((guide) => guide !== null)
    .slice(0, MAX_GUIDES)
    .map((guide) => ({ name: guide.title, path: guidePath(guide.slug) }));

  return {
    name,
    fieldName: field.name,
    interest: field.interest,
    entry: (level && ENTRY_BY_LEVEL[level]) ?? DEFAULT_ENTRY,
    credential: level ? CREDENTIAL_BY_LEVEL[level] : null,
    sameField,
    guides,
  };
}
