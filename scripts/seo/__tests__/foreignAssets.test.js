import test from "node:test";
import assert from "node:assert/strict";
import { dropForeignImages, unwrapForeignImageLinks } from "../../../src/utils/html";

const API_HOST = "https://api.trungcapnhanlucquocte.vn/api";
const BUCKET = "truongdaynghe-rustfs.x2ldh2.easypanel.host";

const withEnv = (fn) => {
  const before = { api: process.env.VITE_API_URL, hosts: process.env.VITE_IMAGE_HOSTS };
  process.env.VITE_API_URL = API_HOST;
  process.env.VITE_IMAGE_HOSTS = BUCKET;
  try {
    return fn();
  } finally {
    if (before.api === undefined) delete process.env.VITE_API_URL;
    else process.env.VITE_API_URL = before.api;
    if (before.hosts === undefined) delete process.env.VITE_IMAGE_HOSTS;
    else process.env.VITE_IMAGE_HOSTS = before.hosts;
  }
};

test("should not serve another school's image through srcset", () => {
  // Bài lấy từ CMS: src đã chuyển về bucket của trường nhưng srcset còn trỏ website trường khác.
  // Có srcset kèm sizes thì trình duyệt CHỌN TỪ srcset và BỎ QUA src → ảnh của họ vẫn được tải.
  const html = `<p><img alt="" sizes="(max-width: 614px) 100vw, 614px" src="https://${BUCKET}/cdn/uploads/legacy/abc.jpg" srcset="https://vhnthcm.edu.vn/wp-content/uploads/2025/11/VHNT01-533x400.jpg 533w, https://vhnthcm.edu.vn/wp-content/uploads/2025/11/VHNT01.jpg 624w" width="614" /></p>`;
  const out = withEnv(() => dropForeignImages(html));
  assert.ok(!out.includes("vhnthcm.edu.vn"), "srcset vẫn còn ảnh của trường khác");
  assert.ok(!/\ssizes=/i.test(out), "còn sizes thì trình duyệt vẫn ưu tiên srcset");
  assert.ok(out.includes(`src="https://${BUCKET}/cdn/uploads/legacy/abc.jpg"`), "mất ảnh của trường");
});

test("should keep a srcset that only lists the school's own images", () => {
  const html = `<img src="https://${BUCKET}/a.jpg" srcset="https://${BUCKET}/a-300.jpg 300w, /images/a-600.jpg 600w" sizes="100vw">`;
  const out = withEnv(() => dropForeignImages(html));
  assert.ok(out.includes("srcset="), "đã xoá oan srcset của chính trường");
  assert.ok(out.includes("sizes="));
});

test("should unwrap a link that only wraps an image on another school's site", () => {
  // Kiểu WordPress: mỗi ảnh bọc trong <a> trỏ về trang gốc bên đó → vừa PR cho họ,
  // vừa chuyển điểm liên kết sang.
  const html = `<a href="https://vhnthcm.edu.vn/truong-cao-dang-van-hoa-nghe-thuat.../" rel="attachment wp-att-5193"><img src="https://${BUCKET}/x.jpg"></a>`;
  const out = withEnv(() => unwrapForeignImageLinks(html));
  assert.ok(!out.includes("vhnthcm.edu.vn"), "vỏ <a> trỏ trường khác vẫn còn");
  assert.ok(out.includes(`src="https://${BUCKET}/x.jpg"`), "ảnh bị gỡ theo cái vỏ");
});

test("should keep a link that has real text, only marking it nofollow", () => {
  const html = `<p>Xem thêm tại <a href="https://moet.gov.vn/vb/123">Bộ Giáo dục</a>.</p>`;
  const out = withEnv(() => unwrapForeignImageLinks(html));
  assert.ok(out.includes('href="https://moet.gov.vn/vb/123"'), "trích dẫn trong bài bị gỡ oan");
  assert.match(out, /rel="nofollow noopener"/);
});

test("should leave the school's own links untouched", () => {
  const html = `<a href="https://trungcapnhanlucquocte.vn/tin-tuc/abc">Bài khác</a><a href="/nganh-dao-tao/x">Ngành</a>`;
  const out = withEnv(() => unwrapForeignImageLinks(html));
  assert.ok(!out.includes("nofollow"), "link nội bộ bị gắn nofollow");
});
