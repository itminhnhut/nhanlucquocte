// Ngày hiển thị "d/m/yyyy" theo giờ Việt Nam (UTC+7, không có giờ mùa hè).
// Không dùng toLocaleDateString: server tạo HTML sẵn chạy giờ UTC và có thể thiếu dữ liệu
// ICU tiếng Việt → chữ khác trình duyệt, React báo lệch khi hydrate.
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

export function formatDateVi(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  if (value === "") return "";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";
  const vietnamTime = new Date(time + VIETNAM_OFFSET_MS);
  return `${vietnamTime.getUTCDate()}/${vietnamTime.getUTCMonth() + 1}/${vietnamTime.getUTCFullYear()}`;
}
