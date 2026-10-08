import test from "node:test";
import assert from "node:assert/strict";
import { extractFaqSection, renderFaqAccordion } from "../../../src/seo/faq";
import { hashToElementId } from "../../../src/utils/scrollToHash";

test("should keep intro text and image-only answers when rendering the FAQ accordion", () => {
  const html =
    "<h2>Câu hỏi thường gặp</h2><p>Lời dẫn quan trọng.</p>" +
    '<h3>Xem ảnh lớp học?</h3><p><img src="/lop.jpg"></p>' +
    "<h3>Học bao lâu?</h3><p>18 tháng.</p>";

  const rendered = renderFaqAccordion(html);

  assert.match(rendered, /Lời dẫn quan trọng\./);
  assert.match(rendered, /<img src="\/lop\.jpg">/);
  assert.equal((rendered.match(/<details/g) || []).length, 2);
});

test("should leave image-only answers out of FAQPage schema text but keep them for display", () => {
  const section = extractFaqSection('<h2>FAQ</h2><h3>Ảnh?</h3><p><img src="/a.jpg"></p><h3>Hỏi?</h3><p>Đáp.</p>');

  assert.equal(section.items.length, 2);
  assert.deepEqual(section.items.filter((item) => item.answerText).map((item) => item.question), ["Hỏi?"]);
});

test("should not throw on malformed URL hash", () => {
  assert.equal(hashToElementId("#register"), "register");
  assert.equal(hashToElementId("#nganh-cham-soc-sac-dep"), "nganh-cham-soc-sac-dep");
  assert.equal(hashToElementId("#%E0%A4%A"), "%E0%A4%A");
});
