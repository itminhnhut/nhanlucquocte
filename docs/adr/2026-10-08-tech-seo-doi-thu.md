# Phân tích đối thủ SEO và kế hoạch cho trungcapnhanlucquocte.vn

Ngày: 08/10/2026 · Người viết: nhóm phát triển website

## 1. Vì sao đối thủ đang trên mình

Khảo sát các trường cùng tuyển sinh trung cấp/cao đẳng nghề tại TPHCM (Cao đẳng Kỹ thuật – Du lịch
Sài Gòn, Trung cấp Công nghệ Bách Khoa, Cao đẳng Văn Lang Sài Gòn, các site vệ tinh ngành y dược –
chăm sóc sắc đẹp). Ba điểm họ hơn hẳn:

**1.1. Họ công bố học phí, mình thì không.**
Từ khoá "học phí ngành …" là nhóm từ khoá có lượng tìm lớn nhất trong ngành này. Đối thủ ghi thẳng
con số (ví dụ 8.600.000 đ/kỳ, "5–7 triệu/kỳ"), kèm chính sách miễn giảm, học bổng, số suất ưu đãi.
Trang nào có con số thì giữ hạng; trang nói "liên hệ để biết học phí" gần như không lên được.

**1.2. Mỗi ngành là một landing page dài, đủ ý.**
Trang ngành của họ dài 1.200–5.000 từ, bố cục lặp lại: thông tin tuyển sinh → phương thức xét tuyển →
học bổng & miễn giảm → học phí → cách đăng ký → chương trình học (bảng môn/tín chỉ) → form đăng ký.
Có nút gọi, Zalo, Messenger dính màn hình.

**1.3. Họ có bài "vệ tinh" đánh từ khoá dạng câu hỏi.**
"Trường học trung cấp chăm sóc sắc đẹp tại TP.HCM uy tín, giá rẻ?", "Học phí ngành chăm sóc sắc đẹp
bao nhiêu?" — bài 1.200–1.500 từ, trả lời đúng câu người dùng gõ, rồi link nội bộ về trang ngành.

Điểm yếu của họ (chỗ mình chen vào được): phần lớn **không có structured data** (không Course,
không FAQPage), không breadcrumb, tốc độ trung bình, và không trường nào khai thác tốt từ khoá địa
phương (quận/khu vực) lẫn nhóm từ khoá sơ cấp – ngắn hạn.

## 2. Hiện trạng site mới (đo ngày 08/10/2026)

| Hạng mục | Kết quả |
|---|---|
| Lighthouse mobile (bản build + gzip) | Performance **90**, SEO **100**, Accessibility **96**, Best practices **100** |
| LCP mobile | 3,3 s (ngưỡng tốt ≤ 2,5 s) → **cần sửa** |
| CLS / TBT | 0 / 10 ms → đạt |
| Lighthouse desktop (dev server) | Performance 64 (số dev, không phản ánh production) |
| Trang tĩnh đã có | 12 URL trong sitemap + 6 bài cẩm nang |
| Structured data | EducationalOrganization, WebSite, WebPage, BreadcrumbList, Article, Course, FAQPage |

Mỗi trang đều được tạo HTML sẵn (prerender) nên Google và các bot AI đọc được nội dung ngay, không
phải chờ JavaScript — đây là lợi thế kỹ thuật lớn nhất so với đối thủ.

## 3. Việc cần làm, theo thứ tự ưu tiên

### Ưu tiên 1 — Nội dung còn thiếu (ảnh hưởng thứ hạng nhiều nhất)

1. **Trang `/hoc-phi`** công bố học phí từng ngành + chính sách miễn giảm. Cần nhà trường cung cấp
   bảng học phí. Không có số liệu thì không nên làm trang này, vì trang rỗng còn hại hơn.
2. **Bài cẩm nang theo nhóm từ khoá câu hỏi**, mỗi bài 1 từ khoá chính (đã có 6 bài, nên thêm):
   - "học điều dưỡng ra làm gì", "học dược sĩ trung cấp ra làm gì"
   - "học chăm sóc sắc đẹp bao lâu", "học nghề làm bánh ở đâu tphcm"
   - "học nghề đi Nhật/Hàn cần gì" (gắn thế mạnh của trường)
3. **Trang ngành (database)**: khi import xong, mỗi bài ngành cần tối thiểu: học gì → ra làm gì →
   đối tượng tuyển sinh → thời gian học → hồ sơ → lịch khai giảng → form đăng ký. Thiếu phần nào thì
   trang đó không cạnh tranh được với landing page của đối thủ.
4. **Cảm nhận học viên thật** (tên, ngành, câu nói, có đồng ý) — khối đã dựng sẵn, chỉ cần dữ liệu.

### Ưu tiên 2 — Tốc độ (LCP 3,3 s → dưới 2,5 s)

1. Banner trang chủ đang là ảnh chữ 2000×760. Nên cắt thêm **bản riêng cho mobile** (tỷ lệ ~4:3,
   chữ to hơn) và nén mạnh hơn bản 400/800.
2. Cân nhắc bỏ chữ khỏi ảnh banner, chuyển chữ thành HTML đè lên ảnh → LCP là text, nhanh hơn nhiều
   và đọc được trên màn hình nhỏ.
3. GA4 (gtag.js) chiếm ~178 KB, lãng phí ~123 KB. Giữ nguyên nếu cần đo đầy đủ, hoặc chuyển sang
   tải GA sau sự kiện tương tác đầu tiên nếu muốn thêm điểm.
4. Bật gzip/brotli + cache-control trên nginx của production (đo bằng server không nén tụt từ 90 → 66).

### Ưu tiên 3 — Structured data (đã kiểm tra lại theo tài liệu Google ngày 08/10/2026)

Hai thay đổi lớn cần biết trước khi đầu tư thêm vào schema:

- **FAQ rich result đã bị Google gỡ hoàn toàn ngày 07/05/2026** (trước đó từ 08/2023 chỉ còn site
  chính phủ/y tế). Markup `FAQPage` của mình vẫn giữ (giúp Google và các công cụ AI hiểu nội dung)
  nhưng **không còn tạo kết quả mở rộng trên SERP** — đừng kỳ vọng.
- **"Course info" rich result (giá, đánh giá, thời lượng từng khóa) đã bị gỡ tài liệu từ 09/2025.**
  Loại còn được hỗ trợ là **"Course list"** — đúng thứ mình đang làm ở `/nganh-dao-tao`
  (ItemList gồm các Course). Yêu cầu: tối thiểu 3 khóa, mỗi Course cần `name` + `description`,
  khuyến nghị `provider`; `ListItem` cần `position` + `url`. **Rich result này chỉ chạy tiếng Anh**,
  nên với site tiếng Việt, schema giúp Google hiểu thực thể chứ chưa tạo giao diện đặc biệt.

Hiện trạng schema của site (kiểm tra trên HTML đã tạo sẵn):

| Schema | Trang | Trạng thái |
|---|---|---|
| EducationalOrganization (address, telephone, email, openingHoursSpecification, hasMap, logo, image, contactPoint, sameAs) | toàn site | ✅ đầy đủ |
| WebSite / WebPage / ContactPage / CollectionPage / FAQPage | theo từng trang | ✅ |
| BreadcrumbList | mọi trang con | ✅ |
| Article (author, publisher, datePublished, dateModified) | cẩm nang, tin tức | ✅ |
| Course + EducationalOccupationalProgram | trang ngành | ✅ (có programType, educationalCredentialAwarded, startDate) |
| ItemList "Course list" | /nganh-dao-tao | ✅ |
| `sameAs` | organization | ⚠️ **đang gần như trống** — mới có Zalo, thiếu Facebook/YouTube/TikTok |
| `geo` (toạ độ) + gắn thêm type `LocalBusiness` | organization | ❌ nên thêm, giúp tìm kiếm theo khu vực |
| `offers` (học phí), `hasCourseInstance` (hình thức học, lịch khai giảng) | trang ngành | ❌ chờ trường cung cấp học phí + lịch |
| `aggregateRating` / Review | — | ❌ **không nên tự gắn**: Google bỏ qua và có thể phạt đánh giá tự công bố |

### Ưu tiên 4 — Ngoài website

1. **Google Business Profile** cho địa chỉ số 6 Phan Đình Giót — chưa có thì mất toàn bộ lượt tìm
   "trường trung cấp nghề gần đây", bản đồ, chỉ đường.
2. Khai báo Search Console + Bing Webmaster (thẻ xác minh đã gắn sẵn trong `index.html`), nộp sitemap.
3. Khai báo các kênh chính thức (Facebook, YouTube, TikTok) vào `officialProfiles` để lên schema
   `sameAs` — hiện đang để trống.

## 4. Những gì đã làm trong đợt này

- Danh mục 26 ngành theo đúng chương trình đào tạo của trường, chia 7 lĩnh vực, dùng chung cho trang
  chủ, trang tuyển sinh, trang công khai và trang giới thiệu.
- Trang tĩnh: Giới thiệu, Tuyển sinh, Du học, Tra cứu văn bằng, Câu hỏi thường gặp, Cẩm nang (6 bài),
  Công khai thông tin, Chính sách bảo mật, Liên hệ (có chỉ đường từ các quận lân cận).
- Menu đúng như trường đang dùng + thêm Du học; Cẩm nang để ở footer.
- Trang chủ đủ khối: banner, giới thiệu, lĩnh vực đào tạo, chương trình đào tạo, vì sao chọn trường,
  đăng ký, tin tức, đối tác – trường liên kết (logo lấy từ website của trường).
- Dọn sạch dữ liệu của website nguồn (tên trường, địa chỉ, slug ngành, từ khoá, schema): 131/131 test xanh.

## 4b. Đợt bổ sung (cùng ngày)

- **301 toàn bộ URL `.html` của website hiện tại** sang URL mới (`src/configs/legacyPaths.ts` +
  `docker/nginx.conf`, có test đối chiếu 2 nơi). Đây là việc bắt buộc khi đổi web: không có 301 thì
  mọi thứ hạng và backlink đang có của trungcapnhanlucquocte.vn rơi vào trang 404.
- Trang Liên hệ: thêm mục **"Đường đến trường"** — 7 tuyến đường từ các quận lân cận, mốc nhận biết
  (vòng xoay Lăng Cha Cả, ga quốc nội Tân Sơn Nhất), xe buýt, giờ cao điểm, lưu ý khi tới nộp hồ sơ.
- **Câu hỏi thường gặp: 10 → 17 câu** (hồ sơ, giá trị bằng toàn quốc, học ngoài giờ, ký túc xá,
  đường đi, giới thiệu việc làm) + 18 câu theo nhóm ngành.
- **Cẩm nang: 6 → 10 bài**, thêm: học điều dưỡng ra làm gì; học chăm sóc sắc đẹp học gì;
  hồ sơ nhập học trung cấp; học nghề đi làm việc ở nước ngoài.
- Ảnh trong bài CMS thiếu `alt` → tự gắn alt theo tiêu đề bài (audit: 16 cảnh báo → 0).
- GA4 nạp sau khi trang vẽ xong (vẫn ghi nhận page_view), `geo` + `LocalBusiness` vào schema,
  preload banner tách riêng cho điện thoại và máy tính (trước đây điện thoại tải 2 ảnh).

Số liệu sau đợt này: audit 50 trang → **1 lỗi** (là lỗi giả của server test local, nginx trả 404 thật)
· **0 cảnh báo**; Lighthouse mobile Perf 87–88, SEO 100, A11y 96, Best practices 100; 132/132 test xanh.

## 5. Việc cần nhà trường cung cấp

1. Bảng học phí từng ngành + chính sách miễn giảm, học bổng.
2. 4–6 cảm nhận học viên thật (tên, ngành, nội dung, đồng ý đăng).
3. Link Facebook/YouTube/TikTok chính thức; logo vector (SVG) nếu có.
4. Xác nhận số liệu đang dùng: "hơn 20.000 lao động (2008–2012)", "hơn 2.500 lượt học viên/năm".
5. Nội dung hợp tác cụ thể với từng đối tác (UTM, Sun Moon University, Sheraton Saigon,
   Park Hyatt Saigon, JW Korea Hospital) để ghi chú đúng.
