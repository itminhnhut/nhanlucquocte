// Báo Bing (và các công cụ dùng IndexNow) ngay khi trang mới/đổi nội dung, thay vì chờ bot quay lại.
// ChatGPT search dựa nhiều vào chỉ mục Bing → index nhanh hơn cũng giúp được ChatGPT trích dẫn.
// Key ở appConfig.indexNowKey, file xác minh public/<key>.txt (có sẵn trong bản build).
// Lỗi mạng/API chỉ ghi log — không được làm hỏng việc tạo sitemap + HTML.
import appConfig from "../../src/configs/appConfig";
import { SITE_URL, canonicalUrl } from "../../src/seo/url";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;
// Giới hạn của giao thức: tối đa 10.000 URL mỗi lần gửi
const MAX_URLS_PER_REQUEST = 10000;
const REQUEST_TIMEOUT_MS = 15000;

export function isValidIndexNowKey(key) {
  return typeof key === "string" && KEY_PATTERN.test(key);
}

async function submitBatch(urlList, key, fetchImpl) {
  const res = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  // 200/202: đã nhận. 4xx: key chưa xác minh (403), sai định dạng (422), gửi quá nhiều (429)
  if (!res.ok) throw new Error(`IndexNow trả HTTP ${res.status}`);
}

/**
 * Gửi các path đã đổi lên IndexNow.
 * @returns {Promise<{ submitted: number }>} số URL đã gửi thành công
 */
export async function notifyIndexNow(changedPaths, key = appConfig.indexNowKey, fetchImpl = fetch) {
  // Chạy ở máy dev (INDEXNOW_DISABLED=1) → không gọi API thật
  if (process.env.INDEXNOW_DISABLED === "1") {
    console.log("ℹ️  INDEXNOW_DISABLED=1 → bỏ qua IndexNow");
    return { submitted: 0 };
  }
  if (!isValidIndexNowKey(key)) {
    console.warn("⚠️  Key IndexNow sai định dạng (8–128 ký tự a-z, A-Z, 0-9, -) → bỏ qua IndexNow");
    return { submitted: 0 };
  }
  if (!changedPaths.length) return { submitted: 0 };

  const urls = changedPaths.map(canonicalUrl);
  try {
    for (let start = 0; start < urls.length; start += MAX_URLS_PER_REQUEST) {
      await submitBatch(urls.slice(start, start + MAX_URLS_PER_REQUEST), key, fetchImpl);
    }
    console.log(`✅ IndexNow: đã báo ${urls.length} URL mới/đổi`);
    return { submitted: urls.length };
  } catch (err) {
    console.warn("⚠️  IndexNow lỗi, bỏ qua (sitemap vẫn cập nhật bình thường):", err.message);
    return { submitted: 0 };
  }
}
