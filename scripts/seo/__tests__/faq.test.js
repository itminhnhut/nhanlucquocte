import test from "node:test";
import assert from "node:assert/strict";
import { extractFaqSection, renderFaqAccordion } from "../../../src/seo/faq";
import { programPageMeta } from "../../../src/seo/pageMeta";

const CONTENT =
  "<p>Giới thiệu ngành.</p>" +
  "<h2>Câu hỏi thường gặp</h2>" +
  "<h3>Học trung cấp kế toán bao lâu?</h3><p>Khoảng <strong>18 tháng</strong>.</p>" +
  "<h3>Có học buổi tối không?</h3><p>Có lớp buổi tối.</p>" +
  "<h2>Thông tin liên hệ</h2><p>Số 6 Phan Đình Giót</p>";

test("should read questions and answers under the FAQ heading only", () => {
  const section = extractFaqSection(CONTENT);

  assert.deepEqual(
    section.items.map((item) => [item.question, item.answerText]),
    [
      ["Học trung cấp kế toán bao lâu?", "Khoảng 18 tháng."],
      ["Có học buổi tối không?", "Có lớp buổi tối."],
    ]
  );
});

test("should return null when content has no FAQ section or no answered questions", () => {
  assert.equal(extractFaqSection("<h2>Mục tiêu</h2><p>…</p>"), null);
  assert.equal(extractFaqSection("<h2>Câu hỏi thường gặp</h2><h3>Hỏi?</h3>"), null);
  assert.equal(extractFaqSection(undefined), null);
});

test("should render FAQ as accordion and keep content outside the section", () => {
  const html = renderFaqAccordion(CONTENT);

  assert.equal((html.match(/<details/g) || []).length, 2);
  assert.match(html, /^<p>Giới thiệu ngành\.<\/p>/);
  assert.match(html, /<h2>Thông tin liên hệ<\/h2><p>Số 6 Phan Đình Giót<\/p>$/);
  assert.equal(renderFaqAccordion("<p>Không có FAQ</p>"), "<p>Không có FAQ</p>");
});

test("should escape question text inside the accordion", () => {
  const html = renderFaqAccordion('<h2>FAQ</h2><h3>Có <img src=x onerror="alert(1)"> không?</h3><p>Có.</p>');

  assert.doesNotMatch(html, /onerror/);
});

test("should add FAQPage schema to program page when content has FAQ", () => {
  const meta = programPageMeta({ title: "TUYỂN SINH NGÀNH KẾ TOÁN", content: CONTENT }, "ke-toan");

  const faq = meta.jsonLd[0]["@graph"].find((node) => node["@type"] === "FAQPage");

  assert.equal(faq.mainEntity.length, 2);
  assert.equal(faq.mainEntity[1].acceptedAnswer.text, "Có lớp buổi tối.");
});
