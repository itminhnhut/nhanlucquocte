import test from "node:test";
import assert from "node:assert/strict";
import { stripEditorStyling, stripUnsafeMarkup, wrapTables } from "../../../src/utils/html";
import { prepareArticleContent } from "../../../src/utils/articleContent";

// Hình dạng thật của bài "Dược sĩ hệ trung cấp": Word dán vào ba lớp span lồng nhau
const WORD = `<p style="margin-bottom:11px"><span style="font-size:12pt"><span style="line-height:115%"><span style="font-family:Aptos,sans-serif"><b>Học kỳ 1:</b></span></span></span></p>`;

test("should drop the font and spacing Word pasted in", () => {
  const out = stripEditorStyling(WORD);
  assert.ok(!out.includes("Aptos"));
  assert.ok(!out.includes("12pt"));
  assert.ok(!out.includes("margin-bottom"));
  assert.ok(!out.includes("line-height"));
});

test("should keep every word the school wrote", () => {
  const chu = (html) => html.replace(/<[^>]+>/g, "").trim();
  assert.equal(chu(stripEditorStyling(WORD)), chu(WORD));
});

test("should drop the editor link colour so links use the site style", () => {
  const html = `<a href="https://drive.google.com/x" style="color:#467886; text-decoration:underline" target="_blank">Chính trị</a>`;
  const out = stripEditorStyling(html);
  assert.ok(!out.includes("#467886"));
  assert.ok(out.includes('href="https://drive.google.com/x"'), "giữ nguyên link");
  assert.ok(out.includes('target="_blank"'), "giữ nguyên thuộc tính khác");
});

test("should keep alignment and the pre-wrap Lexical writes", () => {
  const html = `<p style="text-align: center; font-size: 14pt"><span style="white-space: pre-wrap;">Giữa dòng</span></p>`;
  const out = stripEditorStyling(html);
  assert.ok(out.includes("text-align: center"));
  assert.ok(out.includes("white-space: pre-wrap"));
  assert.ok(!out.includes("14pt"));
});

test("should unwrap the legacy font tag", () => {
  const out = stripEditorStyling(`<p><font face="Calibri" color="#ff0000">Chữ</font></p>`);
  assert.equal(out, `<p>Chữ</p>`);
});

test("should leave an element without style untouched", () => {
  const html = `<p class="lexical-paragraph"><span>Bình thường</span></p>`;
  assert.equal(stripEditorStyling(html), html);
});

test("should not break a self-closing image", () => {
  // Kích thước ảnh không còn nằm trong inline style: chỉ một chiều thì bỏ hẳn, đủ hai chiều
  // thì chuyển thành thuộc tính (xem bài kiểm "forced pixel height" bên dưới)
  const out = stripEditorStyling(`<img src="/a.jpg" alt="Lớp học" style="font-size:12pt; width: 300px" />`);
  assert.ok(out.includes('src="/a.jpg"'));
  assert.ok(out.includes('alt="Lớp học"'));
  assert.ok(!/style=/.test(out));
  assert.ok(!out.includes("12pt"));
  assert.ok(out.trim().endsWith("/>"), "vẫn là thẻ tự đóng");
});

test("should run inside the article pipeline, not only on its own", () => {
  const { html } = prepareArticleContent(WORD, "Dược sĩ hệ trung cấp");
  assert.ok(!html.includes("Aptos"));
  assert.ok(html.includes("Học kỳ 1:"));
});

test("should return an empty string for anything that is not a string", () => {
  assert.equal(stripEditorStyling(null), "");
  assert.equal(stripEditorStyling(undefined), "");
  assert.equal(stripEditorStyling(42), "");
});

test("should put a scroll wrapper around a table so it fills the column", () => {
  const out = wrapTables(`<p>Trước</p><table><tbody><tr><td>Hóa dược</td></tr></tbody></table><p>Sau</p>`);
  assert.ok(out.includes(`<div class="rich-text-table"><table>`));
  assert.ok(out.includes(`</table></div>`));
  assert.ok(out.includes("<p>Trước</p>") && out.includes("<p>Sau</p>"));
});

test("should wrap every table in the article, not only the first", () => {
  const out = wrapTables(`<table><tr><td>a</td></tr></table><table><tr><td>b</td></tr></table>`);
  assert.equal(out.match(/rich-text-table/g)?.length, 2);
});

test("should leave content without a table untouched", () => {
  const html = `<p>Không có bảng</p>`;
  assert.equal(wrapTables(html), html);
});

test("should not leave a forced pixel height on an image", () => {
  // Hình dạng thật của bài "Hoạt động hiến máu": inline style ép khung cao 1152px, trong khi ảnh
  // co lại vừa cột → thừa ra một mảng trắng lớn dưới ảnh
  const html = `<p><img alt="Hiến máu" src="/a.png" style="width: 2048px; height: 1152px;" /></p>`;
  const out = stripEditorStyling(html);
  assert.ok(!/style=/.test(out), "bỏ hẳn inline style");
  assert.ok(out.includes('width="2048"') && out.includes('height="1152"'), "giữ tỉ lệ bằng thuộc tính");
});

test("should keep the aspect ratio so the layout does not jump", () => {
  const out = stripEditorStyling(`<img src="/a.png" style="width: 600px; height: 400px" />`);
  const w = Number(/width="(\d+)"/.exec(out)?.[1]);
  const h = Number(/height="(\d+)"/.exec(out)?.[1]);
  assert.equal(w / h, 1.5);
});

test("should not overwrite width and height the CMS already wrote as attributes", () => {
  const out = stripEditorStyling(`<img src="/a.png" width="800" height="600" style="width: 2048px; height: 1152px" />`);
  assert.ok(out.includes('width="800"') && out.includes('height="600"'));
  assert.ok(!out.includes("2048"));
});

test("should ignore sizes that are not in pixels", () => {
  const out = stripEditorStyling(`<img src="/a.png" style="width: 100%; height: auto" />`);
  assert.ok(!/width="/.test(out), "không đoán kích thước từ phần trăm");
});

test("should still strip style when an attribute value contains a closing bracket", () => {
  // Trước đây regex cắt thẻ ở dấu ">" đầu tiên nên thẻ này lọt qua nguyên vẹn
  const out = stripEditorStyling(`<img alt="rộng > cao" src="/a.png" style="font-size:12pt; height: 10px; width: 20px" />`);
  assert.ok(!out.includes("12pt"), "vẫn phải bỏ rác Word");
  assert.ok(out.includes('alt="rộng > cao"'), "giữ nguyên alt");
  assert.ok(out.includes('width="20"') && out.includes('height="10"'));
});

test("should wrap the outer table only, keeping a nested table intact", () => {
  const out = wrapTables(`<table><tr><td><table><tr><td>x</td></tr></table></td></tr></table>`);
  assert.equal(out.match(/rich-text-table/g)?.length, 1, "chỉ bọc bảng ngoài cùng");
  assert.ok(out.endsWith("</table></div>"), "div phải đóng SAU bảng ngoài cùng");
  assert.equal((out.match(/<table/g) || []).length, 2, "không mất bảng con");
});

test("should leave a table without its closing tag alone", () => {
  const html = `<table><tr><td>x</td></tr>`;
  assert.equal(wrapTables(html), html);
});

test("should ignore a stray closing table tag instead of cutting content", () => {
  const html = `<p>trước</p></table><p>sau</p>`;
  assert.equal(wrapTables(html), html);
});

test("should never turn a quoted style value into a live event handler", () => {
  // Word/Google Docs ghi style bằng nháy đơn, nên giá trị có thể chứa dấu nháy kép. Ghép lại
  // thiếu cẩn thận thì chuỗi trơ thành thuộc tính CHẠY THẬT trên trang công khai.
  const out = stripEditorStyling(`<p style='text-align:center" onmouseover="window.x=1'>Bấm</p>`);
  assert.ok(!/onmouseover/i.test(out), "không được đẻ ra thuộc tính sự kiện");
  assert.ok(out.includes("Bấm"), "chữ của bài vẫn còn");
});

test("should drop any declaration carrying a quote, even a kept one", () => {
  const out = stripEditorStyling(`<p style='white-space:pre-wrap" onclick="x()'>a</p>`);
  assert.ok(!/onclick/i.test(out));
  assert.ok(!/"/.test(out.replace(/<p>|<\/p>/g, "")) || !out.includes("pre-wrap\""));
});

test("should keep strikethrough and underline, which carry meaning", () => {
  const out = stripEditorStyling(`<span style="text-decoration: line-through; font-size: 12pt">Đã huỷ</span>`);
  assert.ok(out.includes("line-through"), "gạch ngang là nghĩa, không phải trang trí");
  assert.ok(!out.includes("12pt"));
});

test("should not let an unclosed table swallow the rest of the article", async () => {
  const { prepareArticleContent: chuanBi } = await import("../../../src/utils/articleContent");
  const { html } = chuanBi(
    `<h2>Chương trình</h2><table><tbody><tr><td>Học kỳ 1</td></tr></tbody>` +
      `<p>Đoạn sau bảng.</p><h2>Cơ hội việc làm</h2><p>Nội dung cuối bài.</p>`,
    "Thử"
  );
  const moKhung = html.indexOf('class="rich-text-table"');
  if (moKhung !== -1) {
    const dongKhung = html.indexOf("</div>", moKhung);
    const trongKhung = html.slice(moKhung, dongKhung);
    assert.ok(!trongKhung.includes("Nội dung cuối bài"), "phần cuối bài phải nằm NGOÀI khung cuộn");
  }
  assert.ok(html.includes("Nội dung cuối bài"), "không được mất chữ");
});

test("should drop a style block pasted from Word so it cannot restyle the whole site", () => {
  const out = stripUnsafeMarkup(`<style><!-- p.MsoNormal {font-size:12.0pt} --></style><p>Nội dung</p>`);
  assert.ok(!out.includes("<style"), "style chèn qua innerHTML có hiệu lực toàn trang");
  assert.ok(out.includes("Nội dung"));
});

test("should strip event handlers and javascript urls from CMS content", () => {
  const out = stripUnsafeMarkup(
    `<img src="x" onerror="alert(1)"><a href="javascript:alert(1)">x</a><script>alert(1)</script>`
  );
  assert.ok(!/onerror/i.test(out));
  assert.ok(!/javascript:/i.test(out));
  assert.ok(!/<script/i.test(out));
});

test("should keep a YouTube embed but drop an iframe pointing anywhere else", () => {
  const giu = stripUnsafeMarkup(`<iframe src="https://www.youtube.com/embed/abc"></iframe>`);
  const bo = stripUnsafeMarkup(`<iframe src="https://evil.example/x"></iframe>`);
  assert.ok(giu.includes("youtube.com"), "trình soạn thảo có khối video thật");
  assert.equal(bo, "");
});

test("should return an empty string for anything that is not a string (wrapTables)", () => {
  assert.equal(wrapTables(null), "");
  assert.equal(wrapTables(undefined), "");
  assert.equal(wrapTables(42), "");
});

test("should be safe to run twice", () => {
  const html = `<p style="font-size:12pt"><img src="/a.png" style="width:600px;height:400px"></p>`;
  const mot = stripEditorStyling(html);
  assert.equal(stripEditorStyling(mot), mot, "chạy ở máy chủ rồi chạy lại ở trình duyệt");
});
