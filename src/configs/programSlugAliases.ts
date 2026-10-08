// Khi import bài ngành vào database, nếu có slug cũ cần giữ (đổi tên bài, sửa lỗi gõ) thì khai
// báo cặp slug ở đây: trang ngành nhận 404 với slug này sẽ tự thử slug còn lại, nên link cũ
// vẫn chạy. Hiện chưa có cặp nào.
const SLUG_PAIRS: ReadonlyArray<readonly [string, string]> = [];

export function alternateProgramSlug(slug: string): string | null {
  const pair = SLUG_PAIRS.find(([oldSlug, newSlug]) => slug === oldSlug || slug === newSlug);
  if (!pair) return null;
  return pair[0] === slug ? pair[1] : pair[0];
}
