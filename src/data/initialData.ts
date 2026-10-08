// Dữ liệu API đã nhúng sẵn trong HTML tạo trước (script#__INITIAL_DATA__).
// Chỉ dùng cho lần render đầu (server render + trình duyệt hydrate) để 2 bên ra cùng HTML;
// sau khi hydrate xong thì tắt → các trang mở sau đó gọi API như bình thường.
import { useState } from "react";

export const INITIAL_DATA_SCRIPT_ID = "__INITIAL_DATA__";

export type InitialData = Record<string, unknown>;

let store: InitialData = {};
let isActive = false;

export function setInitialData(data: InitialData): void {
  store = data;
  isActive = true;
}

export function endInitialData(): void {
  store = {};
  isActive = false;
}

export function readInitialData<T>(key: string): T | undefined {
  return isActive ? (store[key] as T | undefined) : undefined;
}

/** Giá trị nhúng sẵn tại lần mount đầu tiên của component (không đổi về sau) */
export function useInitialData<T>(key: string): T | undefined {
  const [value] = useState(() => readInitialData<T>(key));
  return value;
}

export const initialDataKeys = {
  programs: "programs",
  firstPostsPage: "posts:1",
  /** Bài thuộc danh mục "du học" (trang /du-hoc) */
  studyAbroadPosts: "posts:du-hoc",
  program: (slug: string) => `program:${slug}`,
  relatedPosts: (programSlug: string) => `relatedPosts:${programSlug}`,
  post: (slug: string) => `post:${slug}`,
  /** 5 bài mới nhất (cột phải trang bài) */
  latestPosts: (slug: string) => `latestPosts:${slug}`,
  /** Bài cũ hơn + mới hơn bài đang xem (khối "Bài viết khác") */
  nearbyPosts: (slug: string) => `nearbyPosts:${slug}`,
  /** Thời điểm server render (ISO) — phần phụ thuộc "hôm nay" hydrate đúng như lúc render */
  renderedAt: "renderedAt",
};
