# Spec: Chuẩn hoá SEO + Structured data + Google Maps

## 1. Problem
- SPA thuần client: HTML trả về cho mọi URL giống nhau, không có title/description/OG → Facebook/Zalo
  không hiện preview, Google phải render JS mới thấy meta.
- Canonical lấy từ `window.location.href` (dính `?utm`, `#`), URL rác trả 200 (soft 404).
- Nội dung sai (ghi "đại học và sau đại học", từ khoá UTM), title/description quá dài.
- Structured data thiếu (logo, địa chỉ chi tiết, Breadcrumb, Course list) và có lỗi (`timeRequired`).
- Địa chỉ ghi "Phường Bến Thành, Quận 1" — thực tế 402 Nguyễn Thị Minh Khai thuộc Q3 cũ (nay Phường Bàn Cờ).

## 2. Requirements

**Must have:**
- Mỗi URL (trang tĩnh, `/programs/:slug`, `/news/:slug`, 404) có HTML riêng với title, description,
  canonical tuyệt đối, OG/Twitter, robots, JSON-LD — tạo lại khi container start và khi mở `/sitemap/refresh`.
- URL không tồn tại → HTTP 404 + `noindex`; `/search` → `noindex`.
- Title dạng "Tên trang | Vietnam Australia Vocational College - Trường Việt Úc", description ≤ 160 ký tự.
- Nội dung đúng bậc **trung cấp**; địa chỉ "402 Nguyễn Thị Minh Khai, Phường Bàn Cờ, TP. Hồ Chí Minh".
- Schema: EducationalOrganization (logo, PostalAddress đầy đủ, contactPoint, hasMap), BreadcrumbList,
  ItemList Course cho `/programs`, Article sửa publisher/logo.

**Out of scope:**
- SSR/hydration toàn bộ nội dung trang (chỉ render sẵn phần `<head>`).
- Tạo/xác minh Google Business Profile (user tự làm).
- Giờ làm việc, toạ độ, Facebook/YouTube: chưa có dữ liệu → để trống, bổ sung sau.

## 3. Approach
- Logic meta/schema dùng chung ở `src/seo/` (TS thuần, không DOM) — React pages và server đều dùng.
- `scripts/sitemap-server.js` được bundle bằng esbuild (đã có sẵn qua Vite) để import được `src/seo`.
  Mỗi lần generate: lấy programs/news 1 lần → ghi `sitemap.xml` + `<path>/index.html` từ template
  `index.html` (block meta giữa `<!--seo:start-->…<!--seo:end-->`, idempotent). Thẻ có `data-rh="true"`
  để react-helmet-async thay thế khi app chạy, không bị trùng.
- nginx: `try_files $uri $uri/index.html`; `/programs/*`, `/news/*` chưa generate → fallback `/index.html`
  (tránh 404 cho bài mới trước khi refresh); còn lại → `/404.html` với status 404.

## 4. Impact Analysis
- Files thay đổi: `src/seo/*` (mới), `src/components/Seo.jsx`, `src/configs/*`, các page, `scripts/*`,
  `Dockerfile`, `docker/nginx.conf`, `docker/env.sh`, `public/robots.txt`, `index.html`, `package.json`.
- Public API thay đổi: không (props `Seo` chỉ thêm optional).
- Breaking change: không.

## 5. Test Strategy
- Unit tests (`node --test`, bundle qua esbuild): build meta từng loại trang, inject head idempotent,
  escape HTML, sitemap.
- Manual: `npm run build` + chạy server local → kiểm tra HTML `/`, `/programs/<slug>`, 404;
  sau deploy: Rich Results Test, Facebook Sharing Debugger, `curl -I` URL rác → 404.

## 6. Implementation Steps
- [x] Step 1: HTML tạo sẵn cho từng URL + nginx 404 thật (`src/seo`, server, nginx, Dockerfile)
- [x] Step 2: Kỹ thuật — trang 404 React, `Seo.jsx` (canonical, noindex, og:type), ảnh OG JPG, sitemap routes, robots.txt (lastmod: API list chưa có updatedAt → bỏ qua)
- [x] Step 3: Nội dung — title/description, trung cấp, bỏ UTM, h1 trang chủ, hạ h1 trong CMS
- [x] Step 4: Structured data — EducationalOrganization + địa chỉ mới, BreadcrumbList, Course list, Article, timeRequired
- [ ] Step 5: Lỗi nhỏ — viewport, width/height/lazy ảnh, `<a>` trong `<button>`, XSS Search, API mặc định utmvn

## 7. Risks
- API lỗi lúc container start → không có HTML chi tiết; nginx fallback `index.html` nên web vẫn chạy.
- Template bị ghi đè (`/index.html` là trang chủ) → phải strip block cũ trước khi inject.
- `env.sh` inject `env-config.js` vào `index.html` trước khi server chạy → mọi trang sinh ra đều có script này.
- Địa chỉ mới cần trường xác nhận; sai địa chỉ ảnh hưởng Google Maps.
