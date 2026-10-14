// Tiện ích xử lý HTML nội dung từ CMS trước khi render.
import appConfig from "../configs/appConfig";
import { readEnv } from "./../configs/env";
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

/**
 * Dấu hiệu alt bị dán từ kết quả tìm ảnh Google chứ không phải người viết tự mô tả ảnh.
 *
 * Rà dữ liệu thật (API ngày 15/10/2026): 21/22 giá trị alt trong bài là tiêu đề kết quả tìm
 * ảnh, giữ nguyên cả dấu "..." bị cắt, và nêu tên đơn vị khác — "Tuyển Sinh Hueic",
 * "CỔNG TUYỂN SINH UEH", "Học viện Nông nghiệp Việt Nam: … | Đảng Cộng sản Việt Nam",
 * "Cao đẳng kế toán doanh nghiệp - Cao ...", "VIỆC LÀM NGÀNH F&B | Facebook".
 * Để nguyên là trang của trường đi quảng cáo cho nơi khác, ngay trong thuộc tính mà Google và
 * trình đọc màn hình đều đọc. Thay bằng alt mô tả theo tiêu đề trang.
 */
// Chỉ nhận những dấu hiệu CHỈ xuất hiện ở chữ dán từ nơi khác. Không chặn theo từ như
// "cao đẳng" hay "đại học": ngành liên thông của trường vốn nói về đại học, chặn cả từ đó là
// thay oan alt mô tả đúng.
const BORROWED_ALT_PATTERNS: readonly RegExp[] = [
  /\.{3}\s*$|…\s*$/u, // đuôi "..." của tiêu đề bị Google cắt giữa câu
  /\|/u, // dấu | phân cách "tiêu đề | tên site"
  /\b(hueic|ueh|facebook|youtube|tiktok|shopee|wikipedia)\b/iu, // tên site khác
  /\btop\s*\d+\b/iu, // tiêu đề bài xếp hạng: "TOP 26 Địa Chỉ…"
];

/** Alt này do người viết mô tả ảnh, hay dán từ nơi khác? */
export function isBorrowedAlt(alt: string): boolean {
  const text = alt.trim();
  if (!text) return false;
  // Nhắc đúng tên trường thì giữ
  if (/nhân lực quốc tế/iu.test(text)) return false;
  return BORROWED_ALT_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Ảnh trong bài CMS thiếu alt → gắn alt theo tiêu đề bài (ảnh không alt vừa hại SEO vừa hại
 * người dùng trình đọc màn hình). Alt dán từ nơi khác cũng bị thay bằng alt theo tiêu đề.
 */
export function fillMissingImageAlt(html: unknown, title: unknown): string {
  if (typeof html !== "string") return "";
  // Nhãn đi vào thuộc tính HTML nên phải escape; và dùng hàm thay thế chứ không dùng chuỗi,
  // vì `$&` trong chuỗi thay thế của String.replace bị nở thành phần vừa khớp.
  const label = String(title ?? "")
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "");
  if (!label) return html;
  // Bắt cả nháy kép, nháy đơn và không nháy: CMS sinh cả ba, mà chỉ bắt nháy kép thì thẻ có
  // alt='…' bị coi là thiếu alt → chèn thêm alt thứ hai, trình duyệt lấy cái ĐẦU nên alt thật
  // của người viết bị thay oan.
  const ALT_ATTR = /\salt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const found = ALT_ATTR.exec(tag);
    if (!found) return tag.replace(/<img\b/i, () => `<img alt="${label}"`);
    const alt = found[1] ?? found[2] ?? found[3] ?? "";
    // alt="" là người soạn bỏ trống ô, không phải khai ảnh trang trí: 22/45 ảnh trong thân bài
    // đang như vậy. Điền nhãn theo tiêu đề để Google và trình đọc màn hình có gì mà đọc.
    if (alt.trim() && !isBorrowedAlt(alt)) return tag;
    return tag.replace(ALT_ATTR, () => ` alt="${label}"`);
  });
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
  // Đọc env TẠI ĐÂY chứ không dùng hằng số đọc lúc nạp module: tiến trình tạo HTML sẵn nạp module
  // trước khi chạy, nếu đọc sớm thì API_URL rỗng và ảnh của trường bị gỡ khỏi HTML.
  const hosts = [appConfig.domain, readEnv("VITE_API_URL"), ...readEnv("VITE_IMAGE_HOSTS").split(",")]
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
function isAllowedUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url)) return true; // đường dẫn tương đối = của web này
  try {
    return allowedImageHosts().has(new URL(url).host);
  } catch {
    return false;
  }
}

/**
 * srcset của bài lấy từ CMS vẫn trỏ ảnh gốc ở website khác, kể cả khi src đã được chuyển về
 * bucket của trường. Có srcset kèm `sizes` là trình duyệt CHỌN TỪ srcset và BỎ QUA src —
 * tức ảnh của nơi khác vẫn được tải thật trên mọi lần xem trang.
 * Thấy một ứng viên lạ thì bỏ cả srcset và sizes, trình duyệt quay về dùng src đã được phép.
 */
function dropForeignSrcset(tag: string): string {
  const found = /\ssrcset=("[^"]*"|'[^']*')/i.exec(tag);
  if (!found) return tag;
  const candidates = found[1].slice(1, -1).split(",");
  const hasForeign = candidates.some((part) => {
    const url = part.trim().split(/\s+/)[0];
    return url ? !isAllowedUrl(url) : false;
  });
  if (!hasForeign) return tag;
  return tag
    .replace(/\ssrcset=("[^"]*"|'[^']*')/i, "")
    .replace(/\ssizes=("[^"]*"|'[^']*')/i, "");
}

export function dropForeignImages(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /src="([^"]*)"/i.exec(tag)?.[1] ?? /src='([^']*)'/i.exec(tag)?.[1] ?? "";
    if (!src) return "";
    if (!isAllowedUrl(src)) return "";
    return dropForeignSrcset(tag);
  });
}

/**
 * Bài lấy từ CMS còn giữ kiểu WordPress: mỗi ảnh bọc trong <a> trỏ về trang gốc ở website khác.
 * Ảnh đã chuyển về bucket của trường nhưng cái vỏ <a> thì còn, nên trang vẫn dẫn link ra
 * website đó (vừa là PR cho họ, vừa chuyển điểm liên kết sang). Thẻ <a> không có chữ, chỉ bọc
 * ảnh → bỏ vỏ, giữ ảnh. Link CÓ chữ là trích dẫn trong bài → giữ nguyên, chỉ thêm rel an toàn.
 */
export function unwrapForeignImageLinks(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs: string, inner: string) => {
    const href = /href=("([^"]*)"|'([^']*)')/i.exec(attrs);
    const url = href?.[2] ?? href?.[3] ?? "";
    if (!url || isAllowedUrl(url)) return match;
    const text = inner.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim();
    if (!text) return inner;
    if (/\brel=/i.test(attrs)) return match;
    return `<a${attrs} rel="nofollow noopener">${inner}</a>`;
  });
}

const VOID_TAGS = new Set([
  "img", "br", "hr", "input", "meta", "link", "source",
  "col", "area", "base", "embed", "param", "track", "wbr",
]);

/**
 * Đóng lại những thẻ CMS mở mà không đóng.
 *
 * Nội dung dán từ Word hay bị cắt giữa markup (vd bài ngành "Chăm sóc da" kết thúc bằng
 * `<p><span><b><span>` chưa đóng). Trình duyệt tự đóng theo luật parser HTML và kéo luôn các
 * phần tử phía sau vào trong, nên cây DOM khác cây React dựng từ cùng chuỗi đó → hydrate lệch,
 * React BỎ toàn bộ HTML tạo sẵn và render lại cả trang (lỗi #418/#423). Trang đó mất hết lợi
 * ích SEO của prerender và nội dung nháy một nhịp khi tải.
 *
 * Đóng ở cuối chuỗi là đủ: phần chữ giữ nguyên, chỉ bù thẻ đóng còn thiếu.
 */
export function closeUnclosedTags(html: unknown): string {
  if (typeof html !== "string") return "";
  const stack: string[] = [];
  const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;
  let match: RegExpExecArray | null;
  while ((match = TAG.exec(html)) !== null) {
    const [, closing, rawName, selfClosing] = match;
    const name = rawName.toLowerCase();
    if (VOID_TAGS.has(name) || selfClosing === "/") continue;
    if (!closing) {
      stack.push(name);
      continue;
    }
    // Thẻ đóng: khớp ngược lên stack, bỏ qua các thẻ bị quên đóng ở giữa
    const at = stack.lastIndexOf(name);
    if (at !== -1) stack.length = at;
  }
  if (!stack.length) return html;
  return html + stack.reverse().map((name) => `</${name}>`).join("");
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
