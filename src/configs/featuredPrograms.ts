// Ngành ưu tiên tuyển sinh/SEO: luôn nằm đầu danh sách ngành ở trang chủ để có
// link nội bộ từ trang chủ (trang chủ chỉ hiện 12 ngành đầu).
// TODO: chốt lại danh sách ngành ưu tiên với nhà trường.
export const FEATURED_PROGRAM_SLUGS: readonly string[] = ["chuyen-nganh-dieu-duong-he-trung-cap", "cham-soc-sac-dep-he-trung-cap"];

interface ProgramLike {
  slug?: string;
}

/** Đưa ngành ưu tiên lên đầu, giữ nguyên thứ tự các ngành còn lại */
export function withFeaturedFirst<T extends ProgramLike>(programs: readonly T[]): T[] {
  const rank = (program: T): number => {
    const index = FEATURED_PROGRAM_SLUGS.indexOf(program.slug ?? "");
    return index === -1 ? FEATURED_PROGRAM_SLUGS.length : index;
  };
  return programs
    .map((program, order) => ({ program, order }))
    .sort((a, b) => rank(a.program) - rank(b.program) || a.order - b.order)
    .map(({ program }) => program);
}
