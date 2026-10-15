// Danh mục bài viết — đúng 4 giá trị trang quản trị cho phép (src/pages/News/CRUD/Create.tsx bên admin).
// `value` là chữ lưu trong database và cũng là tham số ?category= của API.
// `slug` là chữ không dấu hiện trên URL của website, để link chia sẻ đọc được và Google bò vào được.
export interface PostCategory {
  slug: string;
  value: string;
  label: string;
}

export const POST_CATEGORIES: readonly PostCategory[] = [
  { slug: "tin-truong", value: "tin tức", label: "Tin trường" },
  { slug: "tuyen-sinh", value: "tuyển sinh", label: "Tuyển sinh" },
  { slug: "hoat-dong", value: "hoạt động", label: "Hoạt động học viên" },
  { slug: "du-hoc", value: "du học", label: "Du học" },
];

/** Tham số trên URL: /tin-tuc?danh-muc=tuyen-sinh */
export const CATEGORY_PARAM = "danh-muc";

export function categoryBySlug(slug: string | null | undefined): PostCategory | null {
  if (!slug) return null;
  return POST_CATEGORIES.find((item) => item.slug === slug) ?? null;
}

export function categoryByValue(value: unknown): PostCategory | null {
  if (typeof value !== "string" || !value.trim()) return null;
  // Trang quản trị có thể lưu tiếng Việt dạng NFD (tổ hợp dấu rời) → so chuỗi thô sẽ hụt im lặng
  const canonical = value.normalize("NFC").trim().toLowerCase();
  return POST_CATEGORIES.find((item) => item.value === canonical) ?? null;
}

/** Đường dẫn danh sách tin đã lọc; không truyền gì = tất cả bài */
export function categoryPath(slug?: string | null): string {
  return slug ? `/tin-tuc?${CATEGORY_PARAM}=${slug}` : "/tin-tuc";
}

/**
 * Lọc sẵn danh sách bài đã nhúng trong HTML tạo trước theo danh mục đang xem.
 *
 * HTML tạo trước sinh theo ĐƯỜNG DẪN nên `/tin-tuc` và `/tin-tuc?danh-muc=du-hoc` dùng chung một
 * file, đều chứa 10 bài mới nhất chưa lọc. Nếu cứ hiện thẳng, ai mở link danh mục được chia sẻ sẽ
 * thấy 10 bài sai rồi mới nhảy về đúng. Lọc ngay trên dữ liệu đã có thì lần vẽ đầu đã đúng danh
 * mục — ít bài hơn danh sách thật, nhưng không có bài nào sai — rồi bản đầy đủ từ API thay vào.
 */
export function filterByCategory<T>(posts: readonly T[], category: PostCategory | null): T[] {
  if (!category) return [...posts];
  // Không ràng buộc T phải có `category`: ràng buộc vào thì kiểu thật của bài viết bị thu hẹp
  // còn mỗi trường đó, và mọi chỗ đọc title/slug/image phía sau sẽ đỏ.
  return posts.filter((post) => categoryByValue((post as { category?: unknown })?.category)?.slug === category.slug);
}
