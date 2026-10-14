#!/bin/sh
# ─────────────────────────────────────────────────────────────────────────────
# Runtime Environment Variable Injection
#
# Script này chạy khi Nginx container khởi động.
# Nó thay thế các placeholder __VAR__ trong file HTML đã build bằng
# giá trị thực từ biến môi trường Docker/EasyPanel.
#
# Cách dùng với EasyPanel:
#   VITE_API_URL=https://api.yoursite.com
#   VITE_APP_URL=https://yoursite.com
# ─────────────────────────────────────────────────────────────────────────────

set -e

HTML_FILE="/usr/share/nginx/html/index.html"
JS_ENV_FILE="/usr/share/nginx/html/env-config.js"

echo "[env-inject] Injecting runtime environment variables..."

# ── Giá trị mặc định (fallback nếu EasyPanel không set) ──────────────────────
# API của trường. EasyPanel set biến môi trường thì giá trị đó thắng; trống thì website không có
# nội dung động (sitemap và trang đã tạo được giữ nguyên, xem scripts/seo/content.js).
VITE_API_URL="${VITE_API_URL:-https://truongdaynghe-api.x2ldh2.easypanel.host/api}"
VITE_APP_URL="${VITE_APP_URL:-https://trungcapnhanlucquocte.vn}"
# Host ảnh ngoài web và API (CDN, bucket lưu trữ), phân tách bằng dấu phẩy. Thiếu khai ở đây thì
# ảnh trong bài trỏ tới host đó bị coi là ảnh mượn và bị gỡ — xem dropForeignImages (src/utils/html.ts).
VITE_IMAGE_HOSTS="${VITE_IMAGE_HOSTS:-truongdaynghe-rustfs.x2ldh2.easypanel.host}"

# ── Ghi file JS chứa window.__ENV__ ──────────────────────────────────────────
# File này được inject vào <head> của index.html tại runtime.
# App đọc window.__ENV__ thay vì import.meta.env (vốn bị bake lúc build).
cat > "$JS_ENV_FILE" <<EOF
window.__ENV__ = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_APP_URL: "${VITE_APP_URL}",
  VITE_IMAGE_HOSTS: "${VITE_IMAGE_HOSTS}"
};
EOF

echo "[env-inject] Generated env-config.js:"
cat "$JS_ENV_FILE"

# ── Nhúng thẳng window.__ENV__ vào <head> của index.html ────────────────────
# Script inline thay cho <script src="/env-config.js"> (chặn render ~270ms trên mobile).
# Nằm trọn 1 dòng giữa 2 marker → lần khởi động sau xoá đi ghi lại đúng env mới.
# env-config.js vẫn được ghi cho HTML cũ còn trong cache trình duyệt.
ENV_MARKER="<!-- runtime-env -->"
ENV_SCRIPT="${ENV_MARKER}<script>window.__ENV__={VITE_API_URL:\"${VITE_API_URL}\",VITE_APP_URL:\"${VITE_APP_URL}\",VITE_IMAGE_HOSTS:\"${VITE_IMAGE_HOSTS}\"};</script><!-- \/runtime-env -->"
sed -i -e "/${ENV_MARKER}/d" -e '/<script src="\/env-config.js"><\/script>/d' "$HTML_FILE"
sed -i "s|<head>|<head>\n    ${ENV_SCRIPT}|" "$HTML_FILE"
echo "[env-inject] Inlined window.__ENV__ into index.html"

# ── SEO: HTML từng trang + sitemap.xml ──────────────────────────────────────
# Chạy SAU khi đã chèn env-config.js vào index.html (index.html là template).
# 1. Ghi nhanh trang tĩnh + 404.html (không gọi API) trước khi Nginx nhận request.
# 2. Server nội bộ chạy nền: tạo trang chi tiết + sitemap từ API, và phục vụ
#    https://<domain>/sitemap/refresh?key=<SITEMAP_KEY> để tạo lại khi có bài mới.
# Lỗi ở đây không được chặn Nginx khởi động. Log ghi vào stdout của PID 1 (docker logs).
SEO_SERVER="/opt/sitemap/sitemap-server.cjs"
node "$SEO_SERVER" --static-only || echo "[env-inject] ⚠️  Không ghi được trang tĩnh SEO"
# INDEXNOW_ENABLED=1: chỉ báo Bing khi chạy thật trên máy chủ, không báo khi chạy ở máy dev
INDEXNOW_ENABLED=1 VITE_API_URL="$VITE_API_URL" VITE_IMAGE_HOSTS="$VITE_IMAGE_HOSTS" nohup node "$SEO_SERVER" > /proc/1/fd/1 2>&1 &
echo "[env-inject] Started SEO server"

echo "[env-inject] Done."
