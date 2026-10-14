import test from "node:test";
import assert from "node:assert/strict";
import { closeUnclosedTags } from "../../../src/utils/html";

test("should close tags the CMS left open", () => {
  // Đúng hình dạng bài ngành "Chăm sóc da": nội dung bị cắt giữa markup
  const html = `<p>Nội dung</p><p style="x"><span><b><span style="y">`;
  const out = closeUnclosedTags(html);
  assert.equal(out, `${html}</span></b></span></p>`);
});

test("should leave every tag balanced, which is what stops the hydration mismatch", () => {
  // Thẻ mở mà không đóng là lý do trình duyệt kéo phần sau vào trong nó, làm cây DOM khác cây
  // React dựng từ cùng chuỗi → React bỏ hết HTML tạo sẵn. Nên phép kiểm thật là: sau khi vá,
  // mọi thẻ (trừ thẻ rỗng) phải có số mở bằng số đóng.
  const VOID = new Set(["img", "br", "hr", "input", "meta", "link", "source", "col", "area"]);
  const demTheo = (html) => {
    const dem = {};
    for (const [, closing, name] of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g)) {
      const tag = name.toLowerCase();
      if (VOID.has(tag)) continue;
      dem[tag] = (dem[tag] ?? 0) + (closing ? -1 : 1);
    }
    return dem;
  };
  // Hình dạng thật: thiếu 1 </b>, 1 </p>, 4 </span>
  const vo = `<p>Chữ</p><p><span><b><span><span><span>`;
  assert.deepEqual(
    Object.entries(demTheo(vo)).filter(([, n]) => n !== 0),
    [["p", 1], ["span", 4], ["b", 1]],
    "mẫu thử phải thực sự bị lệch thẻ"
  );
  const sau = demTheo(closeUnclosedTags(vo));
  assert.deepEqual(
    Object.entries(sau).filter(([, n]) => n !== 0),
    [],
    "còn thẻ chưa đóng sau khi vá"
  );
});

test("should leave well-formed content untouched", () => {
  const html = `<h2>Tiêu đề</h2><p>Đoạn <b>đậm</b> và <img src="/a.jpg"><br></p>`;
  assert.equal(closeUnclosedTags(html), html);
});

test("should treat void and self-closing tags as needing no closer", () => {
  assert.equal(closeUnclosedTags(`<p><img src="/a.jpg"><br><hr></p>`), `<p><img src="/a.jpg"><br><hr></p>`);
  assert.equal(closeUnclosedTags(`<p><img src="/a.jpg" /></p>`), `<p><img src="/a.jpg" /></p>`);
});

test("should ignore a stray closing tag instead of crashing", () => {
  assert.equal(closeUnclosedTags(`Chữ</span></p>`), `Chữ</span></p>`);
});

test("should return an empty string for anything that is not a string", () => {
  assert.equal(closeUnclosedTags(undefined), "");
  assert.equal(closeUnclosedTags(null), "");
  assert.equal(closeUnclosedTags(42), "");
});
