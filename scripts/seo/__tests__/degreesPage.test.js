import test from "node:test";
import assert from "node:assert/strict";
import { renderAppHtml } from "../../../src/ssr/renderPage";

test("should prerender the degrees page with a keyword heading and a lookup guide", () => {
  const html = renderAppHtml("/tra-cuu-van-bang", {});
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  assert.match(html, /<h1[^>]*>Tra cứu văn bằng, chứng chỉ Trường Trung cấp nghề Nhân Lực Quốc Tế<\/h1>/);
  assert.match(text, /Cách tra cứu văn bằng/);
  assert.match(text, /Không tìm thấy kết quả\?/);
  assert.match(text, /xác minh văn bằng/i);
  assert.match(html, /href="mailto:nhanlucquocte\.edu@trungcapnhanlucquocte\.vn"/);
  assert.ok(text.split(" ").length > 350, `số từ: ${text.split(" ").length}`);
});
