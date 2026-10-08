# Tài liệu cần nhà trường cung cấp cho website

Website chỉ đăng thông tin nhà trường đã xác nhận. Các mục dưới đây **chưa có**, nên đang **không hiển thị** trên web.
Khi có tài liệu, gửi cho bộ phận web để đăng lên trang `/cong-khai` hoặc trang ngành.

> Căn cứ pháp lý dưới đây lấy từ trích dẫn công khai (chưa đối chiếu toàn văn). Pháp chế của trường nên xác nhận lại.

## 1. Gấp: trước 03/11/2026 (Thông tư 76/2026/TT-BGDĐT, quy chế tuyển sinh GDNN)

Trước mỗi đợt tuyển sinh phải công khai trên website (web đã có sẵn trang `/tuyen-sinh` để đăng; hiện chỉ ghi "học phí khác nhau theo ngành, liên hệ để nhận bảng học phí"):

- [ ] **Học phí từng ngành**: theo học kỳ, năm học và cả khóa; kèm các khoản thu dịch vụ khác (nếu có).
- [ ] Chính sách học bổng, miễn giảm học phí.
- [ ] Chỉ tiêu tuyển sinh từng ngành; đối tượng, điều kiện, hình thức tuyển sinh.
- [ ] Thời gian đào tạo từng ngành (với người tốt nghiệp THCS và THPT).
- [ ] Địa điểm học, điều kiện học tập (và ký túc xá, nếu có).
- [ ] Danh sách trúng tuyển (công bố sau mỗi đợt).

## 2. Mục "Công khai" (Điều lệ trường trung cấp: Thông tư 63/2026/TT-BGDĐT, hiệu lực 14/9/2026)

Đã có trên web: tên trường, quyết định thành lập (2946/QĐ UBND TPHCM, 2007), địa chỉ, ngành đào tạo, văn bằng, tra cứu văn bằng, kênh phản ánh.

Còn thiếu:

- [ ] Bản scan quyết định thành lập, giấy chứng nhận đăng ký hoạt động GDNN (danh mục ngành được phép đào tạo).
- [ ] Quy chế tổ chức và hoạt động của trường.
- [ ] Chương trình đào tạo và chuẩn đầu ra từng ngành (file PDF hoặc nội dung).
- [ ] Đội ngũ nhà giáo (số lượng, trình độ) và cơ sở vật chất (phòng học, xưởng, phòng thực hành).
- [ ] Công khai thu chi tài chính theo quy định.
- [ ] Tỷ lệ người học có việc làm sau tốt nghiệp (nếu có khảo sát).
- [ ] Tên người chịu trách nhiệm nội dung website (để ghi ở chân trang).

## 3. Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15, NĐ 356/2025/NĐ-CP, xử phạt theo NĐ 330/2026/NĐ-CP)

Web đã làm: trang chính sách `/chinh-sach-bao-mat` (bản nháp), ô đồng ý bắt buộc ở form tư vấn (ghi bằng chứng vào ghi chú),
banner cookie (Google Analytics chỉ bật khi đồng ý), bỏ form nhận email gửi dữ liệu giả.

Cần nhà trường:

- [ ] Pháp chế **duyệt** nội dung trang chính sách; quyết định **thời hạn lưu** dữ liệu đăng ký tư vấn.
- [ ] Người/bộ phận phụ trách tiếp nhận yêu cầu về dữ liệu cá nhân (mặc định đang là giaovu@vietuchcm.edu.vn).
- [ ] Hồ sơ đánh giá tác động xử lý dữ liệu và hồ sơ chuyển dữ liệu ra nước ngoài (do dùng Google Analytics), theo mẫu NĐ 356.
- [ ] Backend: nên thêm trường lưu sự đồng ý (thời điểm, phiên bản chính sách) thay vì ghi vào ghi chú.

## 4. Nên có

- [ ] Ảnh thật: xưởng ô tô, phòng thực hành spa, lớp tiếng Anh, học viên đi thực tế tour (thay ảnh bìa minh hoạ trong `docs/bai-tin-mau/anh/`).
- [ ] Link Facebook, YouTube, Google Business Profile chính thức (điền `officialProfiles` trong `src/configs/appConfig.ts`).
- [ ] Ngày khai giảng các đợt tới (để viết tin tuyển sinh theo đợt).

## Mẫu tin nhắn gửi nhà trường

> Chào phòng Tuyển sinh / Kế toán,
> Theo quy chế tuyển sinh GDNN mới (TT 76/2026/TT-BGDĐT, hiệu lực 03/11/2026), trường phải công khai trên website
> học phí từng ngành (theo kỳ, năm, cả khóa), chính sách học bổng/miễn giảm, chỉ tiêu và điều kiện tuyển sinh trước khi tuyển.
> Nhờ phòng gửi giúp bảng học phí năm học 2026–2027 và chỉ tiêu từng ngành trước ngày 25/10/2026 để kịp đăng.
> Ngoài ra, nhờ pháp chế duyệt trang Chính sách bảo vệ dữ liệu cá nhân: https://vietuchcm.edu.vn/chinh-sach-bao-mat
> Cảm ơn.
