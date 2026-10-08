import test from "node:test";
import assert from "node:assert/strict";
import { renderAppHtml } from "../../../src/ssr/renderPage";
import { initialDataForPath } from "../../../src/ssr/initialDataForPath";
import { staticPageMeta } from "../../../src/seo/pageMeta";
import { buildSitemap } from "../sitemap";

const strip = (html) => html.replace(/<!-- -->/g, "");
const NOW = new Date("2026-09-25T03:00:00.000Z");
const programs = [
  { slug: "tuyen-sinh-cong-nghe-ky-thuat-o-to-khai-giang-ngay-03-03-2026", title: "TUYỂN SINH NGÀNH CÔNG NGHỆ KỸ THUẬT Ô TÔ", description: "KHAI GIẢNG NGÀY 07.10.2026" },
  { slug: "ke-toan-doanh-nghiep", title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP", description: "" },
];

test("should prerender /tuyen-sinh with the program catalog by field", () => {
  const data = initialDataForPath("/tuyen-sinh", { programs, news: [] }, NOW);
  assert.equal(data.renderedAt, NOW.toISOString());
  const html = strip(renderAppHtml("/tuyen-sinh", data));

  assert.equal((html.match(/<h1/g) || []).length, 1);
  assert.match(html, /Tuyển sinh trung cấp nghề Nhân Lực Quốc Tế TPHCM<\/h1>/);
  assert.match(html, /Kỹ thuật sửa chữa ô tô/);
  assert.match(html, /Hệ trung cấp/);
  assert.match(html, /Liên thông đại học/);
  // Trường chưa công bố học phí: không có con số học phí, tỷ lệ
  const visibleText = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visibleText, /triệu|đồng\/|VNĐ|\d\s?%/);
});

test("should index /tuyen-sinh with a breadcrumb and list it in the sitemap", () => {
  const meta = staticPageMeta("/tuyen-sinh");
  assert.ok(meta.isIndexable);
  assert.ok(meta.title.length <= 60, meta.title);
  assert.ok(meta.description.length <= 160, meta.description);
  assert.match(JSON.stringify(meta.jsonLd), /"name":"Tuyển sinh"/);
  assert.match(buildSitemap({}), /<loc>https:\/\/trungcapnhanlucquocte\.vn\/tuyen-sinh<\/loc>/);
});
