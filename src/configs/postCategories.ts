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
  const canonical = value.trim().toLowerCase();
  return POST_CATEGORIES.find((item) => item.value === canonical) ?? null;
}

/** Đường dẫn danh sách tin đã lọc; không truyền gì = tất cả bài */
export function categoryPath(slug?: string | null): string {
  return slug ? `/tin-tuc?${CATEGORY_PARAM}=${slug}` : "/tin-tuc";
}
