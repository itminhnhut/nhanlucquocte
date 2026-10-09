// Tiện ích xử lý HTML nội dung từ CMS trước khi render.
import appConfig from "../configs/appConfig";
import { API_URL, EXTRA_IMAGE_HOSTS } from "./../configs/env";
import { CONTENT_IMAGE_SIZES } from "../content/contentImageSizes";

/**
 * Hạ <h1> trong nội dung CMS xuống <h2>: mỗi trang chỉ nên có 1 h1 (tiêu đề trang),
 * nội dung bài/ngành chèn thêm h1 sẽ làm Google khó xác định chủ đề chính.
 */
export function demoteH1(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<(\/?)h1(?=[\s>])/gi, "<$1h2");
}

/**
 * Ảnh trong nội dung CMS nằm dưới phần đầu trang → tải khi sắp cuộn tới (loading="lazy"),
 * để ảnh chính (LCP) không phải tranh băng thông. Giữ nguyên ảnh đã tự chọn loading.
 */
export function lazyLoadImages(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<img\b(?![^>]*\sloading=)/gi, '<img loading="lazy" decoding="async"');
}

/** Ảnh trong bài CMS thiếu alt → gắn alt theo tiêu đề bài (ảnh không alt vừa hại SEO vừa hại
 *  người dùng trình đọc màn hình). Chỉ thêm khi thẻ img chưa có alt. */
export function fillMissingImageAlt(html: unknown, title: unknown): string {
  if (typeof html !== "string") return "";
  const label = String(title ?? "").replace(/"/g, "").trim();
  if (!label) return html;
  return html.replace(/<img\b(?![^>]*\salt=)/gi, `<img alt="${label}"`);
}

/**
 * Host được phép giữ ảnh trong bài.
 *
 * PHẢI gồm cả host của API: ảnh nhân viên upload qua trang quản trị được lưu ở `/admin/uploads`
 * của backend nên trả về URL trên tên miền API, KHÔNG phải trungcapnhanlucquocte.vn. Thiếu host
 * này là web xoá sạch ảnh do chính nhà trường đăng.
 * Ảnh ở CDN hay tên miền lưu trữ riêng thì khai thêm bằng biến VITE_IMAGE_HOSTS.
 */
function allowedImageHosts(): Set<string> {
  const hosts = [appConfig.domain, API_URL, ...EXTRA_IMAGE_HOSTS.split(",")]
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      try {
        return new URL(value.includes("//") ? value : `https://${value}`).host;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
  return new Set(hosts);
}

/**
 * Bỏ ảnh trong bài CMS được chèn bằng đường dẫn tới website KHÁC.
 *
 * Rà nội dung ngày 09/10/2026: 36/51 ảnh trong bài không phải của trường —
 *   16 ảnh thumbnail Google (encrypted-tbn0.gstatic.com),
 *   ảnh lấy từ website trường khác (vhnthcm.edu.vn, hcmcc.edu.vn, hueic.edu.vn, awe.edu.vn, nau.edu.vn),
 *   5 ảnh Facebook CDN (fbcdn.net — link có hạn, hỏng sau một thời gian).
 * Giữ lại thì: dùng ảnh không có quyền, để lộ địa chỉ website trường khác ngay trong mã trang,
 * ảnh hỏng khi bên kia chặn hoặc đổi link, và gây xê dịch bố cục vì không biết kích thước.
 * Phần chữ của bài giữ nguyên, chỉ gỡ thẻ ảnh.
 *
 * Khi nhà trường gửi ảnh thật thì tải về public/images và chèn lại bằng đường dẫn của web này.
 */
export function dropForeignImages(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /src="([^"]*)"/i.exec(tag)?.[1] ?? /src='([^']*)'/i.exec(tag)?.[1] ?? "";
    if (!src) return "";
    if (!/^https?:\/\//i.test(src)) return tag;
    try {
      return allowedImageHosts().has(new URL(src).host) ? tag : "";
    } catch {
      return "";
    }
  });
}

/**
 * Bỏ thẻ tiêu đề rỗng trong bài CMS (ví dụ <h3>&nbsp;</h3> do người soạn gõ thừa).
 * Tiêu đề rỗng làm vỡ thứ bậc heading — trang nhảy thẳng từ H1 xuống H3 — và lọt vào mục lục
 * thành một dòng trắng không bấm được.
 */
export function dropEmptyHeadings(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (match, _level, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim();
    return text ? match : "";
  });
}

/**
 * Điền width/height cho ảnh trong bài theo kích thước thật đã đo (contentImageSizes.ts).
 * Thiếu hai thuộc tính này, trình duyệt không biết chừa bao nhiêu chỗ nên chữ bị đẩy xuống khi ảnh
 * tải xong (Cumulative Layout Shift). Ảnh không có trong bảng thì giữ nguyên, không đoán tỉ lệ.
 */
export function addImageDimensions(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    if (/\swidth=/i.test(tag) && /\sheight=/i.test(tag)) return tag;
    const src = /src="([^"]*)"/i.exec(tag)?.[1] ?? /src='([^']*)'/i.exec(tag)?.[1] ?? "";
    if (!src) return tag;
    // Nội dung CMS có chỗ ghi thừa dấu gạch chéo (…vn//img_data/…) → chuẩn hoá trước khi tra bảng
    const path = src.replace(/^https?:\/\/[^/]+/i, "").replace(/\/{2,}/g, "/");
    const found = CONTENT_IMAGE_SIZES[path];
    if (!found) return tag;
    return tag.replace(/<img\b/i, `<img width="${found.width}" height="${found.height}"`);
  });
}

/**
 * Dọn khung rỗng còn lại sau khi gỡ ảnh mượn: thẻ <a> chỉ bọc ảnh nay thành link rỗng, và đoạn
 * <p> chỉ chứa ảnh nay thành đoạn trắng.
 *
 * Quan trọng nhất là thẻ <a> rỗng: 6 thẻ trong bài trỏ sang vhnthcm.edu.vn — gỡ ảnh mà để lại thì
 * trang vẫn còn liên kết sang website trường khác, lại là liên kết không ai thấy để bấm.
 * Chạy lặp vì khung có thể lồng nhau (<p><a><img></a></p>).
 */
export function dropEmptyWrappers(html: unknown): string {
  if (typeof html !== "string") return "";
  const EMPTY = /<(a|p|figure|figcaption|strong|em|span)\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi;
  let out = html;
  for (let pass = 0; pass < 5; pass += 1) {
    const next = out.replace(EMPTY, "");
    if (next === out) break;
    out = next;
  }
  return out;
}

/**
 * Kéo bậc tiêu đề trong bài CMS lên cho liền mạch: bài nào bắt đầu bằng <h3> (người soạn chọn cỡ
 * chữ theo mắt chứ không theo bậc) thì nâng cả bài lên một bậc, để trang đi H1 → H2 → H3 thay vì
 * nhảy từ H1 xuống thẳng H3. Google và trình đọc màn hình dựa vào bậc này để hiểu bố cục bài.
 *
 * Chạy SAU demoteH1 (h1 trong bài đã thành h2) và chỉ nâng khi bài không có h2 nào.
 */
export function normalizeHeadingLevels(html: unknown): string {
  if (typeof html !== "string") return "";
  const levels = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  if (!levels.length) return html;
  const top = Math.min(...levels);
  if (top <= 2) return html;
  const lift = top - 2;
  // Nâng từ bậc nhỏ nhất trước (h3 → h2 rồi h4 → h3), tránh nâng chồng lên nhau
  let out = html;
  for (let level = top; level <= 6; level += 1) {
    const to = level - lift;
    out = out.replace(new RegExp(`<(/?)h${level}(?=[\\s>])`, "gi"), `<$1h${to}`);
  }
  return out;
}
