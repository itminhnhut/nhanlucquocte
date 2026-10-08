# Tổng quan website vietuchcm.edu.vn: chuẩn 2026

Cập nhật: 25/09/2026. Tổng hợp từ `docs/adr/2026-09-22-tech-seo-audit.md`, nghiên cứu pháp lý/Google 2026,
và các lần quét `npm run audit:seo`. Căn cứ pháp lý lấy từ trích dẫn công khai, pháp chế cần đối chiếu toàn văn.

## 1. Hiện trạng (sau PR #2)

| Mảng | Đánh giá | Đã có |
|---|---|---|
| Kỹ thuật SEO | ✅ Tốt | HTML render sẵn cho bot, sitemap + IndexNow, canonical, 404 thật, 301 slug cũ, 1 H1/trang, title ≤ 60, description ≤ 160 |
| Dữ liệu có cấu trúc | ✅ Tốt | JSON-LD: Organization, WebSite, Breadcrumb, Article, Course + EducationalOccupationalProgram, ItemList, FAQPage; 1 khối/trang |
| Tốc độ | ✅ Tốt (frontend) | Tách bundle (JS chung 25KB), CLS < 0,1, ảnh có kích thước; ảnh CMS vẫn nặng (backend) |
| Nội dung | 🟡 Khá | 9 bài cẩm nang, trang ngành có khối "phù hợp với bạn", 10 bài tin mẫu; thiếu học phí, ảnh thật |
| Từ khoá | ✅ Tốt | Mỗi trang 1 từ khoá riêng (`src/seo/keywords.ts`), không tranh nhau |
| Giao diện, UX | ✅ Tốt | Trang tin, trang ngành làm lại; mobile không tràn ngang (320–768px) |
| Truy cập (WCAG 2.2 AA) | ✅ Tốt | axe 0 lỗi |
| Dữ liệu cá nhân | 🟡 Phần web đã xong | Ô đồng ý, banner cookie, trang chính sách (bản nháp, cần pháp chế duyệt) |
| Công khai (TT 63/2026) | 🟡 Một phần | `/cong-khai` có thông tin đã xác nhận; thiếu tài liệu của trường |
| Cấu trúc URL | ✅ Tốt | URL tiếng Việt thống nhất (`/gioi-thieu`, `/nganh-dao-tao`, `/tin-tuc`…); URL cũ tiếng Anh chuyển 301 (giữ query), link cũ trong bài đã đăng vẫn chạy |
| Tín hiệu bên ngoài | ❌ Yếu | Chưa có Google Business Profile, ít link từ trang khác, dễ nhầm với "Việt Úc" khác |
| Đo lường | ✅ Tốt | GA4 (khi đã đồng ý cookie): lượt xem + `generate_lead` (gửi form tư vấn), `click_call`, `click_zalo`, `click_email` |

## 2. Việc còn lại

### A. Web: làm trong PR #2 (không cần số liệu của trường)

| # | Việc | Vì sao | Ưu tiên |
|---|---|---|---|
| A1 ✅ | URL tiếng Việt thống nhất + 301 từ URL cũ: `/gioi-thieu`, `/nganh-dao-tao`, `/tin-tuc`, `/lien-he`, `/tra-cuu-van-bang`, `/tim-kiem` | Nhất quán, khớp cách người Việt tìm; làm cùng đợt deploy để Google chỉ index lại 1 lần | Cao |
| A2 ✅ | Trang `/tuyen-sinh` cố định | Từ khoá "tuyển sinh trung cấp Việt Úc": trang cố định giữ hạng tốt hơn bài tin; gom đối tượng, hồ sơ, quy trình, lịch khai giảng, link ngành; sẵn chỗ cho học phí | Cao |
| A3 ✅ | Đo chuyển đổi GA4 (chỉ khi đã đồng ý cookie): gửi form tư vấn, bấm Zalo, bấm gọi | Biết SEO mang về bao nhiêu người đăng ký, không chỉ lượt xem | Trung bình |
| A4 | Rút gọn URL ngành: `/nganh-dao-tao/cham-soc-sac-dep` thay `…/tuyen-sinh-nganh-cham-soc-sac-dep` | URL ngắn, không lặp chữ | Thấp (làm sau A1) |
| A5 | Header `Content-Security-Policy` | Bảo mật | Thấp |

### B. Backend / admin (bộ phận kỹ thuật)

| # | Việc | Vì sao |
|---|---|---|
| B1 | Ảnh upload: chuyển WebP, nhiều kích thước, `Cache-Control` dài | LCP trang tin còn 6–9 giây vì ảnh PNG ~565KB không cache |
| B2 | Nén gzip/brotli response API | `/client/programs` ~52KB chưa nén |
| B3 | Trường lưu sự đồng ý (thời điểm, phiên bản chính sách) cho đăng ký tư vấn | Hiện ghi tạm vào `note` |
| B4 | Cho sửa slug trong admin (nếu chưa có) | Tránh slug tự sinh quá dài |

### C. Nhà trường

| # | Việc | Hạn / mức |
|---|---|---|
| C1 | **Học phí từng ngành** (kỳ, năm, khóa), học bổng/miễn giảm, chỉ tiêu, điều kiện tuyển sinh | **Bắt buộc trước 03/11/2026** (TT 76/2026) |
| C2 | Tài liệu công khai: quy chế tổ chức hoạt động, chương trình + chuẩn đầu ra, đội ngũ, cơ sở vật chất, thu chi, tỷ lệ việc làm | Bắt buộc (TT 63/2026) |
| C3 | Pháp chế duyệt `/chinh-sach-bao-mat`; hồ sơ đánh giá tác động, chuyển dữ liệu ra nước ngoài (GA4) | Bắt buộc (Luật 91/2025, NĐ 356/2025) |
| C4 | **Google Business Profile** + Bing Places: xác minh, ảnh thật, giờ làm việc, tên/địa chỉ/SĐT khớp website; xin review thật (không review có thưởng) | Rất quan trọng cho tìm kiếm địa phương |
| C5 | Ảnh thật: xưởng ô tô, phòng spa, bếp, lớp học, lễ tốt nghiệp (xin phép người trong ảnh); ALT mô tả khi chèn ảnh trong admin | Uy tín (E-E-A-T), thay ảnh bìa minh hoạ |
| C6 | Link Facebook, YouTube, Zalo OA chính thức | Đưa vào `sameAs` để Google/AI nhận đúng trường |
| C7 | Đăng tin đều 2–4 bài/tháng (≥ 300 chữ, có H2), không nhân bản bài theo mẫu hàng loạt | Google 2026 phạt "scaled content abuse" |
| C8 | Xuất hiện trên trang ngoài: báo địa phương, trang tổng hợp trường trung cấp TPHCM, sửa thông tin sai trên edunet/topdev | ChatGPT/AI chủ yếu gợi ý theo các nguồn này |

### D. Sau khi deploy (người quản trị web)

1. Mở `/sitemap/refresh?key=…`; `npm run audit:seo -- https://vietuchcm.edu.vn`.
2. Google Search Console: gửi sitemap, yêu cầu lập chỉ mục trang chính (~10 URL/ngày).
3. Bing Webmaster: kiểm tra sitemap, IndexNow nhận URL.
4. Rich Results Test + validator.schema.org cho trang chủ, 1 trang ngành, 1 bài tin.
5. PageSpeed Insights (mobile) cho trang chủ, 1 trang ngành, 1 bài tin.
6. GA4 → Quản trị → Sự kiện: khi `generate_lead`, `click_call`, `click_zalo` đã xuất hiện (sau vài ngày), bật "Đánh dấu là sự kiện chính". Search Console: kiểm tra URL cũ (`/programs/…`) báo "Trang có lệnh chuyển hướng", URL mới được lập chỉ mục.

## 3. Lộ trình

| Thời gian | Việc |
|---|---|
| Tuần này | Merge PR #2 (đã có A1, A2, A3), deploy → D1–D6 |
| Trước 25/10 | C1 (học phí), C3 (duyệt chính sách), C4 (Google Business Profile) |
| Trước 03/11 | Đăng học phí lên `/tuyen-sinh` và trang ngành |
| Tháng 11–12 | B1–B3, C2, C5, C6; đăng tin đều; A4, A5 |
| Hằng tháng | Chạy `audit:seo`; xem Search Console; thử hỏi ChatGPT/Gemini "trường trung cấp Quận 3 TPHCM" |

## 4. Chỉ số theo dõi

- Search Console: số trang được index (mục tiêu: toàn bộ URL trong sitemap), số lần hiển thị, lượt nhấp, vị trí các từ khoá chính trong `src/seo/keywords.ts`.
- GA4: số đăng ký tư vấn (`generate_lead`), bấm gọi/Zalo (`click_call`, `click_zalo`); nguồn `chatgpt.com`.
- Core Web Vitals (Search Console): LCP ≤ 2,5 giây, INP ≤ 200 ms, CLS ≤ 0,1.
