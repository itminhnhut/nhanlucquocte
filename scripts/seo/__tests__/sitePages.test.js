import test from "node:test";
import assert from "node:assert/strict";
import { renderAppHtml } from "../../../src/ssr/renderPage";
import { initialDataForPath } from "../../../src/ssr/initialDataForPath";

const textOf = (html) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
const headings = (html, level) =>
  [...html.matchAll(new RegExp(`<h${level}[^>]*>([\\s\\S]*?)</h${level}>`, "g"))].map((m) => textOf(m[1]).trim());
const ADDRESS = /Số 6 Phan Đình Giót, phường Tân Sơn Hòa \(Quận Tân Bình cũ\), TP\. Hồ Chí Minh/;

test("should structure the about page with facts, training fields and no unverifiable claims", () => {
  const html = renderAppHtml("/gioi-thieu", {});
  const text = textOf(html);

  assert.deepEqual(headings(html, 1), ["Giới thiệu Trường Trung cấp nghề Nhân Lực Quốc Tế"]);
  assert.ok(headings(html, 2).includes("Thông tin chung"));
  assert.ok(headings(html, 2).includes("Lĩnh vực đào tạo"));
  assert.match(text, /Quyết định số 1777\/LĐTBXH-QĐ/);
  assert.match(text, /Trường Trung cấp nghề Nhân Lực Quốc Tế/);
  assert.match(text, ADDRESS);
  assert.match(html, /href="\/nganh-dao-tao#linh-vuc-lam-dep"/);
  assert.doesNotMatch(text, /Điện, Hàn|top đầu/);
});

test("should give the contact page a keyword heading and machine-readable contact details", () => {
  const html = renderAppHtml("/lien-he", {});

  assert.deepEqual(headings(html, 1), ["Liên hệ Trường Trung cấp nghề Nhân Lực Quốc Tế"]);
  assert.match(html, /<address[^>]*>[\s\S]*Số 6 Phan Đình Giót[\s\S]*<\/address>/);
  assert.match(html, /href="mailto:nhanlucquocte\.edu@trungcapnhanlucquocte\.vn"/);
  assert.match(html, /href="tel:\+84707917119"/);
  assert.doesNotMatch(html, /mail\.google\.com/);
});

const POST = {
  slug: "hoc-spa",
  title: "Học spa chuyên nghiệp",
  summary: "Lộ trình học spa",
  image: "https://cdn.example/spa.png",
  createdAt: "2026-09-10T20:00:00.000Z",
  content: "<h2>Bước 1</h2><p>Nội dung.</p>",
  programs: [{ id: 5, slug: "cham-soc-sac-dep-he-trung-cap", title: "TUYỂN SINH NGÀNH CHĂM SÓC SẮC ĐẸP" }],
};
const CONTENT = { programs: [], news: [POST], isComplete: true };

test("should use a keyword heading and a clean heading order on the news list", () => {
  const html = renderAppHtml("/tin-tuc", initialDataForPath("/tin-tuc", CONTENT));

  assert.deepEqual(headings(html, 1), ["Tin tuyển sinh trung cấp TPHCM"]);
  assert.equal(headings(html, 4).length, 0);
});

test("should mark up news articles with a publish time, publisher byline and stable cover size", () => {
  const html = renderAppHtml("/tin-tuc/hoc-spa", initialDataForPath("/tin-tuc/hoc-spa", CONTENT));

  assert.match(html, /<time dateTime="2026-09-10T20:00:00.000Z">11\/9\/2026<\/time>/);
  assert.match(textOf(html), /Trường Trung cấp nghề Nhân Lực Quốc Tế/);
  assert.match(html, /<img[^>]*class="[^"]*aspect-\[3\/2\][^"]*"[^>]*src="https:\/\/cdn\.example\/spa\.png"|<img[^>]*src="https:\/\/cdn\.example\/spa\.png"[^>]*class="[^"]*aspect-\[3\/2\]/);
  assert.match(textOf(html), /Trung cấp Chăm sóc sắc đẹp/);
  assert.doesNotMatch(textOf(html), /TUYỂN SINH NGÀNH CHĂM SÓC SẮC ĐẸP/);
});

test("should fill the news list with latest posts, a consult card and internal links, with an ItemList schema", async () => {
  const { newsListPageMeta } = await import("../../../src/seo/pageMeta");
  const news = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    slug: `bai-${i}`,
    title: `Bài ${i}`,
    summary: "Tóm tắt",
    createdAt: "2026-09-10T02:00:00.000Z",
    programs: i === 6 ? [{ slug: "khai-giang-ky-thuat-lam-banh-khoa-106-he-trung-cap", title: "TUYỂN SINH NGÀNH KỸ THUẬT LÀM BÁNH" }] : [],
  }));
  const content = { programs: [], news, isComplete: true };
  const html = renderAppHtml("/tin-tuc", initialDataForPath("/tin-tuc", content)).replace(/<!-- -->/g, "");
  assert.match(html, /Mới cập nhật/);
  assert.match(html, /Tư vấn tuyển sinh miễn phí/);
  assert.match(html, /href="\/cam-nang\/nen-hoc-nghe-gi"/);
  assert.match(html, /href="\/nganh-dao-tao#linh-vuc-am-thuc"/);
  // Nhãn ngành lấy từ dữ liệu bài, không gắn cứng "Tin tức" cho mọi bài
  assert.match(html, /Trung cấp ngành Kỹ thuật làm bánh/);
  assert.doesNotMatch(html, />Tin tức<\/span><span>•/);
  assert.equal(headings(html, 1).length, 1);
  assert.equal(headings(html, 4).length, 0);
  const graph = JSON.stringify(newsListPageMeta(news).jsonLd);
  assert.match(graph, /"@type":"ItemList"/);
  assert.match(graph, /tin-tuc\/bai-9/);
});
