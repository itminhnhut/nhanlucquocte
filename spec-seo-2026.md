# Spec: SEO 2026: tốc độ, từ khoá, prerender body, hiển thị trên AI

Nguồn: `docs/adr/2026-09-22-tech-seo-audit.md`. Spec này **thay cho Step 5** (chưa làm) của `spec.md`; phần việc của Step 5 được gộp vào Step 5 và Step 6 bên dưới.

## 1. Problem

- **Body rỗng trong HTML.** Cả 25 URL chỉ có `<head>`, body là `<div id="root"></div>`.
  - Bot của ChatGPT, Perplexity, Claude và Cốc Cốc không thấy nội dung nào.
  - Google phải render JS nên index chậm.
- **Tốc độ mobile thấp.** Trang chi tiết đạt 43–49 điểm, LCP 6–9 giây, CLS 0,83–0,96. Trang chủ tải 4,8MB.
- **Nội dung và meta sai hoặc yếu:**
  - Còn chữ "đại học/cao đẳng".
  - Meta description ghi ngày khai giảng đã qua.
  - 5 title dài quá 60 ký tự.
  - H1 trang ngành viết hoa toàn bộ và thiếu từ khoá.
  - Số liệu và địa chỉ không thống nhất giữa các trang.
- **Thương hiệu dễ bị nhầm** với VAS, Việt Úc Nghệ An, Bách Khoa Việt Úc, VAAC (44 Nguyễn Thị Minh Khai).
- **Slug cũ trả 200** mà không có meta. Chưa có IndexNow.

## 2. Requirements

**Must have:**

- Địa chỉ chuẩn ở mọi nơi: **402 Nguyễn Thị Minh Khai, Phường Bàn Cờ (Quận 3 cũ), TP. Hồ Chí Minh**. Meta description được viết tắt "P. Bàn Cờ (Q3 cũ)".
- Nội dung đúng bậc trung cấp. Không còn chữ "đại học/cao đẳng" (trừ chỗ nói về liên thông) và không gợi ý "du học".
- **Title ≤ 60 ký tự:**
  - Hậu tố ngắn "| Trường Việt Úc".
  - Bài tin không có hậu tố.
  - Theo bảng đề xuất trong ADR, mục 2.
- Description ≤ 160 ký tự. Chỉ ghi ngày khai giảng khi ngày đó **còn ở tương lai**.
- **H1 trang ngành:** "<Tên ngành chuẩn> tại TPHCM", không viết hoa toàn bộ. Đoạn mở đầu có từ khoá chính, thay cho "KHAI GIẢNG NGÀY…".
- **CLS < 0,1** trên trang chi tiết ngành và chi tiết tin, đo bằng Lighthouse mobile.
- Mọi `<img>` do code render có `width`/`height` (hoặc `aspect-*`), `alt` có nghĩa, và `loading="lazy"` trừ ảnh LCP. Bỏ `user-scalable=no`.
- **Code splitting theo route.** Bundle của trang chủ nhỏ hơn bundle hiện tại (564KB), đo bằng `ls dist/assets`.
- Ảnh tĩnh trang chủ nhẹ hơn: ảnh intro ≤ 100KB mỗi file. Xoá `campus-*.png` không dùng tới. Preload ảnh hero chỉ có ở trang chủ.
- **nginx:**
  - 301 từ `…cham-soc-sac-ep` → `…cham-soc-sac-dep` và `…ieu-duong` → `…dieu-duong`.
  - Header `Cache-Control` không bị lặp.
- **Prerender body:** HTML tạo sẵn của 25 URL chứa H1, nội dung chính và link nội bộ, và hydrate lại không lỗi. Kiểm tra: `curl -A OAI-SearchBot <url>` phải thấy nội dung.
- **IndexNow:** mỗi lần generate thành công thì gửi danh sách URL đã thay đổi. Key đọc từ env, file key được phục vụ ở thư mục gốc site.
- **Schema thương hiệu:** thêm `alternateName`, `foundingDate` 2007, `sameAs` (khi có link). Trang About có đoạn phân biệt trường với các đơn vị trùng tên.
- Xoá code chết: `StudyAbroadSection.jsx`, `react-select`, `react-day-picker`, sau khi kiểm tra bằng graphify.

**Out of scope** (không làm trong repo này, đã liệt kê trong ADR mục 6):

- **Backend / kho ảnh:** chuyển WebP, nhiều kích cỡ, `Cache-Control` cho ảnh upload, nén response API.
- **Sửa trong CMS:**
  - Xoá chữ "Học Viện Tú Tài".
  - Sửa địa chỉ "Phường 5" trong 16 bài.
  - Thêm alt ảnh và H2.
  - Sửa 2 link hỏng.
  - Sửa ảnh `//:0`.
- **Nội dung mới cần dữ liệu từ trường:** trang học phí, làm dày các trang ngành mỏng.
  (Trang 9+, landing theo vị trí và blog hướng nghiệp đã làm dạng bài tĩnh ở `/cam-nang`, `src/content/guides.ts`: chỉ dùng thông tin đã có trong repo.)
- **Việc của nhà trường:** Google Business Profile, Bing Places, sửa thông tin trên edunet/topdev, xin review, video YouTube.
- 404 thật cho slug `/programs|news/<không tồn tại>`: hiện đang cố ý fallback về `spa.html` để bài mới vẫn hiện trước khi refresh. Sau khi có prerender (Step 3) sẽ xem lại.

## 3. Approach

- **Step 1, 2, 5–7 (sửa nhanh):** sửa trực tiếp `src/configs/seo.config.ts`, `src/seo/*`, các page và section, `vite.config.js`, `docker/nginx.conf`. Viết test trước trong `scripts/seo/__tests__/`, chạy bằng `npm run test:seo`.
- **Step 3 (prerender body):**
  - Mở rộng pipeline sẵn có: `sitemap-server` → `generateSeoFiles` → `writePages`. Pipeline này đã tải programs/news một lần và ghi HTML cho từng URL.
  - Thêm bước `renderToString` app với static router cùng dữ liệu đã tải, rồi chèn vào `<div id="root">`. Nhúng dữ liệu ban đầu `window.__INITIAL_DATA__` vào HTML.
  - Ở client: `main.jsx` dùng `hydrateRoot` khi `#root` đã có nội dung. Các page đọc dữ liệu ban đầu và chuyển sang react-query (đã có sẵn trong dependency) thay cho `useEffect`.
  - Ưu điểm: tái dùng dữ liệu, `/sitemap/refresh` và nginx `try_files` sẵn có, và nội dung CMS mới được cập nhật lúc chạy mà không cần build lại.
  - Không dùng React Router framework mode vì prerender của nó chạy lúc build, trong khi bài CMS mới cần hiện ngay sau khi refresh. Cũng không dùng Vike vì phải đổi toàn bộ routing.
  - Làm trong **worktree** `experiment/prerender-body` vì rủi ro cao.
- **Step 4 (IndexNow):** gọi trong `generateSeoFiles` sau khi ghi file. So sánh sitemap mới với cũ, chỉ gửi URL mới hoặc đã đổi. Lỗi thì chỉ log, không làm hỏng quá trình generate.

## 4. Impact Analysis

- **Files thay đổi:**
  - `src/configs/seo.config.ts`, `src/configs/appConfig.ts`
  - `src/seo/{pageMeta,programCopy,schema}.ts`
  - `src/pages/*`, `src/sections/{Intro,Hero,Programs,Register,Partners}Section.jsx`, `src/components/Header.jsx`
  - `src/router.jsx`, `src/main.jsx`
  - `index.html`, `vite.config.js`, `package.json`
  - `scripts/seo/*`, `scripts/sitemap-server.js`, `scripts/build-server.mjs`
  - `docker/nginx.conf`, `docker/env.sh`
  - `public/images/*`
- **Public API thay đổi:** không. Backend API không đổi; props của `Seo` giữ nguyên.
- **Breaking change:**
  - Không có về chức năng.
  - Title và description thay đổi trên SERP, nên thứ hạng có thể dao động vài tuần.
  - URL không đổi, ngoại trừ 2 redirect 301.

## 5. Test Strategy

- **Unit tests** (`node --test` qua esbuild):
  - Độ dài title và description của mọi trang.
  - Không ghi ngày đã qua.
  - Chuỗi địa chỉ chuẩn.
  - Không chứa "đại học" hay "du học".
  - H1 builder.
  - Schema có `alternateName` và `foundingDate`.
  - Prerender: HTML có H1 và nội dung, dữ liệu ban đầu được escape (chống XSS).
  - IndexNow: tính diff URL, API lỗi không làm vỡ generate.
- **Integration:** `npm run build` rồi chạy `sitemap-server` với API thật. `curl` 25 URL, kiểm tra từng trang có H1, số từ lớn hơn 0 và link nội bộ.
- **Manual:**
  - Lighthouse mobile cho 5 trang, so với bảng trong ADR mục 1. Mục tiêu CLS < 0,1, điểm mobile ≥ 75.
  - Console trình duyệt không có lỗi hydration.
  - `curl -I` 2 slug cũ phải trả 301.
  - Sau khi deploy: PageSpeed, Rich Results Test, Bing URL Inspection.

## 6. Implementation Steps

Mỗi step là 1 commit và phải pass test trước khi sang step tiếp theo.

Thứ tự ưu tiên theo 3 mục tiêu (user chốt 2026-09-22): **Google index nhanh**, **ChatGPT tìm thấy**, **PageSpeed tăng**. Prerender đưa lên trước vì cùng lúc giải quyết cả 3 mục tiêu: bot đọc được nội dung, trang có sẵn nội dung nên không còn skeleton gây CLS, và LCP không phải chờ API.

- [x] **Step 1: Sửa nội dung trong code**
  - Sửa "đại học" / "sinh viên" / "du học".
  - Thống nhất địa chỉ.
  - Alt ảnh đối tác và slider.
  - Bỏ số liệu mâu thuẫn.
  - Sửa ngành không có thật trong phần cảm nhận học viên.
- [x] **Step 2: Meta và heading (từ khoá)**
  - Hậu tố title ngắn; bỏ hậu tố ở bài tin.
  - Title và description theo ADR mục 2.
  - Chỉ ghi ngày khai giảng khi còn ở tương lai.
  - H1 và đoạn mở đầu trang ngành.
  - Sửa thứ tự heading ở trang chủ.
  - Trang chủ link đủ 16 ngành.
- [x] **Step 3: Prerender body** (worktree `experiment/prerender-body`; gộp luôn nén ảnh hero + intro và lazy-load ảnh vì cần để trang chủ không chậm đi)
  - 3a: Chuyển các page sang react-query và nhận dữ liệu ban đầu.
  - 3b: `renderToString` trong `writePages` và `hydrateRoot` ở client.
  - 3c: Preload ảnh bìa trang chi tiết.
- [x] **Step 4: Index nhanh** (`lastmod` bỏ: API không trả `updatedAt`; link `sameAs` Facebook/YouTube/Google Business chờ trường cung cấp — điền ở `appConfig.officialProfiles`)
  - Gửi IndexNow trong generate, kèm file key.
  - `lastmod` trong sitemap (nếu API có `updatedAt`).
  - Schema thương hiệu: `alternateName`, `foundingDate`, `sameAs`; đoạn phân biệt thương hiệu trên trang About.
- [x] **Step 5: CLS và ảnh** (phần còn lại sau prerender)
  - Skeleton đúng layout (khi chuyển trang ở client).
  - `aspect-*`, `width`/`height`, `loading="lazy"`, `fetchpriority`.
  - Kích thước logo.
  - Bỏ `user-scalable=no`.
- [x] **Step 6: Bundle và ảnh tĩnh** (mọi trang lazy kể cả trang chủ để Swiper không tải ở trang khác; CSS Swiper giữ trong stylesheet chính; bundle chung 24KB + react 225KB + vendor 114KB thay cho 564KB)
  - Lazy load theo route; tách Swiper ra chunk riêng.
  - Resize ảnh intro, nén ảnh nền trang Register, xoá `campus-*.png`.
  - ~~Chỉ preload hero ở trang chủ~~ (đã làm sớm, commit riêng).
  - Xoá code chết.
- [x] **Step 7: nginx** (301 chỉ khi HTML slug cũ đã bị xoá, tức admin đã sửa slug; trước đó slug cũ vẫn là trang thật trong sitemap)
  - 301 cho 2 slug cũ.
  - Gộp header `Cache-Control`.
  - Inline `env-config.js`.

## 7. Risks

- **Hydration mismatch** (Step 3): dữ liệu lúc chạy khác dữ liệu lúc prerender, hoặc có code dùng `window` lúc render. Cách giảm rủi ro: nhúng đúng dữ liệu đã dùng để render, và chặn code chỉ chạy ở client bằng `useEffect`.
- **Generate chậm hơn:** `renderToString` 25 trang lúc container start, dự kiến vài giây. `/sitemap/refresh` hiện có timeout 120 giây.
- **Swiper hoặc thư viện khác không chạy được trên server:** thay bằng placeholder khi render ở server.
- **Thứ hạng dao động** sau khi đổi title và H1.
- **IndexNow:** không commit key vào repo, chỉ để trong env. Gửi quá nhiều thì bị Bing giới hạn, nên chỉ gửi phần diff.
- **Chờ trường xác nhận:** số liệu (Step 1), link `sameAs` (Step 4). Nếu chưa có thì tạm bỏ số liệu, không bịa.
- **Ảnh CMS** vẫn nặng cho tới khi backend xử lý. LCP trang tin chỉ cải thiện một phần từ phía frontend.
