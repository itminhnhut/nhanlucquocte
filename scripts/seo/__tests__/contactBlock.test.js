import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { stripContactBlock } from "../../../src/utils/contactBlock";
import { programPageMeta } from "../../../src/seo/pageMeta";
import { renderAppHtml } from "../../../src/ssr/renderPage";
import { initialDataForPath } from "../../../src/ssr/initialDataForPath";

// Đoạn cuối nội dung 16 ngành thật (API 22/09/2026): khối "Thông tin liên hệ" gõ tay trong Quill
const FIXTURES = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts/seo/__tests__/fixtures/programContactBlocks.json"), "utf8")
);
const withoutTrailingEmpty = (html) => html.replace(/(<p>(<br>|&nbsp;|\s)*<\/p>\s*)+$/, "");

test("should strip the hand-typed contact block from every real program", () => {
  Object.entries(FIXTURES).forEach(([slug, { before, block }]) => {
    const result = stripContactBlock(before + block);

    assert.equal(result, withoutTrailingEmpty(before), slug);
    assert.doesNotMatch(result, /Thông tin liên hệ|Phường 5/, slug);
  });
});

test("should keep content when the contact heading is not a short trailing block", () => {
  const address = "<p>Địa chỉ: Số 6 Phan Đình Giót</p>";
  const cases = [
    `<p><strong>Thông tin liên hệ</strong></p>${address}<h2>Học phí</h2><p>…</p>`,
    `<p><strong>Thông tin liên hệ</strong></p>${address}<p><img src="/qr.png"></p>`,
    "<p><strong>Thông tin liên hệ</strong></p><p>Gọi phòng đào tạo.</p>",
    `<p>Xem thông tin liên hệ bên dưới.</p>${address}`,
    `<p><strong>Thông tin liên hệ</strong></p>${address}<p>${"Nội dung dài. ".repeat(40)}</p>`,
  ];

  cases.forEach((html) => assert.equal(stripContactBlock(html), html));
  assert.equal(stripContactBlock(undefined), "");
});

test("should leave the contact block out of program FAQ schema answers", () => {
  const { before, block } = FIXTURES["ke-toan-doanh-nghiep"];
  const content = `<h2>Câu hỏi thường gặp</h2><h3>Học bao lâu?</h3><p>18 tháng.</p>${before}${block}`;

  const json = JSON.stringify(programPageMeta({ title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP", content }, "ke-toan").jsonLd);

  assert.doesNotMatch(json, /Phường 5|Thông tin liên hệ/);
});

test("should show one contact card with the official address and tappable phone on program pages", () => {
  const slug = "ke-toan-doanh-nghiep";
  const { before, block } = FIXTURES[slug];
  const program = { slug, title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP", content: before + block };
  const path = `/nganh-dao-tao/${slug}`;

  const html = renderAppHtml(path, initialDataForPath(path, { programs: [program], news: [], isComplete: true }));

  assert.doesNotMatch(html, /Phường 5/);
  assert.match(html, /Số 6 Phan Đình Giót, phường Tân Sơn Hòa \(Quận Tân Bình cũ\), TP\. Hồ Chí Minh/);
  assert.match(html, /href="tel:\+84707917119"/);
  assert.match(html, /href="mailto:nhanlucquocte\.edu@trungcapnhanlucquocte\.vn"/);
  assert.equal((html.match(/Liên hệ tư vấn tuyển sinh/g) || []).length, 1);
});

test("should show the contact card at the end of news articles", () => {
  const post = { slug: "hoc-spa", title: "Học spa", content: "<h2>Bước 1</h2><p>Nội dung.</p>" };
  const path = "/tin-tuc/hoc-spa";

  const html = renderAppHtml(path, initialDataForPath(path, { programs: [], news: [post], isComplete: true }));

  assert.equal((html.match(/Liên hệ tư vấn tuyển sinh/g) || []).length, 1);
  assert.match(html, /href="tel:\+84707917119"/);
});
