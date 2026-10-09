// Danh mục ngành của Trường Trung cấp nghề Nhân Lực Quốc Tế, lập theo trang
// trungcapnhanlucquocte.vn/chuong-trinh-dao-tao.html (08/10/2026). Mô tả chỉ nêu nội dung nghề,
// không tự thêm học phí, thời lượng hay số liệu việc làm.
//
// TRÌNH ĐỘ (levelConfirmed) — đối chiếu lại từng trang của trường ngày 09/10/2026. Căn cứ:
//   Chăm sóc người cao tuổi → "Thời gian đào tạo: Ngắn hạn 12 tháng" + "CHỨNG CHỈ – BẰNG CẤP:
//     Ngắn hạn: Cấp Chứng chỉ hoàn thành khóa học".
//   Nghiệp vụ lễ tân        → "Bằng cấp: Chứng chỉ có giá trị toàn quốc." (web mình chỉ ghi
//     "chứng chỉ", không nhắc lại câu "có giá trị toàn quốc" vì chưa có căn cứ kiểm chứng).
//   Nghiệp vụ pha chế       → "Cấp chứng chỉ nghiệp vụ pha chế", khóa 1,5 – 3 tháng.
//   Ngôn ngữ Hàn Quốc       → "CHƯƠNG TRÌNH NGÔN NGỮ HÀN NGẮN HẠN", 3 – 6 tháng.
//   Thiết kế nội thất       → "Trình độ đào tạo: Trung Cấp", thời gian đào tạo 2 năm.
//   Nghiệp vụ bảo mẫu       → "Ngắn hạn: 1 – 3 tháng" VÀ "Trung cấp chính quy: 1 – 2 năm" → dùng
//     levelNote để nêu cả hai hệ.
//
// CÒN CHỜ NHÀ TRƯỜNG (levelConfirmed để trống, trang không gắn nhãn hệ, không nêu văn bằng):
//   Trợ lý nha khoa  — trang của trường gọi là "Khóa 32 Nghiệp vụ Trợ lý Nha khoa", không có mục
//     trình độ hay văn bằng.
//   Chăm sóc da      — trang chỉ nêu "Thời lượng học: 2 – 3 tháng", không nêu văn bằng.
//   Beauty Therapy   — trang chỉ nêu "Thời gian đào tạo: 02 năm", không nêu trình độ. Thời lượng
//     2 năm trùng với hệ trung cấp nhưng suy ra là đoán, nên vẫn để trống.
//
// Dữ liệu bài ngành sẽ được import vào database; slug lúc đó có thể khác slug ở đây, nên
// groupProgramsByField khớp theo slug TRƯỚC, không khớp thì dò từ khoá trong slug/tiêu đề.
// Sau khi import xong: đối chiếu slug thật rồi cập nhật mảng `slugs` của từng lĩnh vực.

/** Trang ngành đã có dữ liệu chưa? Hiện dữ liệu lấy từ public/mock (bài thật của trường) nên đã có.
 *  Nếu tạm tắt mục ngành thì đổi về false, mọi link nội bộ sẽ trỏ về trang danh sách. */
export const PROGRAM_PAGES_READY = true;

/** Link tới trang ngành, an toàn khi database chưa có bài ngành */
export function programHref(slug: string): string {
  return PROGRAM_PAGES_READY ? `/nganh-dao-tao/${slug}` : "/nganh-dao-tao";
}

export type ProgramLevel = "trung-cap" | "so-cap" | "lien-thong";

export const LEVEL_LABEL: Readonly<Record<ProgramLevel, string>> = {
  "trung-cap": "Hệ trung cấp",
  "so-cap": "Sơ cấp, ngắn hạn",
  "lien-thong": "Liên thông đại học",
};

export interface CatalogProgram {
  slug: string;
  name: string;
  /** Hệ đào tạo dùng để xếp nhóm. Chỉ CÔNG BỐ ra trang khi levelConfirmed = true */
  level: ProgramLevel;
  /** true = nhà trường đã công bố rõ hệ đào tạo (tiêu đề bài, mục "Trình độ đào tạo" hoặc mục
   *  "Chứng chỉ – Bằng cấp" trên trungcapnhanlucquocte.vn).
   *  false/không có = mình suy ra để xếp nhóm, KHÔNG hiển thị ra trang; chờ trường xác nhận. */
  levelConfirmed?: boolean;
  /** Ngành trường công bố nhiều hệ cùng lúc — ghi thêm một dòng bên cạnh nhãn hệ chính */
  levelNote?: string;
}

export interface ProgramField {
  id: string;
  /** id của H2 — để link "Chọn ngành theo sở thích" nhảy tới */
  anchor: string;
  name: string;
  intro: string;
  /** Gợi ý ngắn cho mục "Chọn ngành theo sở thích" (≤ 2 dòng trên mobile) */
  interest: string;
  icon: string;
  programs: readonly CatalogProgram[];
  /** Từ khoá dò ngành từ CMS khi slug chưa khớp (viết thường, không dấu) */
  keywords: readonly string[];
}

const p = (
  slug: string,
  name: string,
  level: ProgramLevel,
  levelConfirmed = false,
  levelNote?: string
): CatalogProgram => ({
  slug,
  name,
  level,
  levelConfirmed,
  ...(levelNote ? { levelNote } : {}),
});

const field = (value: Omit<ProgramField, "anchor" | "slugs">): ProgramField => ({
  ...value,
  anchor: `linh-vuc-${value.id}`,
});

export const PROGRAM_FIELDS: readonly ProgramField[] = [
  field({
    id: "y-te",
    name: "Y tế – Chăm sóc sức khỏe",
    intro:
      "Học kiến thức cơ sở y học và kỹ thuật chăm sóc người bệnh, người cao tuổi, nghiệp vụ dược và trợ lý nha khoa. Phù hợp với công việc tại bệnh viện, phòng khám, nhà thuốc, trung tâm dưỡng lão.",
    interest: "Thích chăm sóc người bệnh",
    icon: "🩺",
    programs: [
      p("chuyen-nganh-dieu-duong-he-trung-cap", "Điều dưỡng", "trung-cap", true),
      p("tuyen-sinh-nganh-duoc-si-he-trung-cap-khai-giang-ngay-16-03-2026", "Dược sĩ", "trung-cap", true),
      p("cham-soc-nguoi-cao-tuoi", "Chăm sóc người cao tuổi", "so-cap", true),
      p("tuyen-sinh-khoa-32-nghiep-vu-tro-ly-nha-khoa-khai-giang-ngay-01-07-2026", "Trợ lý nha khoa", "so-cap"),
    ],
    keywords: ["chuyen-nganh-dieu-duong-he-trung-cap", "duoc", "cao-tuoi", "nha-khoa"],
  }),
  field({
    id: "lam-dep",
    name: "Chăm sóc sắc đẹp",
    intro:
      "Học chăm sóc da, chăm sóc móng, liệu pháp làm đẹp và sử dụng thiết bị chuyên ngành. Sau khóa học có thể làm kỹ thuật viên tại spa, viện thẩm mỹ hoặc tự mở tiệm.",
    interest: "Thích làm đẹp, spa",
    icon: "💄",
    programs: [
      p("cham-soc-sac-dep-he-trung-cap", "Chăm sóc sắc đẹp", "trung-cap", true),
      p("tuyen-sinh-nganh-beauty-therapy-lieu-phap-lam-dep", "Beauty Therapy", "so-cap"),
      p("cham-soc-da-chuyen-nghiep", "Chăm sóc da", "so-cap"),
      p("cham-soc-nails-chuyen-nghiep-ngan-han", "Chăm sóc nails", "so-cap", true),
    ],
    keywords: ["sac-dep", "beauty", "cham-soc-da-chuyen-nghiep", "nail"],
  }),
  field({
    id: "am-thuc",
    name: "Ẩm thực – Nhà hàng – Khách sạn",
    intro:
      "Học chế biến món ăn, làm bánh, pha chế và nghiệp vụ phục vụ theo quy trình nhà hàng – khách sạn, phần lớn thời lượng là thực hành trên nguyên liệu thật.",
    interest: "Thích nấu ăn, làm bánh, pha chế",
    icon: "🍰",
    programs: [
      p("ky-thuat-che-bien-mon-an", "Kỹ thuật chế biến món ăn", "trung-cap", true),
      p("khai-giang-ky-thuat-lam-banh-khoa-106-he-trung-cap", "Kỹ thuật làm bánh", "trung-cap", true),
      p("quan-tri-khach-san", "Quản trị khách sạn", "trung-cap", true),
      p("khai-giang-nghiep-vu-le-tan", "Nghiệp vụ lễ tân", "so-cap", true),
      p("nghiep-vu-pha-che", "Nghiệp vụ pha chế", "so-cap", true),
    ],
    keywords: ["che-bien-mon-an", "lam-banh", "khach-san", "le-tan", "pha-che"],
  }),
  field({
    id: "ky-thuat",
    name: "Kỹ thuật – Xây dựng – Nội thất",
    intro:
      "Học đọc bản vẽ, thi công xây dựng, sửa chữa ô tô, nghề mộc và thiết kế – trang trí nội thất. Học đi đôi với thực hành tại xưởng.",
    interest: "Thích máy móc, công trình",
    icon: "🔧",
    programs: [
      p("trung-cap-ky-thuat-xay-dung", "Kỹ thuật xây dựng", "trung-cap", true),
      p("tuyen-sinh-cong-nghe-ky-thuat-o-to-khai-giang-ngay-03-03-2026", "Kỹ thuật sửa chữa ô tô", "trung-cap", true),
      p("thong-bao-tuyen-sinh-nganh-thiet-ke-noi-that-khoa-17", "Thiết kế nội thất", "trung-cap", true),
      p("tuyen-sinh-ky-thuat-moc-xay-dung-va-trang-tri-noi-that", "Mộc xây dựng và trang trí nội thất", "trung-cap", true),
      p("tuyen-sinh-thang-09-nghe-moc-noi-that-va-trang-tri", "Nghề mộc và trang trí nội thất", "so-cap", true),
    ],
    keywords: ["xay-dung", "o-to", "noi-that", "moc"],
  }),
  field({
    id: "kinh-te",
    name: "Kinh tế – Công nghệ thông tin",
    intro:
      "Học nghiệp vụ kế toán, quản trị kinh doanh hoặc công nghệ thông tin, làm việc tại phòng kế toán, phòng kinh doanh và bộ phận kỹ thuật của doanh nghiệp.",
    interest: "Thích con số, kinh doanh, máy tính",
    icon: "📊",
    programs: [
      p("ke-toan-doanh-nghiep", "Kế toán doanh nghiệp", "trung-cap", true),
      p("tuyen-sinh-trung-cap-nganh-quan-tri-kinh-doanh", "Quản trị kinh doanh", "trung-cap", true),
      p("nganh-cong-nghe-thong-tin-he-trung-cap", "Công nghệ thông tin", "trung-cap", true),
    ],
    keywords: ["ke-toan", "tuyen-sinh-trung-cap-nganh-quan-tri-kinh-doanh", "nganh-cong-nghe-thong-tin-he-trung-cap"],
  }),
  field({
    id: "ngan-han",
    name: "Ngoại ngữ – Nghề ngắn hạn",
    intro:
      "Khóa ngắn hạn cấp chứng chỉ: tiếng Hàn, nghiệp vụ bảo mẫu và nghề nông nghiệp hệ sơ cấp, học linh hoạt theo buổi.",
    interest: "Cần học nhanh, có chứng chỉ",
    icon: "🌏",
    programs: [
      p("ngon-ngu-han-quoc", "Ngôn ngữ Hàn Quốc", "so-cap", true),
      p("nghiep-vu-bao-mau", "Nghiệp vụ bảo mẫu", "so-cap", true, "Trường công bố cả hệ ngắn hạn và hệ trung cấp chính quy"),
      p("nghiep-vu-nghe-nong-nghiep-he-so-cap", "Nghiệp vụ nghề nông nghiệp", "so-cap", true),
    ],
    keywords: ["han-quoc", "bao-mau", "nong-nghiep"],
  }),
  field({
    id: "lien-thong",
    name: "Liên thông đại học",
    intro:
      "Dành cho người đã có bằng trung cấp muốn học tiếp trình độ đại học, liên kết đào tạo với trường đại học theo quy định về liên thông.",
    interest: "Đã có bằng trung cấp, muốn học tiếp",
    icon: "🎓",
    programs: [
      p("tuyen-sinh-he-dai-hoc-nam-2025", "Liên thông từ trung cấp lên đại học", "lien-thong", true),
      p("tuyen-sinh-he-lien-thong-dai-hoc-nganh-quan-tri-dich-vu-an-uong-va-am-thuc", "Quản trị dịch vụ ăn uống và ẩm thực", "lien-thong", true),
    ],
    keywords: ["lien-thong", "dai-hoc"],
  }),
];

const OTHER_FIELD: ProgramField = field({
  id: "khac",
  name: "Ngành khác",
  intro: "Các ngành và khóa học mới tuyển sinh tại Trường Trung cấp nghề Nhân Lực Quốc Tế.",
  interest: "",
  icon: "📚",
  programs: [],
  keywords: [],
});

/** Mọi ngành trong danh mục, giữ thứ tự lĩnh vực */
export const ALL_PROGRAMS: readonly CatalogProgram[] = PROGRAM_FIELDS.flatMap((item) => item.programs);

export function programsByLevel(level: ProgramLevel): readonly CatalogProgram[] {
  return ALL_PROGRAMS.filter((program) => program.level === level);
}

/**
 * Ngành ĐƯỢC PHÉP liệt kê kèm văn bằng ("cấp bằng trung cấp", "cấp chứng chỉ").
 * programsByLevel gộp cả ngành mình tự xếp nhóm, dùng nó để in kèm văn bằng là đang khẳng định
 * thay nhà trường — ví dụ Beauty Therapy bị xếp "sơ cấp" trong khi trang của trường ghi
 * "Thời gian đào tạo: 02 năm". Chỗ nào nêu văn bằng thì phải dùng hàm này.
 */
export function publishedProgramsByLevel(level: ProgramLevel): readonly CatalogProgram[] {
  return programsByLevel(level).filter((program) => program.levelConfirmed);
}

/** Ngành trường chưa công bố hệ đào tạo — liệt kê riêng, không gắn văn bằng */
export function programsWithUnknownLevel(): readonly CatalogProgram[] {
  return ALL_PROGRAMS.filter((program) => !program.levelConfirmed);
}

/** Tên ngành chuẩn theo slug */
export const PROGRAM_NAMES: Readonly<Record<string, string>> = Object.fromEntries(
  ALL_PROGRAMS.map((program) => [program.slug, program.name])
);

const PROGRAM_LEVELS: Readonly<Record<string, ProgramLevel>> = Object.fromEntries(
  ALL_PROGRAMS.map((program) => [program.slug, program.level])
);

export function programLevel(slug: string): ProgramLevel | null {
  return PROGRAM_LEVELS[slug] ?? null;
}

const CONFIRMED_LEVELS = new Set(ALL_PROGRAMS.filter((program) => program.levelConfirmed).map((p) => p.slug));

/**
 * Hệ đào tạo ĐƯỢC PHÉP công bố ra trang: chỉ khi thông báo tuyển sinh của trường ghi rõ.
 * Ngành chưa rõ → null: không gắn nhãn văn bằng, không ghi "Trung cấp …" trước tên ngành,
 * không đếm vào tổng ở trang Công khai. Văn bằng là nội dung bị quản lý, không được suy đoán.
 */
export function publishedLevel(slug: string): ProgramLevel | null {
  return CONFIRMED_LEVELS.has(slug) ? programLevel(slug) : null;
}

const ASCII_MAP: readonly [RegExp, string][] = [
  [/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a"],
  [/[èéẹẻẽêềếệểễ]/g, "e"],
  [/[ìíịỉĩ]/g, "i"],
  [/[òóọỏõôồốộổỗơờớợởỡ]/g, "o"],
  [/[ùúụủũưừứựửữ]/g, "u"],
  [/[ỳýỵỷỹ]/g, "y"],
  [/đ/g, "d"],
];

/** Bỏ dấu + về dạng slug để dò ngành khi slug CMS chưa khớp danh mục */
function asciiSlug(value: string): string {
  const lower = value.toLowerCase();
  const plain = ASCII_MAP.reduce((text, [pattern, letter]) => text.replace(pattern, letter), lower);
  return plain.replace(/[^a-z0-9]+/g, "-");
}

interface ProgramLike {
  slug?: string;
  title?: string;
}

function matchField(program: ProgramLike): ProgramField {
  const slug = program.slug ?? "";
  const bySlug = PROGRAM_FIELDS.find((item) => item.programs.some((entry) => entry.slug === slug));
  if (bySlug) return bySlug;
  const haystack = `${asciiSlug(slug)}-${asciiSlug(program.title ?? "")}`;
  return PROGRAM_FIELDS.find((item) => item.keywords.some((key) => haystack.includes(key))) ?? OTHER_FIELD;
}

/** Nhóm ngành theo thứ tự PROGRAM_FIELDS, bỏ nhóm rỗng; ngành chưa xếp nhóm → "Ngành khác" */
export function groupProgramsByField<T extends ProgramLike>(programs: readonly T[]) {
  return [...PROGRAM_FIELDS, OTHER_FIELD]
    .map((item) => ({ field: item, programs: programs.filter((program) => matchField(program) === item) }))
    .filter((group) => group.programs.length > 0);
}

/** Giữ API cũ: slug trong danh mục dùng nguyên, slug lạ trả về chính nó */
export function canonicalProgramSlug(slug: string): string {
  return slug;
}
