import test from "node:test";
import assert from "node:assert/strict";
import { formatDateVi } from "../../../src/utils/formatDate";
import { prepareArticleContent } from "../../../src/utils/articleContent";
import { lazyLoadImages } from "../../../src/utils/html";
import { initialDataForPath } from "../../../src/ssr/initialDataForPath";
import { renderAppHtml } from "../../../src/ssr/renderPage";

const PROGRAM = {
  id: 1,
  slug: "chuyen-nganh-dieu-duong-he-trung-cap",
  title: "TUYỂN SINH NGÀNH ĐIỀU DƯỠNG",
  description: "KHAI GIẢNG NGÀY 07.09.2026",
  content: "<p>Nội dung ngành điều dưỡng chi tiết.</p>",
  active: true,
};
const POST = {
  id: 9,
  slug: "hoc-spa",
  title: "Học spa chuyên nghiệp",
  summary: "Lộ trình học spa",
  createdAt: "2026-09-10T20:00:00.000Z",
  content: '<h2 id="buoc-1">Bước 1</h2><p>Nội dung bài spa.</p>',
  programs: [{ slug: "chuyen-nganh-dieu-duong-he-trung-cap" }],
};
const CONTENT = { programs: [PROGRAM], news: [POST], isComplete: true };

test("should format dates in Vietnam time regardless of server timezone", () => {
  assert.equal(formatDateVi("2026-09-10T20:00:00.000Z"), "11/9/2026");
  assert.equal(formatDateVi("2026-01-05T01:00:00.000Z"), "5/1/2026");
  assert.equal(formatDateVi(""), "");
  assert.equal(formatDateVi("không phải ngày"), "");
});

test("should give article headings unique ids and list them for the table of contents", () => {
  const { html, headings } = prepareArticleContent(
    '<h1>Giới thiệu</h1><div class="ql-toc-block"><a href="#x">x</a></div>' +
      '<h2 id="da-co">Đã có id</h2><h3>Học phí</h3><h3>Học phí</h3>'
  );

  assert.deepEqual(
    headings.map(({ id, level }) => [id, level]),
    [
      ["gioi-thieu", 2],
      ["da-co", 2],
      ["hoc-phi", 3],
      ["hoc-phi-2", 3],
    ]
  );
  assert.match(html, /<h2 id="gioi-thieu">Giới thiệu<\/h2>/);
  assert.match(html, /<h3 id="hoc-phi-2">Học phí<\/h3>/);
  assert.doesNotMatch(html, /ql-toc-block/);
  assert.deepEqual(prepareArticleContent(undefined), { html: "", headings: [] });
});

test("should embed only the data each page renders, without list item content", () => {
  const home = initialDataForPath("/", CONTENT);
  assert.deepEqual(Object.keys(home).sort(), ["posts:1", "programs"]);
  assert.equal(home.programs[0].content, undefined);
  assert.equal(home["posts:1"].data[0].content, undefined);

  const detail = initialDataForPath("/nganh-dao-tao/chuyen-nganh-dieu-duong-he-trung-cap", CONTENT);
  assert.equal(detail["program:chuyen-nganh-dieu-duong-he-trung-cap"].content, PROGRAM.content);
  assert.deepEqual(
    detail["relatedPosts:chuyen-nganh-dieu-duong-he-trung-cap"].map((post) => post.slug),
    ["hoc-spa"]
  );

  assert.equal(initialDataForPath("/tin-tuc/hoc-spa", CONTENT)["post:hoc-spa"].content, POST.content);
  assert.deepEqual(initialDataForPath("/lien-he", CONTENT), {});
  assert.deepEqual(initialDataForPath("/nganh-dao-tao/khong-co", CONTENT), {});
});

test("should render program page body with keyword heading, lead and CMS content", () => {
  const path = "/nganh-dao-tao/chuyen-nganh-dieu-duong-he-trung-cap";

  const html = renderAppHtml(path, initialDataForPath(path, CONTENT));

  assert.match(html, /<h1[^>]*>Trung cấp Điều dưỡng tại TPHCM<\/h1>/);
  assert.match(html, /Nội dung ngành điều dưỡng chi tiết\./);
  assert.match(html, /href="\/tin-tuc\/hoc-spa"/);
  assert.doesNotMatch(html, /animate-pulse/);
});

test("should render home page body with links to every program and latest news", () => {
  const html = renderAppHtml("/", initialDataForPath("/", CONTENT));

  assert.match(html, /href="\/nganh-dao-tao\/chuyen-nganh-dieu-duong-he-trung-cap"/);
  assert.match(html, /Trung cấp Điều dưỡng/);
  assert.match(html, /href="\/tin-tuc\/hoc-spa"/);
});

test("should render news article body with its headings", () => {
  const html = renderAppHtml("/tin-tuc/hoc-spa", initialDataForPath("/tin-tuc/hoc-spa", CONTENT));

  assert.match(html, /<h1[^>]*>Học spa chuyên nghiệp<\/h1>/);
  assert.match(html, /<h2 id="buoc-1">Bước 1<\/h2>/);
  assert.match(html, /11\/9\/2026/);
});

test("should lazy-load CMS images unless they already choose a loading mode", () => {
  assert.equal(
    lazyLoadImages('<p><img src="/a.png" alt="a"><img loading="eager" src="/b.png"></p>'),
    '<p><img loading="lazy" decoding="async" src="/a.png" alt="a"><img loading="eager" src="/b.png"></p>'
  );
  assert.equal(lazyLoadImages(undefined), "");
});

test("should lazy-load home page images below the hero so the hero loads first", () => {
  const html = renderAppHtml("/", initialDataForPath("/", {
    ...CONTENT,
    news: [{ ...POST, image: "https://cdn.example/spa.png" }],
  }));
  const images = html.match(/<img[^>]*>/g);
  const isAboveFold = (img) => /banner-nen|logo-sim|logo-512/.test(img);
  const belowFold = images.filter((img) => !isAboveFold(img));

  images.filter(isAboveFold).forEach((img) => assert.doesNotMatch(img, /loading="lazy"/, img));
  assert.ok(belowFold.length >= 1);
  belowFold.forEach((img) => assert.match(img, /loading="lazy"/, img));
});

test("should leave intro slider photos out of the prerendered home page", () => {
  const html = renderAppHtml("/", initialDataForPath("/", CONTENT));

  assert.doesNotMatch(html, /\/images\/intro\/intro-01\.webp/);
  assert.match(html, /intro-swiper/);
});

// Mục lục do admin Quill chèn (admin-edu/src/components/Quill/quillToc.ts → TocBlot.render)
const QUILL_TOC =
  '<div class="ql-toc-block" contenteditable="false" data-toc="[]">\n' +
  '      <div class="ql-toc-inner ql-toc-card">\n' +
  '        <div class="ql-toc-header-row">\n' +
  '          <span class="ql-toc-icon">☰</span>\n' +
  '          <span class="ql-toc-title">Mục lục bài viết</span>\n' +
  "        </div>\n" +
  '        <ul class="ql-toc-list">\n' +
  '        <li class="ql-toc-item ql-toc-h2"><span class="ql-toc-index">1.</span>' +
  '<a class="ql-toc-link" href="#hoc-phi">Học phí</a></li>\n' +
  "        </ul>\n" +
  "      </div>\n" +
  "    </div>";

test("should remove the whole nested Quill table of contents and keep the article", () => {
  const { html, headings } = prepareArticleContent(
    `<p>Mở đầu</p>${QUILL_TOC}<h2>Học phí</h2><div class="note"><div>Ghi chú</div></div>`
  );

  assert.doesNotMatch(html, /ql-toc|Mục lục bài viết/);
  assert.match(html, /^<p>Mở đầu<\/p><h2 id="hoc-phi">Học phí<\/h2><div class="note"><div>Ghi chú<\/div><\/div>$/);
  assert.equal(headings.length, 1);
});

test("should render the opening date badge from the time the page was generated", () => {
  const path = "/nganh-dao-tao/chuyen-nganh-dieu-duong-he-trung-cap";
  const program = { ...PROGRAM, description: "KHAI GIẢNG NGÀY 28.09.2026" };
  const content = { ...CONTENT, programs: [program] };

  const before = initialDataForPath(path, content, new Date("2026-09-20T03:00:00.000Z"));
  const after = initialDataForPath(path, content, new Date("2026-09-29T03:00:00.000Z"));

  assert.match(renderAppHtml(path, before), /Khai giảng: (<!-- -->)?28\.09\.2026/);
  assert.doesNotMatch(renderAppHtml(path, after), /Khai giảng: (<!-- -->)?28\.09\.2026/);
  assert.equal(before.renderedAt, "2026-09-20T03:00:00.000Z");
});

test("should render the FAQ section of news articles as the same accordion as program pages", () => {
  const { html, headings } = prepareArticleContent(
    '<h2 id="buoc-1">Bước 1</h2><p>Nội dung.</p>' +
      '<h2 id="cau-hoi-thuong-gap">Câu hỏi thường gặp</h2>' +
      '<h3 id="hoc-duoc-khong">Người mới có học được không?</h3><p>Được.</p>' +
      "<h3>Học bao lâu?</h3><p>Theo từng đợt.</p>"
  );

  assert.equal((html.match(/<details class="faq-item/g) || []).length, 2);
  assert.match(html, /<summary[^>]*>[\s\S]*Người mới có học được không\?[\s\S]*<\/summary>/);
  assert.match(html, /Theo từng đợt\./);
  assert.ok(headings.some((heading) => heading.text === "Câu hỏi thường gặp"));
});

test("should link every news post from a neighbour so none is orphaned", async () => {
  const { nearbyPosts } = await import("../../../src/ssr/initialDataForPath");
  const news = Array.from({ length: 14 }, (_, i) => ({ id: i, slug: `bai-${i}`, title: `Bài ${i}`, content: "<p>x</p>" }));
  // bài mới nhất: 3 bài cũ hơn; bài giữa: 3 cũ hơn + 2 mới hơn; không lặp chính nó, không kèm nội dung
  assert.deepEqual(nearbyPosts(news, "bai-0").map((p) => p.slug), ["bai-1", "bai-2", "bai-3"]);
  assert.deepEqual(nearbyPosts(news, "bai-6").map((p) => p.slug), ["bai-7", "bai-8", "bai-9", "bai-4", "bai-5"]);
  assert.equal(nearbyPosts(news, "bai-6")[0].content, undefined);
  const linked = new Set(news.flatMap((post) => nearbyPosts(news, post.slug).map((p) => p.slug)));
  news.forEach((post) => assert.ok(linked.has(post.slug), `${post.slug} không có link tới`));

  const content = { programs: [], news, isComplete: true };
  const html = renderAppHtml("/tin-tuc/bai-6", initialDataForPath("/tin-tuc/bai-6", content));
  assert.match(html, /Bài viết khác/);
  assert.match(html, /href="\/tin-tuc\/bai-9"/);
});
