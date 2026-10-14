# API — những chỗ cần sửa phía backend

Đối chiếu API `truongdaynghe-api.x2ldh2.easypanel.host` với **website** (`nhanlucquocte`) và
**trang quản trị** (`admin-nhanlucquocte`), ngày 14/10/2026.

Cách kiểm: gọi thẳng từng endpoint hai phía đang dùng, đối chiếu với `/docs.json`. Các lệnh `curl`
tái hiện được để ở cuối mỗi mục. Không sửa/xoá dữ liệu nào; hai bản ghi thử nghiệm tạo ra trong
lúc kiểm đã xoá, cả 8 bảng hiện vẫn đúng như trước.

**Tình trạng hiện tại:** API chạy ổn, mọi endpoint hai phía cần đều có và trả đúng cấu trúc.
Database **đang trống** (0 ngành, 0 bài, 0 học viên, 0 văn bằng, 1 admin tạo 13/10).

---

## A. Lỗi chặn — phải sửa mới chạy được

### A1. Không tạo được ngành/bài nếu không có ảnh

Trường `image` của `ProgramInput` và `PostInput` khai trong `/docs.json` là:

```
image  string  format=uri  nullable=true
```

Nhưng server thật **từ chối cả chuỗi rỗng lẫn `null`**:

| Gửi lên | Kết quả thật |
|---|---|
| `"image": ""` | `400 {"message":"Invalid URL"}` |
| `"image": null` | `400 {"message":"Invalid input: expected string, received null"}` |
| bỏ hẳn trường `image` | `201`, lưu thành `image: null` |

Tức `nullable: true` trong spec **không đúng với code đang chạy**.

Đây là lỗi chặn vì trang quản trị gửi `image: ''` khi người dùng không chọn ảnh bìa — nên **không
tạo được ngành hay bài nào thiếu ảnh**. Trong dữ liệu sẵn có của trường, 5/26 ngành và 1/19 bài
không có ảnh.

**Đề nghị:** cho `image` nhận `null` đúng như spec (và lý tưởng là coi `""` như `null`). Phía quản
trị cũng sẽ sửa để không gửi chuỗi rỗng, nhưng nhận `null` vẫn nên đúng vì spec đang hứa như vậy.

```bash
curl -X POST "$API/api/admin/programs" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"T","slug":"t","content":"<p>x</p>","image":null}'
```

### A2. `POST /admin/posts` không nhận ngày đăng

`PostInput` gồm: `title, slug, image, summary, content, category, isHot, published, programIds`.
**Không có `createdAt`.**

Website có 19 bài thật của trường, ngày đăng trải từ **13/06/2024 đến 23/09/2026**. Nhập qua API
hiện tại thì tất cả nhận ngày nhập, kéo theo:

- thứ tự tin tức sai (danh sách sắp theo tin nóng trước rồi mới nhất, mà tất cả cùng ngày),
- dòng "Ngày đăng" trên mỗi bài sai,
- `datePublished` trong dữ liệu có cấu trúc gửi cho Google sai.

Mất rồi thì không lấy lại được trừ khi xoá hết nhập lại.

**Đề nghị:** cho `PostInput` nhận `createdAt` (chỉ cần khi nhập dữ liệu cũ), hoặc thêm một route
nhập hàng loạt tương tự `POST /admin/certificate-records/import` đã có.

---

## B. Thiếu tính năng — website đang hiển thị sai

### B1. `GET /client/posts` không lọc được theo `category`

Tham số hiện có: `page, limit, noPaginate, programId, programSlug, search`.

Trang **Du học** của website gọi `client/posts?category=du học`. Tham số bị bỏ qua, nên trang này
sẽ hiện **toàn bộ 19 bài tin tức** thay vì 1 bài du học.

`category` **đã có** trong dữ liệu trả về (`Post.category`), chỉ thiếu bộ lọc. Dữ liệu hiện có 2
giá trị: `"tin tức"` (18 bài) và `"du học"` (1 bài).

**Đề nghị:** thêm tham số `category` cho `GET /client/posts`, lọc khớp chính xác.

```bash
curl "$API/api/client/posts?category=du%20h%E1%BB%8Dc"   # hiện trả về mọi bài
```

---

## C. Đề nghị thêm (không chặn)

### C0. Xin trả lại `width` và `height` khi tải ảnh lên

API Việt Úc (bản gốc) trả về `url, publicId, format, bytes, width, height`.
API này đổi sang S3 nên trả về `url, key, bucket, contentType, bytes` — **mất `width` và `height`**.

Hai số đó dùng để điền thuộc tính `width`/`height` cho thẻ `<img>`. Thiếu chúng, trình duyệt không
biết chừa bao nhiêu chỗ nên chữ bị đẩy xuống khi ảnh tải xong — đúng chỉ số Cumulative Layout Shift
mà Google chấm **25% điểm hiệu năng**.

Vì API không trả, website phải tự tải 15 ảnh cũ về đo tay rồi lưu thành bảng tra
(`src/content/contentImageSizes.ts`). Cách đó chỉ đúng cho dữ liệu hiện có; **ảnh nhân viên đăng
mới sau này sẽ lại không có kích thước**. Phía quản trị đo được ở trình duyệt trước khi tải lên,
nhưng số từ server vẫn chuẩn hơn và không phụ thuộc máy người dùng.

**Đề nghị:** thêm lại `width`, `height` vào phản hồi của `POST /admin/uploads` (S3 không cản trở,
chỉ cần đọc kích thước ảnh lúc nhận file). Đây là thay đổi nhỏ nhưng có ích lâu dài.

### C1. Sửa spec cho khớp code

Ngoài `image` ở mục A1, nên rà lại toàn bộ `nullable` trong `/docs.json`. Hai bên đang dùng
`/docs.json` để đối chiếu, spec sai thì mất tác dụng.

### C2. Đăng nhập không giới hạn số lần thử

Tài liệu ghi rõ *"No rate limiting on the API; login is not throttled."* Endpoint
`POST /admin/auth/login` công khai, không giới hạn → dò mật khẩu được không giới hạn.
Nên chặn theo IP (ví dụ 5 lần/phút) hoặc thêm độ trễ tăng dần.

### C3. `GET /client/degrees/:cccd` trả dữ liệu cá nhân, không cần xác thực

Chỉ cần đúng số CCCD là lấy được **họ tên, ngày sinh, ngành, xếp loại, số bằng** của người đó.
Ai cầm CCCD của người khác (ảnh căn cước, danh sách lớp, dữ liệu rò rỉ) đều tra được, và quét
hàng loạt được vì không giới hạn số lần.

**Đề nghị:** đổi đầu vào thành **số bằng + họ tên** (người tra phải đang cầm tấm bằng), chỉ trả
các trường tối thiểu, và giới hạn số lần tra theo IP. Endpoint `GET /client/certificates` đã làm
đúng hướng này — nó chỉ trả `id, fullName, dateOfBirth, schoolCode` và giấu số định danh.

### C4. Hai tính năng API có mà chưa ai dùng

- `certificate-records` (toàn bộ nhóm, kể cả route nhập hàng loạt): trang quản trị **chưa có màn
  hình nào**, website cũng không gọi `GET /client/certificates`.
- `GET /admin/auth/me`: trang quản trị đang khôi phục phiên từ cookie thay vì gọi route này.

Không phải lỗi — chỉ để biết nếu định bỏ bớt cho gọn.

---

## D. Đã kiểm, không có vấn đề

**Website gọi 8 endpoint, tất cả khớp:**

| Website gọi | Kết quả |
|---|---|
| `GET /client/programs` (kèm `search`) | 200 ✓ |
| `GET /client/programs/:slug` | 200 / 404 đúng ✓ |
| `GET /client/posts` (`page`, `limit`, `noPaginate`) | 200 + `meta` ✓ |
| `GET /client/posts?programSlug=` | 200 ✓ |
| `GET /client/posts/:slug` | 200 / 404 ✓ |
| `GET /client/degrees/:cccd` | 200, mảng rỗng khi không khớp ✓ |
| `POST /client/consultations` | body `fullName, phone, email, note` khớp đúng ✓ |

**Trang quản trị gọi 29 endpoint, không thiếu endpoint nào.**

**Ngày điểm danh nhận `YYYY-MM-DD` bình thường.** `AttendanceInput.date` khai `format: date-time`
trong khi `dob` của học viên và văn bằng là `format: date`, nên ban đầu nghi API từ chối chuỗi ngày
ngắn. Đã thử cả hai định dạng (kèm `studentId` không tồn tại nên không ghi gì): **cả hai đều qua
bước kiểm tra**, lỗi 400 trả về là do khoá ngoại chứ không phải do ngày. Không cần sửa gì.

Cấu trúc trả về `{data}` / `{data, meta}` khớp đúng cái website đang đọc. Tên trường của
`Degree` (`fullName, dob, degreeCode, major, rank, yearOfGrad`) khớp chính xác trang tra cứu
văn bằng. Bản ghi nặng nhất 23 KB, giới hạn body 1 MB nên thoải mái.

**Lưu ý cấu hình:** website gọi `client/...` còn API ở `/api/client/...`, nên `VITE_API_URL` phải
có `/api` ở cuối: `https://truongdaynghe-api.x2ldh2.easypanel.host/api`

---

## E. Cần backend trả lời / bổ sung

E1–E3 là câu hỏi: không tự kiểm được vì database đang trống, mà câu trả lời quyết định website
hiển thị đúng hay sai. E4–E5 là hai trường xin bổ sung cho trang quản trị.

### E1. `/client/posts` có tự lọc `published = true` không?

Website lấy danh sách bài để dựng sitemap và tạo HTML sẵn, rồi báo URL mới cho Bing. Nếu danh sách
công khai trả về cả bài nháp thì **bài chưa đăng sẽ lọt ra sitemap và được đẩy đi lập chỉ mục**.

`/client/programs` có hẳn tham số `includeInactive` nên nhiều khả năng `/client/posts` cũng lọc sẵn,
nhưng cần chốt vì không có tham số tương ứng để kiểm.

### E2. `/client/posts` (danh sách) có kèm `programs[]` không?

Trong spec, `programs` **không** nằm trong danh sách trường bắt buộc của `Post`. Website dùng trường
này để dựng khối "Tin tức liên quan" trên trang ngành và trang bài ngay trong HTML tạo sẵn. Nếu danh
sách không kèm `programs`, các khối đó sẽ rỗng với Google (trình duyệt vá lại sau, nhưng bot chỉ
thấy bản rỗng).

### E3. `GET /client/degrees/:cccd` — spec và thực tế đang khác nhau

| | Spec khai | Thực tế |
|---|---|---|
| `data` | một object `Degree` | **mảng** `Degree[]` |
| Không tìm thấy | `400` | **`200` kèm mảng rỗng** |

```bash
curl "$API/api/client/degrees/012345678901"   # → {"data":[]} [200]
```

Website đang viết theo **thực tế** (xử lý mảng) nên chạy đúng. Nhưng nếu sau này sửa API "cho khớp
spec" thì trang tra cứu văn bằng sẽ im lặng báo không tìm thấy dù có dữ liệu. Đề nghị **sửa spec
theo code**, đừng sửa code theo spec.

### E4. Xin trả `student` kèm trong danh sách văn bằng

`GET /admin/degrees` trả `Degree` trần: `id, cccd, studentId, fullName, dob, degreeCode, major,
rank, yearOfGrad, createdAt` — **không có `student` lồng**, nên trang Văn bằng của quản trị không
hiện được cột **Mã SV** (chỉ có `studentId` là số nội bộ, không phải mã sinh viên).

Điểm danh thì đã làm đúng kiểu này rồi:

```
AttendanceWithStudent = Attendance + student { id, studentCode, fullName }
```

Xin làm tương tự cho danh sách văn bằng. (Lưu ý: tài liệu `API_DOCS.md` mục 4.6 **đang ghi** là có
`student{id,studentCode,dob}`, nhưng `/docs.json` và dữ liệu thật thì không — một chỗ nữa tài liệu
lệch code.)

### E5. Xin một dấu hiệu "đã có bằng" trong danh sách học viên

Trang quản trị cần biết học viên nào đã được cấp bằng, để không cấp trùng. `Student` không có
thông tin đó, nên hiện phải gọi thêm `GET /admin/degrees?noPaginate=true` **mỗi lần mở danh sách
học viên** rồi tự đối chiếu. Dữ liệu còn ít thì không sao, nhiều lên sẽ nặng.

Chỉ cần thêm `degreeCount` (số nguyên) hoặc `hasDegree` (boolean) vào `Student` là đủ.

---

## F. Mấy chỗ nhỏ phía API

- `/client/programs` **không phân trang** và bỏ qua `page`/`limit` nếu gửi. Hiện không sao vì
  website lấy hết, nhưng nếu sau này thêm phân trang kèm `limit` mặc định thì sitemap và HTML tạo
  sẵn sẽ **âm thầm thiếu ngành** mà không báo lỗi. Nếu có kế hoạch thêm, báo trước giúp.
- `/client/degrees/:cccd` trả `400 "Too small: expected string to have >=4 characters"` khi số quá
  ngắn. Website sẽ sửa để hướng dẫn người dùng thay vì báo lỗi chung chung — chỉ ghi lại ở đây để
  backend biết phía website có xử lý.

---

## G. Thứ tự ưu tiên

| | Việc | Vì sao |
|---|---|---|
| 1 | A1 — `image` nhận `null` | Chặn hẳn việc nhập dữ liệu và việc dùng hằng ngày |
| 2 | A2 — `createdAt` khi tạo bài | Không sửa trước khi nhập thì mất ngày đăng vĩnh viễn |
| 3 | B1 — lọc `category` | Trang Du học đang hiện sai nội dung |
| 4 | C3 — tra cứu văn bằng | Lộ dữ liệu cá nhân của người có bằng |
| 5 | E1, E2 — trả lời 2 câu hỏi về `/client/posts` | Quyết định bài nháp có lọt ra Google và khối tin liên quan có rỗng không |
| 6 | E4, E5 — `student` trong danh sách văn bằng, dấu hiệu đã có bằng ở học viên | Quản trị không hiện được Mã SV, và phải gọi thêm một request mỗi lần mở danh sách học viên |
| 7 | C0 — trả lại `width`/`height` khi tải ảnh | Chống xê dịch bố cục, Google chấm 25% điểm hiệu năng |
| 8 | C2 — chặn dò mật khẩu | |
| 9 | E3, C1 — sửa spec cho khớp code | |

Mục 1 và 2 nên làm **trước khi nhập 26 ngành + 19 bài**, vì nhập xong rồi mới sửa thì phải xoá đi
nhập lại.

---

## Phụ lục — những lỗi KHÔNG thuộc backend

Để backend khỏi mất công rà: trong lần soát này cũng tìm ra 9 lỗi ở phía website và trang quản trị
(đọc sai tên trường, gửi sai payload, slug bị tính lại làm đổi URL công khai…). **Tất cả đã sửa
xong bên frontend**, không cần backend làm gì.

Riêng ba chỗ dưới đây là do spec/tài liệu mô tả khác thực tế, nên ghi lại để backend biết nguồn
gốc nhầm lẫn:

- `API_DOCS.md` 4.6 ghi `Degree` có `student{id,studentCode,dob}` — thực tế không có (xem E4).
- `ProgramInput.image` / `PostInput.image` khai `nullable: true` — thực tế không nhận `null` (xem A1).
- `DegreeDetailResponse` khai `data` là object và lỗi `400` — thực tế trả mảng và `200` (xem E3).
