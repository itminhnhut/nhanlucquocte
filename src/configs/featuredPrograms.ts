// Ngành ưu tiên tuyển sinh/SEO: luôn nằm đầu danh sách ngành ở trang chủ để có
// link nội bộ từ trang chủ (trang chủ chỉ hiện 12 thẻ đầu).
//
// Thứ tự chốt theo dữ liệu Search Console ngày 19/10/2026 và sổ văn bằng đã cấp, không chọn
// theo cảm tính:
// - cham-soc-nguoi-cao-tuoi: đang có truy vấn thật "khóa học chăm sóc người cao tuổi (tại tphcm)"
//   ở hạng 16–25 — gần trang 1 nhất trong tất cả ngành, mà trước đây trang chủ KHÔNG trỏ tới.
// - ky-thuat-che-bien-mon-an (10 bằng) và trung-cap-ky-thuat-xay-dung (9 bằng): hai ngành có
//   nhiều văn bằng đã cấp nhất sau Điều dưỡng, cũng không được trang chủ trỏ tới.
export const FEATURED_PROGRAM_SLUGS: readonly string[] = [
  "dieu-duong-he-trung-cap",
  "cham-soc-nguoi-cao-tuoi",
  "ky-thuat-che-bien-mon-an",
  "trung-cap-ky-thuat-xay-dung",
  "cham-soc-sac-dep-he-trung-cap",
];

/**
 * Hình dạng tối thiểu để sắp thứ tự. Khai thêm các trường mà nơi gọi thật sự đọc, nếu không
 * TypeScript suy T về đúng interface này và báo "Property 'id' does not exist" ở mọi chỗ
 * dùng kết quả.
 */
interface ProgramLike {
  slug?: string;
  id?: number;
  title?: string;
  image?: string | null;
  description?: string;
  content?: string;
  active?: boolean;
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
