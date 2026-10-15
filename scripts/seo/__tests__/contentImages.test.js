import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  addImageDimensions,
  dropEmptyHeadings,
  dropEmptyWrappers,
  dropForeignImages,
  fillMissingImageAlt,
  isBorrowedAlt,
  normalizeHeadingLevels,
} from "../../../src/utils/html";
import { CONTENT_IMAGE_SIZES } from "../../../src/content/contentImageSizes";
import { initialDataForPath } from "../../../src/ssr/initialDataForPath";

const mock = (name) =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), `scripts/seo/__tests__/fixtures/${name}.json`), "utf8"));

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
  assert.match(html, /readEnv\("VITE_API_URL"\)/, "danh sách host phải gồm host của API");
  assert.match(html, /readEnv\("VITE_IMAGE_HOSTS"\)/, "phải khai thêm được host CDN qua biến môi trường");
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

test("should keep school images while generating the static HTML, not only in the browser", () => {
  // Tiến trình tạo HTML sẵn đóng gói bằng define: { "import.meta.env": "{}" } và không có window,
  // nên env phải đọc được từ process.env. Thiếu nhánh đó thì API_URL = "" ngay lúc tạo trang,
  // dropForeignImages coi ảnh trên host API là ảnh mượn và XOÁ khỏi HTML tạo sẵn. Nội dung bài đưa
  // vào bằng dangerouslySetInnerHTML nên React không vá lại lúc hydrate → ảnh mất hẳn.
  const before = process.env.VITE_API_URL;
  try {
    process.env.VITE_API_URL = "https://api-cua-truong.example/api";
    const img = '<img src="https://api-cua-truong.example/cdn/uploads/a.png">';
    assert.ok(dropForeignImages(`<p>x</p>${img}`).includes("uploads/a.png"), "ảnh upload bị xoá khi tạo HTML");
    // Ảnh của site khác vẫn phải bị gỡ
    assert.ok(!dropForeignImages('<img src="https://vhnthcm.edu.vn/a.jpg">').includes("vhnthcm"));
  } finally {
    if (before === undefined) delete process.env.VITE_API_URL;
    else process.env.VITE_API_URL = before;
  }
});

test("should let the server declare extra image hosts", () => {
  // VITE_IMAGE_HOSTS trước đây đọc được nhưng docker/env.sh không ghi ra → không có cách nào khai
  // host bucket/CDN mà không dựng lại image.
  const envSh = fs.readFileSync(path.join(process.cwd(), "docker/env.sh"), "utf8");
  // Mặc định là host bucket đang dùng; EasyPanel set biến thì giá trị đó thắng
  assert.match(envSh, /VITE_IMAGE_HOSTS="\$\{VITE_IMAGE_HOSTS:-[^}]*\}"/, "chưa nhận biến từ môi trường");
  const envScript = envSh.split("\n").find((line) => line.includes("window.__ENV__=")) ?? "";
  assert.match(envScript, /VITE_IMAGE_HOSTS/, "chưa đẩy vào window.__ENV__");
  assert.match(envSh, /VITE_IMAGE_HOSTS="\$VITE_IMAGE_HOSTS" nohup node/, "chưa truyền cho tiến trình tạo trang");
});

test("should keep the old site's image files so indexed image URLs survive the cutover", () => {
  // 47 ảnh trong public/img_data KHÔNG còn được bài nào trên web mới trỏ tới (backend đã
  // chuyển hết ảnh sang bucket). Nhưng chúng vẫn đang sống trên chính tên miền của trường:
  //   GET https://trungcapnhanlucquocte.vn/img_data/images/1.jpg → 200 image/jpeg
  // Web mới THAY CHỖ site cũ ở cùng tên miền, nên xoá thư mục này là mọi URL ảnh Google đã
  // index thành 404. 22 MB là giá rẻ để không mất lượt truy cập từ Google Hình ảnh.
  // Khi nào Search Console cho thấy không còn lượt vào từ các URL đó thì mới xoá.
  const dir = path.join(process.cwd(), "public/img_data/images");
  assert.ok(fs.existsSync(dir), "đã xoá public/img_data — URL ảnh site cũ sẽ 404");
  const files = fs.readdirSync(dir).filter((name) => /\.(jpe?g|png|webp|gif)$/i.test(name));
  assert.ok(files.length >= 40, `chỉ còn ${files.length} ảnh, trước đó có 47`);
});

test("should replace alt text pasted from another site's search results", () => {
  // Rà API thật: 21/22 alt trong bài là tiêu đề kết quả tìm ảnh Google, nêu tên đơn vị khác.
  // Google và trình đọc màn hình đều đọc alt → để nguyên là trang của trường PR cho nơi khác.
  const BORROWED = [
    "Trang trí nội thất - Tuyển Sinh Hueic",
    "CỔNG TUYỂN SINH UEH",
    "Cao đẳng kế toán doanh nghiệp - Cao ...",
    "Học viện Nông nghiệp Việt Nam: Đẩy mạnh | Đảng Cộng sản Việt Nam",
    "VIỆC LÀM NGÀNH F&B | Facebook",
    "TOP 26 Địa Chỉ Làm Nail Đẹp, Giảm Và Nổi ...",
    "Nhân viên lễ tân khách sạn là gì? Mức độ ...",
  ];
  BORROWED.forEach((alt) => assert.ok(isBorrowedAlt(alt), `không nhận ra alt vay: ${alt}`));

  const html = `<p><img src="/a.jpg" alt="CỔNG TUYỂN SINH UEH"></p>`;
  const out = fillMissingImageAlt(html, "Liên thông từ trung cấp lên đại học");
  assert.ok(!out.includes("UEH"), "alt của trường khác vẫn còn");
  assert.match(out, /alt="Liên thông từ trung cấp lên đại học"/);
});

test("should keep an alt that really describes the picture", () => {
  const GIU = [
    "Trường Nhân Lực Quốc Tế",
    "Quy trình kế toán bán hàng",
    // Ngành liên thông của trường vốn nói về đại học — không được chặn theo từ khoá ngành học
    "Liên thông từ trung cấp lên đại học",
    "Sinh viên cao đẳng thực hành tại xưởng của trường",
  ];
  GIU.forEach((alt) => assert.ok(!isBorrowedAlt(alt), `gỡ oan alt mô tả thật: ${alt}`));

  const html = `<p><img src="/a.jpg" alt="Quy trình kế toán bán hàng"></p>`;
  assert.equal(fillMissingImageAlt(html, "Kế toán doanh nghiệp"), html);
});

test("should still fill in an alt that is missing entirely", () => {
  const out = fillMissingImageAlt(`<img src="/a.jpg">`, "Điều dưỡng hệ trung cấp");
  assert.match(out, /alt="Điều dưỡng hệ trung cấp"/);
});

test("should not add a second alt to an image that uses single quotes", () => {
  // Chỉ bắt alt nháy kép thì thẻ dùng nháy đơn bị coi là thiếu alt → chèn alt thứ hai, trình
  // duyệt lấy cái ĐẦU nên alt mô tả thật của người viết bị thay oan. CMS này có sinh nháy đơn
  // (chính file html.ts đã phải xử lý nháy đơn cho src và srcset).
  const html = `<p><img src="/a.jpg" alt='Quy trình kế toán bán hàng'></p>`;
  const out = fillMissingImageAlt(html, "Kế toán doanh nghiệp");
  assert.equal((out.match(/\salt\s*=/gi) || []).length, 1, "có 2 thuộc tính alt trong một thẻ");
  assert.ok(out.includes("Quy trình kế toán bán hàng"), "alt mô tả thật bị thay oan");
});

test("should fill in an alt that the author left blank", () => {
  // alt="" trong thân bài là ô bị bỏ trống, không phải khai ảnh trang trí: 22/45 ảnh đang vậy
  const out = fillMissingImageAlt(`<p><img src="/a.jpg" alt=""></p>`, "Điều dưỡng hệ trung cấp");
  assert.match(out, /alt="Điều dưỡng hệ trung cấp"/);
  assert.equal((out.match(/\salt\s*=/gi) || []).length, 1);
});

test("should not let the page title break out of the alt attribute", () => {
  // `$&` trong chuỗi thay thế của String.replace nở thành phần vừa khớp → thẻ hỏng;
  // và dấu < > & chưa escape thì vừa hỏng thuộc tính vừa làm addImageDimensions trượt thẻ
  const out = fillMissingImageAlt(`<img src="/a.jpg">`, 'Giá 5$& <b>khuyến mãi</b> & hơn');
  assert.equal((out.match(/\salt\s*=/gi) || []).length, 1, out);
  // `$&` không được nở thành phần vừa khớp (tức thẻ <img …> không được lọt vào trong alt).
  // Lưu ý: chuỗi escape đúng là "$&amp;" nên không thể kiểm bằng includes("$&").
  assert.ok(!/alt="[^"]*<img/.test(out), out);
  assert.equal((out.match(/<img/gi) || []).length, 1, out);
  // Dấu < > & phải thành thực thể, nếu không thẻ hỏng và addImageDimensions trượt thẻ
  assert.ok(!/alt="[^"]*<b>/.test(out), "thẻ HTML thô lọt vào thuộc tính alt");
  assert.match(out, /alt="Giá 5\$&amp; &lt;b&gt;khuyến mãi&lt;\/b&gt; &amp; hơn"/);
});

test("should replace the real CMS alt that ends in an ellipsis", () => {
  // Giá trị THẬT trong CMS có đuôi ba chấm — fixture trước đó của tôi ghi thiếu
  assert.ok(isBorrowedAlt("Đá massage, hoa lan, khăn tắm..."));
  assert.ok(!isBorrowedAlt("Đá massage, hoa lan, khăn tắm"));
});

test("should clean the alt text in the embedded data too, not just the rendered page", () => {
  // Nội dung nhúng sẵn là chuỗi THÔ từ CMS. Lọc ảnh và link rồi mà quên lọc alt thì trang
  // render sạch nhưng "Tuyển Sinh Hueic" vẫn nằm nguyên trong mã nguồn trang.
  const data = initialDataForPath("/nganh-dao-tao/x", {
    programs: [
      {
        slug: "x",
        title: "Mộc nội thất và trang trí",
        content: `<p><img src="/a.jpg" alt="Trang trí nội thất - Tuyển Sinh Hueic"></p>`,
      },
    ],
    news: [],
  });
  const embedded = JSON.stringify(data);
  assert.ok(!embedded.includes("Hueic"), "alt của site khác vẫn nằm trong dữ liệu nhúng");
  assert.ok(embedded.includes("Mộc nội thất và trang trí"), "mất luôn alt thay thế");
});
