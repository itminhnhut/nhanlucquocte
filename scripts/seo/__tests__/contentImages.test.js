import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  addImageDimensions,
  dropEmptyHeadings,
  dropEmptyWrappers,
  dropForeignImages,
  normalizeHeadingLevels,
} from "../../../src/utils/html";
import { CONTENT_IMAGE_SIZES } from "../../../src/content/contentImageSizes";

const mock = (name) =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), `public/mock/${name}.json`), "utf8"));

/** Chạy đúng chuỗi xử lý như trang ngành và trang tin */
const clean = (html) =>
  addImageDimensions(normalizeHeadingLevels(dropEmptyWrappers(dropEmptyHeadings(dropForeignImages(html)))));

test("should drop every image borrowed from another website", () => {
  // Nội dung gốc của trường chèn ảnh thumbnail Google, ảnh của trường khác (vhnthcm.edu.vn,
  // hcmcc.edu.vn, hueic.edu.vn…) và ảnh Facebook CDN. Không dùng ảnh không phải của trường.
  const html = `<p>x</p>
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:abc" alt="a">
    <img src="https://vhnthcm.edu.vn/anh.jpg" alt="b">
    <img src="https://scontent.fsgn8-4.fna.fbcdn.net/v/x.jpg" alt="c">
    <img src="https://trungcapnhanlucquocte.vn/img_data/images/vf3.jpg" alt="d">
    <img src="/images/gallery/lop-tieng-han.webp" alt="e">`;
  const out = clean(html);
  ["gstatic.com", "vhnthcm.edu.vn", "fbcdn.net"].forEach((host) =>
    assert.ok(!out.includes(host), `còn ảnh mượn từ ${host}`)
  );
  assert.ok(out.includes("trungcapnhanlucquocte.vn/img_data/images/vf3.jpg"), "giữ ảnh của trường");
  assert.ok(out.includes("/images/gallery/lop-tieng-han.webp"), "giữ ảnh của web này");
  assert.ok(out.includes("<p>x</p>"), "chữ của bài giữ nguyên");
});

test("should not leave a single borrowed image anywhere in the published content", () => {
  const borrowed = [];
  ["programs", "posts"].forEach((name) =>
    mock(name).forEach((item) => {
      const out = clean(item.content || "");
      [...out.matchAll(/<img[^>]+src="(https?:\/\/[^"]+)"/gi)].forEach(([, src]) => {
        if (new URL(src).host !== "trungcapnhanlucquocte.vn") borrowed.push(`${item.slug}: ${src}`);
      });
    })
  );
  assert.deepEqual(borrowed, []);
});

test("should give every content image a width and height so the page does not jump", () => {
  const missing = [];
  ["programs", "posts"].forEach((name) =>
    mock(name).forEach((item) => {
      [...clean(item.content || "").matchAll(/<img\b[^>]*>/gi)].forEach(([tag]) => {
        if (!/\swidth=/i.test(tag) || !/\sheight=/i.test(tag)) missing.push(`${item.slug}: ${tag.slice(0, 90)}`);
      });
    })
  );
  assert.deepEqual(missing, []);
});

test("should measure sizes from the real files, not guess a ratio", () => {
  const sizes = Object.values(CONTENT_IMAGE_SIZES);
  assert.ok(sizes.length >= 15);
  // Đoán tỉ lệ thì mọi ảnh sẽ cùng một tỉ lệ — số đo thật thì mỗi ảnh một khác
  const ratios = new Set(sizes.map((s) => (s.width / s.height).toFixed(3)));
  assert.ok(ratios.size > sizes.length / 2, "các ảnh phải có tỉ lệ khác nhau");
  sizes.forEach((s) => {
    assert.ok(Number.isInteger(s.width) && s.width > 0);
    assert.ok(Number.isInteger(s.height) && s.height > 0);
  });
});

test("should remove empty headings that break the heading order", () => {
  const out = dropEmptyHeadings("<h2>Thật</h2><h3>&nbsp;</h3><h3> </h3><h3><br></h3><h3>Có chữ</h3>");
  assert.equal(out, "<h2>Thật</h2><h3>Có chữ</h3>");
});

test("should not leave an empty link to another school after removing its image", () => {
  // Trong bài có 6 thẻ <a href="https://vhnthcm.edu.vn/..."> chỉ bọc ảnh. Gỡ ảnh mà để lại thẻ <a>
  // thì trang vẫn còn liên kết sang website trường khác, lại là liên kết rỗng không ai bấm được.
  const html = `<p><a href="https://vhnthcm.edu.vn/x"><img src="https://vhnthcm.edu.vn/a.jpg"></a></p><p>Chữ thật</p>`;
  const out = dropEmptyWrappers(dropForeignImages(html));
  assert.ok(!out.includes("vhnthcm.edu.vn"), out);
  assert.ok(!/<p>\s*<\/p>/.test(out), "còn đoạn trắng");
  assert.ok(out.includes("Chữ thật"));
});

test("should leave no empty wrapper in any published article", () => {
  const leftovers = [];
  ["programs", "posts"].forEach((name) =>
    mock(name).forEach((item) => {
      const out = dropEmptyWrappers(clean(item.content || ""));
      [/<p>\s*(?:&nbsp;|<br\s*\/?>)?\s*<\/p>/gi, /<a\b[^>]*>\s*<\/a>/gi, /<figure\b[^>]*>\s*<\/figure>/gi].forEach(
        (pattern) => {
          const hits = out.match(pattern);
          if (hits) leftovers.push(`${item.slug}: ${hits[0].slice(0, 60)}`);
        }
      );
    })
  );
  assert.deepEqual(leftovers, []);
});

test("should lift headings so the page never jumps from H1 to H3", () => {
  // 3 bài của trường bắt đầu thẳng bằng <h3> (người soạn chọn theo cỡ chữ, không theo bậc)
  assert.equal(
    normalizeHeadingLevels("<h3>Mục lớn</h3><p>a</p><h4>Mục nhỏ</h4>"),
    "<h2>Mục lớn</h2><p>a</p><h3>Mục nhỏ</h3>"
  );
  // Bài đã đúng bậc thì giữ nguyên
  const ok = "<h2>A</h2><h3>B</h3>";
  assert.equal(normalizeHeadingLevels(ok), ok);

  const jumps = [];
  ["programs", "posts"].forEach((name) =>
    mock(name).forEach((item) => {
      const out = normalizeHeadingLevels(clean(item.content || ""));
      const levels = [...out.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
      if (levels.length && Math.min(...levels) > 2) jumps.push(`${item.slug}: H${Math.min(...levels)}`);
    })
  );
  assert.deepEqual(jumps, []);
});

test("should keep images the school uploads through the admin", () => {
  // Ảnh upload qua trang quản trị nằm ở /admin/uploads của BACKEND → URL trên tên miền API,
  // không phải trungcapnhanlucquocte.vn. Lọc theo mỗi tên miền web là xoá sạch ảnh của trường.
  const html = fs.readFileSync(path.join(process.cwd(), "src/utils/html.ts"), "utf8");
  assert.match(html, /API_URL/, "danh sách host phải gồm host của API");
  assert.match(html, /EXTRA_IMAGE_HOSTS/, "phải khai thêm được host CDN qua biến môi trường");
  // Và phải nhắc lý do, để sau không ai rút gọn lại thành mỗi tên miền web
  assert.match(html, /upload|quản trị/i);
});

test("should ship every image the articles point at, so nothing breaks at cutover", () => {
  // Data bê nguyên từ site cũ nên ảnh trong bài vẫn trỏ trungcapnhanlucquocte.vn/img_data/...
  // Web mới THAY CHỖ site cũ ở chính tên miền đó → không mang theo file là chết toàn bộ ảnh bài.
  const missing = [];
  ["programs", "posts"].forEach((name) =>
    mock(name).forEach((item) => {
      const blob = `${item.content || ""} ${item.image || ""}`.replace(/&amp;/g, "&");
      [...blob.matchAll(/https:\/\/trungcapnhanlucquocte\.vn\/+(img_data\/[^"\s\\)<>]+)/g)].forEach(
        ([, rel]) => {
          const file = path.join(process.cwd(), "public", decodeURIComponent(rel.replace(/[.,]+$/, "")));
          if (!fs.existsSync(file)) missing.push(`${item.slug}: ${rel}`);
        }
      );
    })
  );
  assert.deepEqual(missing, [], "thiếu file ảnh trong public/img_data");
});
