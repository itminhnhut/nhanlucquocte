# Audit SEO vietuchcm.edu.vn: tốc độ, từ khoá, đối thủ, SEO 2026

- **Ngày:** 2026-09-22
- **Trạng thái:** Đề xuất, chờ duyệt. Chưa sửa code.
- **Phạm vi:** 25 URL trong sitemap (7 trang tĩnh, 16 trang ngành, 2 bài tin), đối thủ trên Google VN, xu hướng SEO 2026, và cách để ChatGPT/AI gợi ý trường.

## Tóm tắt: 5 điều cần biết

1. **Body không có trong HTML.** Cả 25 URL trả về `<div id="root"></div>` rỗng. Google render JS nên vẫn index được, nhưng chậm và không ổn định. ChatGPT, Perplexity, Claude và Cốc Cốc thì **không thấy nội dung nào**. Đây là việc lớn nhất cần làm: prerender body lúc build.
2. **Tốc độ mobile thấp vì ảnh và bố cục nhảy, không phải vì JS.**
   - Trang chi tiết: điểm 43–49, LCP 6–9 giây, CLS 0,83–0,96.
   - Ảnh CMS là PNG 565KB không có cache. Skeleton lệch kích thước so với nội dung thật.
3. **Có lỗi nội dung cần sửa ngay:**
   - Trang ngành Xây dựng chứa nguyên văn "**Học Viện Tú Tài**", tức bị chép từ trường khác.
   - Còn chữ "đại học/cao đẳng" ở trang chủ và trang liên hệ.
   - Meta description ghi ngày khai giảng đã qua.
   - Số liệu mâu thuẫn giữa các trang: 20+ hay 19 năm, 25.000 hay 40.000 học viên.
4. **Không nên nhắm từ khoá du học hay XKLĐ Úc.** Site không có dịch vụ này, agency du học chiếm hết kết quả tìm kiếm, và người tìm du học vào site sẽ thoát ngay. Thay vào đó cần tách thương hiệu khỏi VAS và Việt Úc Nghệ An.
5. **Cơ hội dễ nhất:**
   - Từ khoá theo vị trí: "trường trung cấp Quận 3 / trung tâm TPHCM". Chưa trường nào nhắm tới.
   - Các ngành ít cạnh tranh: lữ hành, hướng dẫn du lịch, tiếng Anh, nấu ăn.
   - Những trang đối thủ có mà mình chưa có: học phí công khai, trang hệ 9+, blog hướng nghiệp.

---

## 1. Tốc độ (PageSpeed)

**Cách đo:** PSI API trả 429 (hết quota ngày của key ẩn danh), nên đo bằng **Lighthouse 12 chạy local**, mỗi trang 1 lần. Chưa có dữ liệu người dùng thật (CrUX). Cần đo lại bằng PSI khi có quota hoặc API key riêng. JSON gốc lưu trong scratchpad của phiên audit.

### Điểm hiệu năng

| Trang | Mobile | Desktop | LCP (mobile) | CLS | Tổng tải |
|---|---|---|---|---|---|
| Trang chủ | 63 | 84 | 6,1 giây | 0 | 4,8 MB |
| /programs | 86 | 93 | 3,4 giây | 0 | 642 KB |
| Chi tiết ngành | **49** | 54 | 6,6 giây | **0,83** | 614 KB |
| /news | 67 | 75 | **9,3 giây** | 0 | 1,7 MB |
| Chi tiết tin | **43** | 55 | **9,4 giây** | **0,96** | 1,7 MB |

Ngưỡng đạt: LCP ≤ 2,5 giây, INP ≤ 200 ms, CLS ≤ 0,1. TBT dưới 150 ms ở mọi trang, nên INP nhiều khả năng ổn. GTM/GA đã lazy-load, ảnh hưởng không đáng kể.

### Việc cần sửa

| # | Vấn đề | Bằng chứng | Cách sửa | Tác động |
|---|---|---|---|---|
| P0 | Ảnh CMS nặng, không có cache | PNG 565KB từ `daynghevietuc-rustfs…`, `Cache-Control` không có | **Backend:** chuyển WebP/AVIF, tạo nhiều size, set `Cache-Control: public, max-age=31536000, immutable`. **Frontend:** thêm `srcset`/`sizes`, `width`/`height`, `loading="lazy"` (`NewsPage.jsx:154,219`, `NewsSection.jsx:91`, `ProgramDetailPage.jsx:379`) | LCP trang tin giảm từ 9 giây xuống khoảng 3 giây |
| P0 | CLS trang chi tiết | Skeleton `NewsDetailsPage.jsx:164`, `ProgramDetailPage.jsx:182` thấp hơn nội dung thật; ảnh `NewsDetailsPage.jsx:197` không khai kích thước | Skeleton dùng cùng grid với nội dung, đặt `min-h`, `aspect-[16/9]`, chừa chỗ cho mục lục | CLS < 0,1, điểm tăng 20–25 |
| P0 | Tải nối tiếp (waterfall) HTML → JS → API → ảnh | Resource load delay 4,3–4,9 giây; fetch trong `useEffect` (`NewsDetailsPage.jsx:67-101`) | Khi sinh HTML từng trang, chèn `<link rel="preload" as="image" fetchpriority="high">` cho ảnh bìa và nhúng sẵn dữ liệu ban đầu | LCP giảm 1,5–4 giây |
| P1 | Không tách code | `router.jsx:1-13` import tĩnh 11 trang, bundle 564KB (gzip 176KB), 47–60% không dùng | `lazy` theo route, tách Swiper ra chunk riêng | Giảm khoảng 2 giây xử lý JS trên mobile |
| P1 | Ảnh tĩnh trang chủ nặng | `public/images/intro/*.webp` 227–372KB; nền `RegisterSection.jsx:57-58` 1–2MB; `campus-*.png` 1,5–2,5MB không dùng tới | Resize intro về khoảng 800w (60–80KB), thêm lazy, xoá `campus-*.png` | Trang chủ giảm khoảng 3MB |
| P1 | Preload ảnh hero ở mọi trang | `index.html:30-37` | Chỉ chèn preload vào HTML của trang chủ | Hết tranh băng thông với ảnh LCP của các trang khác |
| P1 | API không nén | `/api/client/programs` 52KB | Bật gzip/brotli ở backend hoặc proxy | |
| P2 | Các lỗi nhỏ | `env-config.js` chặn render 270 ms; nginx chỉ có gzip; `nginx.conf:47-51` lặp `Cache-Control` và làm mất security header; logo không có kích thước (`Header.jsx:59`, `PartnersSection.jsx:42`); `user-scalable=no` (`index.html:23`) | Inline env, bật Brotli hoặc nén sẵn, gộp header, thêm kích thước ảnh, bỏ `user-scalable=no` | |

**Code chết:** `StudyAbroadSection.jsx` (thực chất là "Tra cứu điểm danh", không được import ở đâu) cùng 2 dependency `react-select` và `react-day-picker`.

---

## 2. Audit từ khoá từng trang

### Vấn đề chung toàn site

1. **Body rỗng trong HTML.** Xem thêm mục 4. Link nội bộ cũng không có trong HTML, nên việc khám phá trang chỉ dựa vào sitemap.
2. **H1 trang ngành lấy nguyên `program.title` từ CMS** (`ProgramDetailPage.jsx:203-205`). Ví dụ "TUYỂN SINH NGÀNH ĐIỀU DƯỠNG": viết hoa toàn bộ, thiếu "trung cấp" và "TPHCM". Nên dựng H1 từ `programDisplayName()` + " tại TPHCM".
3. **Đoạn mở đầu trang ngành là "KHAI GIẢNG NGÀY 07.09.2026"** (`ProgramDetailPage.jsx:130-132`), không có từ khoá.
4. **Ngày khai giảng đã qua vẫn nằm trong meta description** (`programCopy.ts:160-161`). Chỉ nên nối ngày khi ngày đó còn ở tương lai.
5. **Nội dung CMS trang ngành:**
   - Không có H2 hay H3, chỉ dùng `<p><strong>`.
   - 29/30 ảnh không có alt. Một ảnh `src="//:0"` bị hỏng (CNTT).
   - Cả 16 ngành có trường `image = None`.
6. **Nội dung chép từ trường khác:** trang `ky-thuat-xay-dung-he-trung-cap` nhắc "Học Viện Tú Tài" 3 lần.
7. **Sai bậc học:** `IntroSection.jsx:32` ghi "đại học"; `ContactPage.jsx:44-45` ghi "đại học, cao đẳng, liên thông".
8. **Số liệu mâu thuẫn:**
   - `HeroSection.jsx:84-87` ghi 20+ năm, 25.000+ học viên, 15+ ngành.
   - `AboutPage.jsx:16,35-40` ghi thành lập 2007, 40.000 học viên.
   - Thực tế API trả về 14 ngành và 2 khoá ngắn hạn.
9. **Soft 404 và slug cũ:**
   - `/programs/tuyen-sinh-nganh-cham-soc-sac-ep` trả 200, trang không có meta.
   - `nginx.conf` **không có** rule 301 như comment ở `programCopy.ts:29` mô tả.
   - Mọi slug không tồn tại đều trả 200.
10. **Link hỏng trong bài tin:** một link trỏ slug `sac-ep` (404), một link `about:blank`.
11. **Địa chỉ không thống nhất.** Địa chỉ chuẩn (đã chốt, trùng với `appConfig.ts:14`) là: **402 Nguyễn Thị Minh Khai, Phường Bàn Cờ (Quận 3 cũ), TP. Hồ Chí Minh**. Hiện có các chỗ lệch:
    - 16 bài CMS ghi "Phường 5, Quận 3".
    - `programCopy.ts:24,71` ghi "Quận 3".
    - `MAP_QUERY` (`appConfig.ts:3`) ghi "Quận 3". Có thể giữ nguyên nếu Google Maps chưa nhận tên phường mới.

    Để tránh làm lệch thông tin tên, địa chỉ, số điện thoại (NAP), phải dùng đúng chuỗi chuẩn ở mọi nơi: nội dung site, schema, Google Business Profile, Bing Places, edunet và các danh bạ khác. Riêng meta description được phép viết tắt "P. Bàn Cờ (Q3 cũ)" cho đủ độ dài.
12. **Lẫn tiếng Anh:** title trang chủ, "Welcome Back To School", alt "Partner 1…5", alt "Hình ảnh trường 1…10".
13. **Heading trang chủ:** H3 đứng trước H2 (`IntroSection.jsx:27`). Các H2 chung chung, không chứa từ khoá.
14. **Trang chủ chỉ link tới 12/16 ngành** (`ProgramsSection.jsx:79`). Thiếu xây dựng, tiếng Việt, bảo mẫu, điều dưỡng.
15. **Title quá 60 ký tự:** trang chủ (69), sắc đẹp (66), ô tô (66), tin 1 (72), tin 2 (80). Hậu tố "| Trường Trung cấp Việt Úc" chiếm 26 ký tự; nên rút thành "| Trường Việt Úc" hoặc "| Việt Úc".
16. **Các trang tranh từ khoá của nhau:**
    - Ngành sắc đẹp và tin "học spa".
    - Sư phạm mầm non và khoá bảo mẫu.
    - Lữ hành, hướng dẫn du lịch và khách sạn.
    - Trang chủ và `/programs`.
17. **Rủi ro pháp lý cần kiểm tra:**
    - Trung cấp Sư phạm mầm non không còn đạt chuẩn giáo viên theo Luật Giáo dục 2019.
    - Hành nghề điều dưỡng yêu cầu bằng từ cao đẳng.

    Nội dung hai trang này cần nói rõ, tránh tạo kỳ vọng sai cho người học.

Meta được định nghĩa ở các file sau:
- Trang tĩnh: `src/configs/seo.config.ts:17-55`
- Trang ngành: `src/seo/programCopy.ts`
- Trang tin: `src/seo/pageMeta.ts:188-225`

### Từ khoá và title đề xuất

Độ dài ghi trong ngoặc là số ký tự. Hiện HTML ban đầu của mọi trang có 0 từ nội dung.

**Trang tĩnh**

| URL | Từ khoá chính / phụ | Title đề xuất | Description đề xuất |
|---|---|---|---|
| `/` | **trường trung cấp Việt Úc** / trường trung cấp TPHCM, học nghề TPHCM, trung cấp Quận 3 | Trường Trung cấp Việt Úc TPHCM – Tuyển sinh, học nghề (53) | Trường Trung cấp Việt Úc, 402 Nguyễn Thị Minh Khai (Q3 cũ), TPHCM: tuyển sinh 14 ngành trung cấp và khoá ngắn hạn, nhận THCS, THPT, học thực hành. |
| `/about` | **Trường Trung cấp Việt Úc** / Việt Úc có tốt không, trường nghề Quận 3 | Giới thiệu Trường Trung cấp Việt Úc – Đào tạo nghề từ 2007 (58) | Thành lập 2007 (QĐ 2946/QĐ UBND TPHCM), đào tạo trung cấp chú trọng thực hành tại 402 Nguyễn Thị Minh Khai, TPHCM. |
| `/programs` | **các ngành trung cấp TPHCM** / nên học nghề gì, ngành trung cấp dễ xin việc | Các ngành trung cấp TPHCM – Chọn ngành học nghề \| Việt Úc (57) | 14 ngành trung cấp chính quy và khoá ngắn hạn tại TPHCM: kế toán, CNTT, ô tô, spa, nấu ăn, làm bánh, khách sạn, du lịch, mầm non. |
| `/degrees` | **tra cứu văn bằng Việt Úc** / tra cứu bằng trung cấp | Tra cứu văn bằng, chứng chỉ Trường Trung cấp Việt Úc (52) | Tra cứu, xác minh văn bằng trung cấp và chứng chỉ do Trường Trung cấp Việt Úc cấp, bằng số CCCD. |
| `/news` | **tin tuyển sinh trung cấp TPHCM** / lịch khai giảng trung cấp | Tin tuyển sinh trung cấp TPHCM, lịch khai giảng \| Việt Úc (57) | Thông báo tuyển sinh, lịch khai giảng, cẩm nang chọn ngành học nghề tại Trường Trung cấp Việt Úc TPHCM. |
| `/contact` | **địa chỉ Trường Trung cấp Việt Úc** / 402 Nguyễn Thị Minh Khai | Liên hệ Trường Trung cấp Việt Úc – 402 Nguyễn Thị Minh Khai (59) | 402 Nguyễn Thị Minh Khai, P. Bàn Cờ (Q3 cũ), TPHCM. Hotline 096 28 79680, Zalo, email tư vấn tuyển sinh. |
| `/cau-hoi-thuong-gap` | **học trung cấp mấy năm** / tốt nghiệp THCS học trung cấp, liên thông | Học trung cấp mấy năm, bằng có giá trị? Hỏi đáp \| Việt Úc (57) | Hỏi đáp: học mấy năm, THCS có học được không, bằng trung cấp có liên thông, vừa học vừa làm, học phí tại Việt Úc. |

**Trang ngành** (bỏ tiền tố slug `tuyen-sinh-nganh-`)

| Ngành | Từ khoá chính / phụ | Title đề xuất | Ghi chú |
|---|---|---|---|
| quan-tri-lu-hanh | **trung cấp quản trị lữ hành** / học điều hành tour | Trung cấp Quản trị lữ hành TPHCM – Điều hành tour \| Việt Úc | Sửa lỗi gõ "Quản lữ hành" |
| quan-tri-kinh-doanh | **trung cấp quản trị kinh doanh TPHCM** | Trung cấp Quản trị kinh doanh TPHCM \| Trường Việt Úc | Chia nhỏ các khối in đậm quá dài |
| quan-tri-khach-san | **trung cấp quản trị khách sạn** / học lễ tân | Trung cấp Quản trị khách sạn TPHCM – Lễ tân, buồng \| Việt Úc | |
| ngon-ngu-anh | **trung cấp tiếng Anh TPHCM** | Trung cấp Tiếng Anh TPHCM – Hệ chính quy \| Trường Việt Úc | Title và description đang dùng hai tên khác nhau; chưa có FAQ |
| ky-thuat-lam-banh | **học làm bánh TPHCM** / trung cấp làm bánh | Học làm bánh TPHCM có bằng trung cấp \| Trường Việt Úc | **205 từ**, cần viết thêm khoảng 600 từ |
| ke-toan-doanh-nghiep | **trung cấp kế toán TPHCM** | Trung cấp Kế toán doanh nghiệp TPHCM \| Trường Việt Úc | |
| huong-dan-du-lich | **trung cấp hướng dẫn du lịch** / học HDV | Trung cấp Hướng dẫn du lịch TPHCM – Học HDV \| Việt Úc | Chồng lấn với lữ hành |
| cong-nghe-thong-tin | **trung cấp CNTT TPHCM** / học lập trình web | Trung cấp Công nghệ thông tin TPHCM \| Trường Việt Úc | Ảnh `//:0` bị hỏng |
| ky-thuat-che-bien-mon-an | **học nấu ăn TPHCM** / trung cấp nấu ăn | Học nấu ăn TPHCM có bằng trung cấp \| Trường Việt Úc | **193 từ**, mỏng nhất site |
| su-pham-mam-non | **trung cấp sư phạm mầm non TPHCM** | Trung cấp Sư phạm mầm non TPHCM \| Trường Việt Úc | Rủi ro pháp lý (mục 17) |
| cong-nghe-ky-thuat-o-to | **trung cấp ô tô TPHCM** / học sửa chữa ô tô | Trung cấp Ô tô TPHCM – Học sửa chữa ô tô \| Trường Việt Úc | |
| ky-thuat-xay-dung-he-trung-cap | **trung cấp xây dựng TPHCM** | Trung cấp Xây dựng TPHCM – Vừa học vừa làm \| Trường Việt Úc | **Còn chữ "Học Viện Tú Tài"**; chưa có FAQ |
| cham-soc-sac-dep | **trung cấp chăm sóc sắc đẹp TPHCM** / học spa có bằng | Trung cấp Chăm sóc sắc đẹp TPHCM – Học spa có bằng \| Việt Úc | Ngành ưu tiên nhưng chỉ 390 từ; để từ khoá "học spa chuyên nghiệp" cho bài tin |
| lop-tieng-viet-…-nuoc-ngoai | **học tiếng Việt cho người nước ngoài TPHCM** / learn Vietnamese HCMC | Học tiếng Việt cho người nước ngoài TPHCM (A1–C2) \| Việt Úc | Nên có bản tiếng Anh kèm hreflang |
| khoa-hoc-nghiep-vu-bao-mau | **khoá học bảo mẫu TPHCM** | Khoá học bảo mẫu mầm non TPHCM – Cấp chứng chỉ \| Việt Úc | Nhắm "ngắn hạn" để không tranh từ khoá với mầm non |
| dieu-duong | **trung cấp điều dưỡng TPHCM** | Trung cấp Điều dưỡng TPHCM \| Trường Trung cấp Việt Úc | Rủi ro pháp lý; chưa có FAQ; slug cũ `ieu-duong` |

**Bài tin**

| Bài | Từ khoá chính | Title đề xuất |
|---|---|---|
| trung-cap-cham-soc-sac-dep-hoc-gi-ra-lam-gi | trung cấp chăm sóc sắc đẹp học gì | Trung cấp Chăm sóc sắc đẹp học gì, ra trường làm gì? (52) |
| hoc-spa-chuyen-nghiep-o-tphcm-… | học spa chuyên nghiệp TPHCM | Học spa chuyên nghiệp TPHCM: lộ trình 6 bước cho người mới (58) |

Với bài tin, nên bỏ hậu tố thương hiệu trong title (`pageMeta.ts:216`) vì title đã dài.

---

## 3. Đối thủ và khoảng trống từ khoá

**Lưu ý:** công cụ tìm kiếm dùng khi audit không phải Google.vn, và không có số liệu lượng tìm kiếm. Mọi đánh giá dưới đây là **ước lượng**, cần kiểm lại bằng Google Keyword Planner (vị trí TPHCM) và Search Console.

### Đối thủ chính

| Domain | Mạnh ở đâu |
|---|---|
| bachkhoasaigon.edu.vn | 21 ngành, URL dạng `/trung-cap-<ngành>`, có trang 9+ và liên thông, mỗi ngành có thêm bài "xét tuyển … tại TPHCM". Mạnh nhất nhóm |
| tcsg.edu.vn | Có menu "Hệ 9+", **trang học phí công khai** (6–6,5 triệu/kỳ), FAQ schema, bài "Tránh nhầm tên" |
| bachkhoahcm.edu.vn | Khoảng 25 bài hướng nghiệp dạng hỏi đáp; nhưng title, meta và schema yếu |
| vietgiao.edu.vn | Tự viết bài "Top trường trung cấp TPHCM" để chiếm truy vấn chung |
| saigontourist.edu.vn | Trang ngành 2.500–3.000 từ: học phí, lịch khai giảng, FAQ, video, cựu học viên |
| ktkthcm.edu.vn | Ghi mã ngành, số tín chỉ, cho tải chương trình đào tạo |
| Các trang tổng hợp (seoulacademy, thongtintuyensinh, citc…) | Bài top list, **chưa nhắc tới Việt Úc** |

**Điểm mình mạnh hơn:** schema JSON-LD. Hầu hết đối thủ không có.

**Điểm yếu về thương hiệu:**
- Tìm "trường việt úc" ra VAS, Việt Úc Nghệ An, VAAC (44 Nguyễn Thị Minh Khai, Q1, một trường khác).
- Tìm "402 Nguyễn Thị Minh Khai" ra toà nhà văn phòng Việt Úc Tower.
- Tìm "vietuchcm.edu.vn" gần như không ra kết quả.

### Cụm từ khoá nên nhắm

| Cụm | Ví dụ | Lượng tìm (ước lượng) | Độ khó (ước lượng) |
|---|---|---|---|
| Thương hiệu | trường trung cấp việt úc tphcm, trung cấp việt úc quận 3 | Thấp | Thấp–TB (dễ bị nhầm với các "Việt Úc" khác) |
| **Theo vị trí** | trường trung cấp quận 3 / trung tâm TPHCM / gần Nguyễn Thị Minh Khai | Thấp–TB | **Thấp, chưa ai chiếm** |
| **Ngành ít cạnh tranh** | trung cấp lữ hành, hướng dẫn du lịch, tiếng Anh, chế biến món ăn, khoá bảo mẫu | Thấp–TB | Thấp–TB |
| Ngành cạnh tranh | sắc đẹp, điều dưỡng, mầm non, kế toán, CNTT, ô tô, làm bánh | TB–Cao | TB–Cao |
| Tuyển sinh, học phí | xét tuyển trung cấp 2026/2027, học phí trung cấp tphcm 2026, tuyển sinh tháng 10 | TB (đỉnh tháng 6–9) | TB |
| 9+ / THCS | hệ 9+ trung cấp tphcm, học trung cấp sau lớp 9 | TB–Cao | TB–Cao |
| Vừa học vừa làm, liên thông | trung cấp buổi tối, liên thông trung cấp lên cao đẳng | TB | TB |
| Học nghề ngắn hạn | học nghề ngắn hạn tphcm, khoá spa ngắn hạn | Cao | TB–Cao |
| ~~Du học / XKLĐ Úc~~ | Không làm. Chỉ cân nhắc nếu trường có đối tác thật với Úc | Cao | Cao |

### Ý tưởng nội dung, theo thứ tự ưu tiên

1. **Trang học phí** `/hoc-phi-trung-cap-viet-uc-2026`: bảng học phí theo ngành, chính sách miễn giảm theo Nghị định 81/2021.
2. **Làm dày trang ngành** theo mẫu Saigontourist: mã ngành, số giờ học, tỉ lệ thực hành, lịch khai giảng, học phí, việc làm và mức lương, ảnh thật, FAQ. Làm trước các ngành ít cạnh tranh.
3. **Trang 9+** (FAQ hiện tại cho biết trường có tuyển học sinh tốt nghiệp THCS), kèm FAQ.
4. **Landing theo vị trí** "Trường trung cấp ở trung tâm TPHCM (Q3, P. Bàn Cờ)": bản đồ, tuyến xe buýt.
5. **Tách thương hiệu:** trang "Trường Trung cấp Việt Úc TPHCM, không phải VAS hay Việt Úc Nghệ An"; thêm `alternateName` và `sameAs` vào schema.
6. **Blog hướng nghiệp dạng câu hỏi:** "học trung cấp X ra làm gì, lương bao nhiêu", "nên học trung cấp hay cao đẳng".
7. **Tin tuyển sinh theo đợt,** URL ổn định và cập nhật hằng năm.
8. **Xuất hiện trong bài top list:** liên hệ seoulacademy, citc, thongtintuyensinh để được đưa vào.

---

## 4. SEO năm 2026: điều gì còn quan trọng

Nguồn chính là Google Search Central. Link đầy đủ ở cuối file.

- **Core update:** các đợt 03/2026 và 05/2026, không có mục tiêu công bố riêng. "Helpful content" đã được gộp vào core từ 2024.
- **Spam policy mới năm 2026:**
  - Back button hijacking (04/2026).
  - Chính sách spam áp dụng cho cả câu trả lời AI (05/2026).
  - **Review có thưởng mà không công khai (07/2026).** Lưu ý khi thu review Google Maps.
- **E-E-A-T với trường nghề:** giấy phép, quyết định thành lập, giảng viên, học phí minh bạch, ảnh cơ sở thật, số liệu việc làm.
- **AI Overviews / AI Mode:**
  - Google nói rõ **không cần tối ưu gì riêng**; SEO nền tảng vẫn là yếu tố quyết định.
  - Google Business Profile giúp xuất hiện với truy vấn địa phương.
  - AI Mode có tiếng Việt từ 10/2025.
  - Search Console có báo cáo Generative AI từ 06/2026.
- **llms.txt:** Google xác nhận Search không dùng file này (06/2026).
- **Core Web Vitals:** không đổi. LCP ≤ 2,5 giây, INP ≤ 200 ms, CLS ≤ 0,1.
- **JavaScript SEO:**
  - Google vẫn khuyên dùng SSR hoặc prerender (03/2026).
  - Không nên dùng JS để đổi canonical.
  - Tránh soft 404.
  - **Crawler AI (GPTBot, ClaudeBot, PerplexityBot) không chạy JS.**
- **Structured data:**
  - **FAQ rich result đã ngừng hiển thị từ 05/2026.**
  - Course info đã bị bỏ.
  - **Course list chỉ có cho trang tiếng Anh.**
  - Organization, LocalBusiness, Breadcrumb, Event vẫn được hỗ trợ.
  - Nên giữ markup hiện có để Google hiểu nội dung, nhưng đừng trông vào rich result.
- **Việt Nam:** Google chiếm 94,7% thị phần tìm kiếm, Cốc Cốc 4,4%. Với Cốc Cốc chỉ cần xác minh site và gửi sitemap. og:image nên 1200×630 với URL tuyệt đối; dùng Zalo Debug Sharing để làm mới cache.

### Cách prerender body cho Vite + React

Phương án gợi ý, chọn ở bước spec:

1. **React Router v7 framework mode** với `ssr: false` + `prerender: [...]`. Xuất HTML đầy đủ cho từng URL và vẫn chạy SPA như cũ. Hợp nhất vì dự án đã dùng react-router 7.
2. **Vike** ở chế độ prerender tĩnh.
3. Tự viết script `renderToString` chạy lúc build, gộp vào `sitemap-server`. Giữ router hiện tại nhưng phải tự bảo trì.

Lưu ý: trang ngành và tin lấy dữ liệu từ API, nên cần prerender lại mỗi khi nội dung thay đổi. Hiện đã có cơ chế `/sitemap/refresh` để dùng lại.

---

## 5. Để ChatGPT và các AI gợi ý trường

Những chỗ đánh dấu [?] là thông tin từ nguồn thứ cấp hoặc chưa kiểm chứng được.

### ChatGPT chọn nguồn thế nào

- **Bot của OpenAI:**
  - **OAI-SearchBot** quyết định site có hiện trong ChatGPT search hay không.
  - **GPTBot** thu dữ liệu huấn luyện, không ảnh hưởng search.
  - **ChatGPT-User** chỉ truy cập khi người dùng yêu cầu.
  - `robots.txt` hiện tại (`Allow: /`) đã cho phép tất cả các bot này.
- **Bing rất quan trọng:**
  - 87% trích dẫn của ChatGPT search trùng với top kết quả Bing (Seer, 02/2025).
  - 88% URL được ChatGPT trích dẫn lấy thẳng từ kết quả tìm kiếm (Ahrefs, 04/2026).
  - Yếu tố mạnh nhất là **title khớp câu người dùng hỏi**. Slug dạng ngôn ngữ tự nhiên cũng giúp tăng tỷ lệ được trích dẫn.
  - Kết luận: phải được index trên **cả Bing lẫn Google**.
- **AI crawler không chạy JavaScript.** Vercel/MERJ phân tích hơn 500 triệu lượt fetch của GPTBot và không thấy lượt nào thực thi JS. Với site mình, bot chỉ đọc được title, description và JSON-LD; nội dung ngành, học phí, FAQ đều vô hình. **Prerender body là điều kiện tiên quyết.**

### AI "biết" thương hiệu từ đâu

- **Số lần được nhắc tới trên web** (tương quan 0,66) **và YouTube** (0,74) dự báo việc xuất hiện trong AI tốt hơn backlink (0,22). Nguồn: Ahrefs, 75.000 thương hiệu; số liệu YouTube từ nguồn thứ cấp [?].
- Thử truy vấn "gợi ý trường trung cấp ở TPHCM": nguồn được dùng là **bài top list của các trường đối thủ** (cet, vietgiao, seoulacademy, citc, sitc) và timviec365. Việt Úc không có trong bài nào.
- Thử truy vấn "học spa có bằng ở đâu TPHCM": ra ana, timona, top10tphcm, mytour, và **bachkhoavietuc.edu.vn**. Đây là thêm một trường cũng mang chữ "Việt Úc" dễ gây nhầm.
- **Dữ liệu sai về trường đang tồn tại ngoài site:**
  - edunet.vn ghi đúng địa chỉ và quyết định thành lập, nhưng không có link website và dùng số điện thoại mã 024 [?].
  - "VAAC" (Trường Trung cấp nghề Quản lý Khách sạn Việt Úc, 44 Nguyễn Thị Minh Khai, Q1, vaacgroup.edu.vn) là **một trường khác**, không phải tên cũ của Việt Úc. Đây là thêm một thực thể dễ nhầm, có sẵn trang trên Foody, Tuổi Trẻ, huongnghiepviet.
  - topdev.vn và masothue.com cũng có trang về trường.

### Nội dung dễ được trích dẫn

- **Câu đầu trang nêu thẳng sự thật.** Ví dụ: "Trường Trung cấp Việt Úc (402 Nguyễn Thị Minh Khai, Q3 cũ) đào tạo trung cấp chính quy ngành Chăm sóc sắc đẹp, học 1,5–2 năm, cấp bằng trung cấp."
- **Bảng học phí 2026, thời gian học, điều kiện đầu vào, bằng cấp.** Heading rõ ràng, có FAQ (Bing khuyến nghị, 02/2026).
- **Hiển thị ngày cập nhật** và tên người phụ trách tuyển sinh. AI thường trích dẫn nội dung mới hơn so với kết quả Google [?].
- **Không cần llms.txt:** OpenAI không nhắc tới nó, Google không dùng, và log cho thấy crawler hầu như không tải file này.

### Đo lường

- **GA4:** ChatGPT gắn `utm_source=chatgpt.com` vào link. Lọc theo Session source = chatgpt.com. Traffic từ app hoặc link copy sẽ không có UTM.
- **Bing Webmaster Tools, báo cáo AI Performance** (từ 02/2026, bổ sung 06/2026): số trích dẫn, trang được trích dẫn, grounding queries. Báo cáo phủ Copilot và Bing, **không chắc có ChatGPT**.
- **Theo dõi thủ công:** mỗi tháng chạy 10–15 câu hỏi cố định trên ChatGPT, Perplexity, Gemini, Copilot. Ghi lại trường có được nhắc không và nguồn nào được trích dẫn.

### Việc cần làm

**P0**

1. **Prerender body.** Trùng với mục 4, đây là điều kiện bắt buộc. Kiểm tra bằng `curl -A OAI-SearchBot https://vietuchcm.edu.vn/programs/...`: HTML phải có nội dung ngành.
2. **Bing Webmaster Tools** (đã xác minh site và gửi sitemap). Việc còn lại là kiểm tra:
   - Sitemaps: trạng thái Success, số URL đã discover có bằng 25 không.
   - Site Explorer / Search Performance: số trang đã được index.
   - URL Inspection cho 2–3 trang ngành: Bing có index không, và bản HTML Bing thấy có nội dung ngành không.
   - Nếu có trang chưa index, dùng Request indexing cho trang đó.
   - Xem báo cáo AI Performance: đã có lượt trích dẫn nào chưa.
3. **IndexNow:**
   - Tạo key, đặt file `/<key>.txt` ở thư mục gốc site.
   - Sau mỗi lần deploy hoặc `/sitemap/refresh`, gọi `POST https://api.indexnow.org/indexnow` với `{"host":"vietuchcm.edu.vn","key":"<key>","keyLocation":"https://vietuchcm.edu.vn/<key>.txt","urlList":[...]}`.
   - Có thể tích hợp bước này vào `sitemap-server`.
4. **Tách rõ thực thể** trong JSON-LD và trang About. Nhấn mạnh số **402**, vì VAAC ở số 44 cùng đường:
   - Tên chính thức, `alternateName`.
   - Quyết định 2946/QĐ-UBND (2007), địa chỉ, số điện thoại.
   - `sameAs` trỏ tới Facebook và Google Maps.
   - Câu nói rõ trường không liên quan tới VAS, Việt Úc Nghệ An hay Bách Khoa Việt Úc (nếu đúng như vậy).
5. **Robots.txt** không bắt buộc phải sửa. Nếu muốn ghi rõ từng bot:
   ```
   User-agent: OAI-SearchBot
   Allow: /
   User-agent: PerplexityBot
   Allow: /
   User-agent: GPTBot
   Allow: /
   User-agent: ClaudeBot
   Allow: /
   User-agent: Google-Extended
   Allow: /
   ```
   GPTBot, ClaudeBot và Google-Extended lấy dữ liệu để huấn luyện model. Cho phép thì về lâu dài các model sẽ "biết" trường. Nhà trường tự quyết định có cho hay không.

**P1**

6. **Google Business Profile và Bing Places:** ảnh thật, review thật từ học viên, không review có thưởng.
7. **Title trang ngành khớp câu người dùng hay hỏi,** ví dụ "Học spa có bằng trung cấp ở TPHCM". Mỗi trang có bảng học phí, FAQ và ngày cập nhật.
8. **Sửa thông tin về trường trên trang ngoài:** đề nghị edunet.vn, topdev sửa số điện thoại và thêm link website.
9. **Được nhắc tới trên các nguồn AI hay dùng:** bài top list trung lập (top10tphcm, mytour, báo tuyển sinh), nhóm Facebook tuyển sinh, voz, tinhte.

**P2**

10. **Video YouTube:** giới thiệu ngành, học phí, cơ sở vật chất.
11. **Mục Wikidata và thông cáo báo chí** trên báo địa phương.
12. **Đo lường hằng tháng:** câu hỏi cố định, GA4 lọc `chatgpt.com`, báo cáo AI Performance trên Bing.

**Nguồn chính:**
- https://developers.openai.com/api/docs/bots
- https://docs.perplexity.ai/guides/bots
- https://www.seerinteractive.com/insights/87-percent-of-searchgpt-citations-match-bings-top-results
- https://ahrefs.com/blog/why-chatgpt-cites-pages/
- https://ahrefs.com/blog/ai-overview-brand-correlation/
- https://vercel.com/blog/the-rise-of-the-ai-crawler
- https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview
- https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare
- https://help.openai.com/en/articles/12627856-publishers-and-developers-faq

---

## 6. Kế hoạch đề xuất

Mỗi dòng dự kiến là một step, mỗi step một commit.

| Ưu tiên | Việc | Ai làm |
|---|---|---|
| **P0** | Xoá "Học Viện Tú Tài"; sửa chữ "đại học/cao đẳng"; thống nhất số liệu và địa chỉ | Frontend + CMS |
| **P0** | Bỏ ngày khai giảng đã qua khỏi description; rút title về ≤ 60 ký tự; H1 và đoạn mở đầu trang ngành có từ khoá | Frontend |
| **P0** | Sửa CLS trang chi tiết (skeleton, kích thước ảnh) | Frontend |
| **P0** | 301 cho `sac-ep`, `ieu-duong`; 404 thật cho slug không tồn tại; sửa 2 link hỏng trong bài tin | nginx + CMS |
| **P0** | Ảnh CMS: WebP, nhiều size, header cache | Backend |
| **P1** | **Prerender body** cho 25 URL | Frontend (spec riêng) |
| **P1** | Tách code theo route, nén ảnh tĩnh, preload hero chỉ ở trang chủ, xoá code chết | Frontend |
| **P0** | IndexNow (tích hợp vào `sitemap-server`); tách thực thể thương hiệu trong schema và trang About. Bing Webmaster đã có, chỉ cần kiểm tra tình trạng index | Frontend + nhà trường |
| **P1** | Google Business Profile, Bing Places, Cốc Cốc Webmaster; sửa thông tin về trường trên edunet, huongnghiepviet, topdev | Nhà trường |
| **P1** | Trang học phí, trang 9+, landing theo vị trí, trang tách thương hiệu | Nội dung + Frontend |
| **P2** | Làm dày các trang ngành mỏng (nấu ăn, làm bánh, mầm non, sắc đẹp, bảo mẫu, kế toán); thêm FAQ cho Anh, xây dựng, điều dưỡng; alt ảnh | Nội dung |
| **P2** | Blog hướng nghiệp, tin tuyển sinh theo đợt, xuất hiện trong bài top list | Nội dung |
| **P2** | Brotli, gộp header nginx, inline `env-config`, bỏ `user-scalable=no` | DevOps |

**Cần nhà trường xác nhận:**
1. Trường có liên kết thật với Úc (du học, chứng chỉ) không?
2. Số liệu đúng: năm thành lập, số học viên, số ngành.
3. Học phí có được công khai không?
4. Trường có tuyển hệ 9+ không?
5. Nội dung ngành Sư phạm mầm non và Điều dưỡng có đúng quy định hiện hành không?

---

## Nguồn

- Google Search Status Dashboard: https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history
- Google Search updates: https://developers.google.com/search/updates
- AI features & optimization guide: https://developers.google.com/search/docs/appearance/ai-features · https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Structured data gallery / Course: https://developers.google.com/search/docs/appearance/structured-data/search-gallery · https://developers.google.com/search/docs/appearance/structured-data/course
- Core Web Vitals: https://web.dev/articles/vitals
- React Router prerender: https://reactrouter.com/how-to/pre-rendering
- AI crawlers & JS: https://searchoptimo.com/blog/do-ai-crawlers-render-javascript
- StatCounter VN: https://gs.statcounter.com/search-engine-market-share/all/viet-nam
- Đối thủ: https://bachkhoasaigon.edu.vn/ · https://tcsg.edu.vn/thong-bao-hoc-phi/ · https://tcsg.edu.vn/trung-cap-9-tai-tphcm-cho-hoc-sinh-sau-lop-9-mien-hoc-phi/ · https://bachkhoahcm.edu.vn/ · https://vietgiao.edu.vn/truong-trung-cap-tot-nhat-tphcm/ · https://saigontourist.edu.vn/ky-thuat-lam-banh.html · https://ktkthcm.edu.vn/cham-soc-sac-dep-trung-cap/ · https://seoulacademy.edu.vn/truong-trung-cap-nghe-tphcm
- Nhầm thương hiệu: https://vietucna.edu.vn/ · https://www.vas.edu.vn/en
