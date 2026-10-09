# Tài liệu cần nhà trường cung cấp cho website

Website chỉ đăng thông tin nhà trường đã xác nhận. Các mục dưới đây **chưa có**, nên đang **không hiển thị** trên web.
Khi có tài liệu, gửi cho bộ phận web để đăng lên trang `/cong-khai` hoặc trang ngành.

> Căn cứ pháp lý dưới đây lấy từ trích dẫn công khai (chưa đối chiếu toàn văn), trừ Nghị định 238/2025/NĐ-CP đã
> đối chiếu trên Cổng thông tin điện tử Chính phủ. Pháp chế của trường nên xác nhận lại.

## 1. Gấp: trước 03/11/2026 (Thông tư 76/2026/TT-BGDĐT, quy chế tuyển sinh GDNN)

Trước mỗi đợt tuyển sinh phải công khai trên website (web đã có sẵn trang `/tuyen-sinh` để đăng; hiện chỉ ghi "học phí khác nhau theo ngành, liên hệ để nhận bảng học phí"):

- [ ] **Học phí từng ngành**: theo học kỳ, năm học và cả khóa; kèm các khoản thu dịch vụ khác (nếu có).
- [ ] Chính sách học bổng, miễn giảm học phí **của trường** (chính sách của Nhà nước thì web đã nêu, xem mục 5).
- [ ] Chỉ tiêu tuyển sinh từng ngành; đối tượng, điều kiện, hình thức tuyển sinh.
- [ ] Thời gian đào tạo từng ngành (với người tốt nghiệp THCS và THPT).
- [ ] Địa điểm học, điều kiện học tập (và ký túc xá, nếu có).
- [ ] Danh sách trúng tuyển (công bố sau mỗi đợt).

## 2. Mục "Công khai" (Điều lệ trường trung cấp: Thông tư 63/2026/TT-BGDĐT, hiệu lực 14/9/2026)

Đã có trên web: tên trường, quyết định thành lập (**Quyết định số 1777/LĐTBXH-QĐ ngày 13/12/2007 của Bộ Lao động –
Thương binh và Xã hội**, đúng theo trang Giới thiệu của trường), địa chỉ, ngành đào tạo, văn bằng, tra cứu văn bằng,
kênh phản ánh.

Còn thiếu:

- [ ] Bản scan quyết định thành lập, giấy chứng nhận đăng ký hoạt động GDNN (danh mục ngành được phép đào tạo).
- [ ] Quy chế tổ chức và hoạt động của trường.
- [ ] Chương trình đào tạo và chuẩn đầu ra từng ngành (file PDF hoặc nội dung).
- [ ] Đội ngũ nhà giáo (số lượng, trình độ) và cơ sở vật chất (phòng học, xưởng, phòng thực hành).
- [ ] Công khai thu chi tài chính theo quy định.
- [ ] Tỷ lệ người học có việc làm sau tốt nghiệp (nếu có khảo sát).
- [ ] Tên người chịu trách nhiệm nội dung website (để ghi ở chân trang).

Đã bổ sung từ bài của trường (bài bàn giao xe VinFast, 14/04/2026): **tên viết tắt SIM**,
**Hiệu trưởng – Thầy Võ Xuân Trung**, **Khoa Cơ khí – Ô tô** và **Xưởng Ô tô** của nhà trường.

- [ ] Xác nhận Thầy Võ Xuân Trung vẫn là Hiệu trưởng hiện nay, và danh sách đầy đủ các khoa/phòng.

## 3. Trình độ, văn bằng của 3 ngành còn lại

Đối chiếu từng trang của trường ngày 09/10/2026, web đã công bố được trình độ của 23/26 ngành. Ba ngành còn lại
trang của trường **không nêu** trình độ hay văn bằng, nên web cố tình **để trống** (không gắn nhãn hệ, không nêu
văn bằng, không đưa vào schema) — xem phần đầu `src/content/programFields.ts`:

- [ ] **Trợ lý nha khoa** — trang của trường gọi là "Khóa 32 Nghiệp vụ Trợ lý Nha khoa", không có mục trình độ/văn bằng.
- [ ] **Chăm sóc da** — trang chỉ nêu "Thời lượng học: 2 – 3 tháng".
- [ ] **Beauty Therapy** — trang chỉ nêu "Thời gian đào tạo: 02 năm". Thời lượng này trùng hệ trung cấp
      (ngành Thiết kế nội thất cũng 2 năm và ghi rõ "Trình độ đào tạo: Trung Cấp") nhưng trang không ghi
      trình độ, nên web để trống thay vì suy ra.

## 4. Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15, NĐ 356/2025/NĐ-CP, xử phạt theo NĐ 330/2026/NĐ-CP)

Web đã làm: trang chính sách `/chinh-sach-bao-mat` (bản nháp), ô đồng ý bắt buộc ở form tư vấn (ghi bằng chứng vào ghi chú),
bỏ form nhận email gửi dữ liệu giả.

Cần nhà trường:

- [ ] Pháp chế **duyệt** nội dung trang chính sách; quyết định **thời hạn lưu** dữ liệu đăng ký tư vấn.
- [ ] Người/bộ phận phụ trách tiếp nhận yêu cầu về dữ liệu cá nhân (web đang ghi nhanlucquocte.edu@trungcapnhanlucquocte.vn).
- [ ] Hồ sơ đánh giá tác động xử lý dữ liệu và hồ sơ chuyển dữ liệu ra nước ngoài (do dùng Google Analytics), theo mẫu NĐ 356.
- [ ] Backend: nên thêm trường lưu sự đồng ý (thời điểm, phiên bản chính sách) thay vì ghi vào ghi chú.
- [ ] **Quyết định có làm banner đồng ý cookie hay không.** Website hiện bật Google Analytics
      (G-1J20C6MJPZ) **ngay khi mở trang**, có `anonymize_ip`, và **không có** banner đồng ý. Trang
      chính sách trước đây mô tả sai là "cookie chỉ bật khi bạn đồng ý" và có nút "Cài đặt cookie" ở
      cuối mỗi trang — cả hai đều không tồn tại; đã sửa lại cho khớp thực tế và chỉ cách người dùng
      tự từ chối (tiện ích Google Analytics Opt-out, cài đặt trình duyệt). Nếu pháp chế muốn theo
      đúng Luật 91/2025 ở mức cao nhất thì cần **làm thật** banner đồng ý và chỉ nạp gtag.js sau khi
      người dùng bấm Đồng ý — đây là việc cần làm thêm, chưa làm.
- [ ] **Tra cứu văn bằng**: endpoint `client/degrees/{cccd}` đang công khai, không cần đăng nhập, nhập đúng số CCCD là
      ra họ tên, ngày sinh, ngành, xếp loại. Khi trường có backend riêng nên đổi sang **số bằng + họ tên**, chỉ trả 4
      trường và có giới hạn số lần tra. Trang hiện giữ đúng như site đang chạy (cũng chỉ nhập CCCD).

## 5. Học phí: web chỉ đăng đúng những gì trường đã công bố

Đã crawl toàn bộ **53 trang** trungcapnhanlucquocte.vn ngày 09/10/2026. Kết quả về học phí:

- Mức học phí **duy nhất** trường từng công bố: *"Học phí: 8.800.000 đồng/ khóa (bao gồm nguyên vật liệu
  thực hành)"* — bài "KHAI GIẢNG LỚP NẤU ĂN NHÀ HÀNG KHÓA 08/2025", đăng 04/8/2025.
- **Không** có bảng học phí của ngành nào khác.
- **Không** có chữ nào về miễn, giảm, hỗ trợ học phí hay học bổng theo chính sách Nhà nước.
- Mục "Hướng dẫn thanh toán" ở chân trang chỉ là dòng chữ, không có trang nội dung.

Vì vậy trang `/hoc-phi` của web mới chỉ nêu đúng mức trên (kèm ngày công bố, nói rõ là mức của riêng khóa đó)
và cách liên hệ để nhận học phí từng ngành. Không nêu các khoản phải đóng của một khóa, không nêu giấy tờ xin
miễn giảm, không dẫn nghị định — đó đều là nội dung tự thêm.

- [ ] **Bảng học phí từng ngành** (theo kỳ, năm, cả khóa) — mục 1 ở trên.
- [ ] Mức học phí hiện hành của khóa Nấu ăn nhà hàng, nếu đã khác con số công bố năm 2025.
- [ ] Nội dung cho mục "Hướng dẫn thanh toán" (số tài khoản, hình thức đóng, kỳ đóng).

### Đã tra sẵn, chờ trường xác nhận mới đăng

Nếu sau này trường muốn công khai chính sách miễn, giảm, hỗ trợ học phí thì **văn bản đang có hiệu lực** là
**Nghị định 238/2025/NĐ-CP** (ban hành 03/9/2025, hiệu lực từ ngày ký, áp dụng từ năm học 2025–2026), đã **thay thế**
Nghị định 81/2021/NĐ-CP và Nghị định 97/2023/NĐ-CP mà web từng dẫn sai.
Điều 15: đối tượng được miễn học phí, trong đó có người tốt nghiệp THCS học tiếp trình độ trung cấp.
Điều 16: giảm 70% / 50%. Điều 17: hỗ trợ học phí, hỗ trợ chi phí học tập.
Toàn văn: https://vanban.chinhphu.vn/?pageid=27160&docid=215169

Lưu ý: nghị định phân biệt **cơ sở công lập** (miễn học phí) và **cơ sở dân lập, tư thục** (hỗ trợ học phí), mức hỗ trợ
do cơ quan có thẩm quyền quyết định. Nhân Lực Quốc Tế là trường tư thục, nên **không được** viết "học ở trường được
miễn học phí" khi chưa có văn bản xác nhận mức áp dụng.

- [ ] Nếu trường có văn bản/hướng dẫn về mức hỗ trợ áp dụng thực tế, gửi để đăng.

## 6. Lỗi đang có trên site đang chạy (trungcapnhanlucquocte.vn)

Phát hiện khi đối chiếu ngày 09/10/2026 — nên báo bên quản trị site cũ (Phương Nam Vina):

- [ ] `tuyen-sinh-lien-thong-he-dai-hoc-nganh-quan-tri-dich-vu-du-lich-lu-hanh-.html` trả về **404**
      nhưng vẫn được liệt kê trong mục Chương trình đào tạo. (Đã crawl đủ 53 trang: đây là trang 404 duy nhất.)
- [ ] `gioi-thieu.html` trả về **HTTP 500** (vẫn hiện nội dung, nhưng mã lỗi làm Google hạ chất lượng trang).
- [ ] Khối số liệu ở đầu mọi trang là **số mẫu của template**: "1982 Giảng viên được chứng nhận", "1783 Học viên đã
      tốt nghiêp" (sai chính tả), "1564 Học viên đã ghi danh". Web mới **không lấy** các số này.
- [ ] Ngày đăng của phần "Bài viết liên quan" hiện **01-01-1970**.
- [ ] Thông báo tuyển sinh tháng 05/2026 mở đầu bằng "**Sim** trân trọng thông báo…" — còn tên viết tắt nội bộ.
- [ ] Địa chỉ ở chân trang vẫn là "Phường 2, Quận Tân Bình" (từ 01/07/2025 là **phường Tân Sơn Hòa**).

## 7. Giờ làm việc — đã bỏ khỏi web

Web từng ghi "Giờ làm việc: Thứ Hai – Thứ Sáu, 8:00 – 17:00" ở chân trang, trang Liên hệ, trang Công khai và trong
schema. Rà 53 trang của trường **không có chỗ nào công bố giờ làm việc**, nên đã bỏ hẳn khỏi web (kể cả
`openingHoursSpecification` trong schema).

- [ ] Giờ làm việc chính thức của trường (để đăng lại; schema có giờ giúp hiện trong kết quả tìm kiếm địa phương).

Mốc giờ duy nhất trường từng công bố là giờ **nhận bằng tốt nghiệp hệ liên thông**: "Buổi sáng thứ Năm hàng tuần,
từ 09h00 đến 12h00, bắt đầu từ ngày 10/07/2025" — chỉ áp dụng cho việc ký sổ gốc và nhận bằng, không phải giờ tiếp đón
chung, nên web không dùng làm giờ làm việc.

## 8. Cơ sở thứ hai — đã đưa lên web

Hai thông báo của trường có nêu đầu mối riêng của hệ liên thông, web mới đã đăng ở trang `/tuyen-sinh` và `/hoc-phi`:
**Phòng Đào tạo – Hệ Liên thông Đại học, Cao đẳng**, Tầng 2, số 02 Hồng Hà, phường 2, quận Tân Bình, TP. Hồ Chí Minh —
điện thoại 096 28 79 680, email lienthongdaihoc.edu@trungcapnhanlucquocte.vn.

- [ ] Xác nhận đây vẫn là địa chỉ/số điện thoại đang dùng, và có phải cơ sở của trường hay của trường đại học đối tác.

## 9. Redirect từ URL cũ — đã sửa một lỗi nặng

Tải `sitemap.xml` của trường ngày 09/10/2026 (**41 URL Google đã index**) và đối chiếu với bản đồ
redirect. Phát hiện **7 bài tin** có slug khác sau khi import (site trường để dấu gạch ở đầu hoặc cuối
slug), nên quy tắc chung `/<slug>.html → /tin-tuc/<slug>` đẩy chúng vào **trang 404**:

| URL cũ | Đi về |
|---|---|
| `-khep-lai-thanh-cong-le-trao-bang-tot-nghiep-trao-hoc-bong-ngay-05-05-2026.html` | `/tin-tuc/khep-lai-thanh-cong-le-trao-bang-tot-nghiep-2026-va-trao-hoc-bong` |
| `hoat-dong-hien-mau-.html` | `/tin-tuc/hien-mau-hom-nay-trao-hy-vong-ngay-mai` |
| `le-ban-giao-xe-vinfast-8-cho-nganh-ky-thuat-sua-chua-o-to-.html` | bỏ dấu gạch cuối |
| `tuyen-dung-nhan-vien-phuc-vu-nha-hang-.html` | bỏ dấu gạch cuối |
| `co-hoi-thuc-tap-tai-sheraton-.html` | bỏ dấu gạch cuối |
| `tuyen-dung-nganh-f-b-.html` | bỏ dấu gạch cuối |
| `thong-bao-nhan-bang-tot-nghiep-.html` | bỏ dấu gạch cuối |

Đã thêm `LEGACY_NEWS_PATHS` (src/configs/legacyPaths.ts) + rewrite tương ứng trong `docker/nginx.conf`,
và test `scripts/seo/__tests__/legacyUrls.test.js` kiểm mọi URL trong sitemap cũ phải tới trang có thật.

### Trang rác của mẫu website cũ

Bên thiết kế (Phương Nam Vina) dùng lại template **bán hồ tiêu, quế**. Các trang sau vẫn đang sống và
**nằm trong sitemap.xml của trường**, nên Google đã index chúng như nội dung của trường:
`san-pham.html`, `gio-hang.html`, `star-anise-684.html`, `ground-black-pepper-575.html`,
`white-pepper-119.html`, `black-papper.html`, `tube-cinnamon.html`, `broken-cinnamon.html`,
`cinnamon-sticks.html`, `cinnamon-harvest.html`, `pepper-harvest.html`, `video-home.html`.
Trang `hinh-anh.html` của trường cũng **chỉ có ảnh hồ tiêu, quế**, không có ảnh nào của trường.

Web mới 301 tất cả về trang chủ (`LEGACY_REMOVED_PATHS`).

- [ ] Báo bên quản trị site cũ xoá các trang này khỏi website và khỏi sitemap, để Google không còn
      hiểu trường là nơi bán nông sản.

## 10. Nên có

- [ ] Ảnh thật: xưởng ô tô, phòng thực hành spa, lớp tiếng Hàn, học viên thực tập tại resort.
- [ ] Link Facebook, YouTube, Google Business Profile chính thức (điền `officialProfiles` trong `src/configs/appConfig.ts`).
- [ ] Ngày khai giảng các đợt tới (để viết tin tuyển sinh theo đợt).

## Mẫu tin nhắn gửi nhà trường

> Chào phòng Tuyển sinh / Kế toán,
> Theo quy chế tuyển sinh GDNN mới (TT 76/2026/TT-BGDĐT, hiệu lực 03/11/2026), trường phải công khai trên website
> học phí từng ngành (theo kỳ, năm, cả khóa), chính sách học bổng/miễn giảm, chỉ tiêu và điều kiện tuyển sinh trước khi tuyển.
> Nhờ phòng gửi giúp bảng học phí năm học 2026–2027 và chỉ tiêu từng ngành trước ngày 25/10/2026 để kịp đăng.
> Ngoài ra nhờ xác nhận giúp trình độ và văn bằng của 3 ngành: Trợ lý nha khoa, Chăm sóc da, Beauty Therapy —
> trang hiện tại của trường không nêu, nên web đang để trống thay vì ghi đoán.
> Cảm ơn.
