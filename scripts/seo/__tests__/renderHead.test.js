import test from "node:test";
import assert from "node:assert/strict";
import { injectHead, renderHeadTags } from "../../../src/seo/renderHead";
import { newsPageMeta, notFoundPageMeta, programPageMeta, staticPageMeta } from "../../../src/seo/pageMeta";
import { canonicalUrl } from "../../../src/seo/url";

const TEMPLATE = '<html><head>\n<meta charset="UTF-8" />\n</head><body><div id="root"></div></body></html>';

test("should keep a single SEO block when injected repeatedly", () => {
  const home = staticPageMeta("/");
  const about = staticPageMeta("/gioi-thieu");

  const html = injectHead(injectHead(TEMPLATE, home), about);

  assert.equal((html.match(/<!--seo:start-->/g) || []).length, 1);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/trungcapnhanlucquocte\.vn\/gioi-thieu"/);
  assert.match(html, /<div id="root"><\/div>/);
});

test("should escape HTML in titles and JSON-LD from CMS data", () => {
  const meta = programPageMeta({ title: 'Ngành <script>alert("x")</script>' }, "nganh-x");

  const tags = renderHeadTags(meta);

  assert.doesNotMatch(tags, /<script>alert/);
  assert.match(tags, /&lt;script&gt;alert/);
  assert.match(tags, /\\u003cscript>alert/);
});

test("should use absolute canonical and og:image for detail pages", () => {
  const meta = newsPageMeta({ title: "Khai giảng", image: "/uploads/a.jpg", createdAt: "2026-09-01" }, "khai-giang");

  const tags = renderHeadTags(meta);

  assert.match(tags, /<link rel="canonical" href="https:\/\/trungcapnhanlucquocte\.vn\/tin-tuc\/khai-giang"/);
  assert.match(tags, /property="og:image" content="https:\/\/trungcapnhanlucquocte\.vn\/uploads\/a\.jpg"/);
  assert.match(tags, /property="og:type" content="article"/);
  assert.match(tags, /"@type":"Article"/);
});

test("should use default JPG share image with dimensions when page has no image", () => {
  const tags = renderHeadTags(programPageMeta({ title: "Kế toán" }, "ke-toan"));

  assert.match(tags, /property="og:image" content="https:\/\/trungcapnhanlucquocte\.vn\/images\/og-default\.jpg"/);
  assert.match(tags, /property="og:image:width" content="1200"/);
  assert.match(tags, /property="og:image:height" content="630"/);
  assert.match(tags, /property="og:image:alt" content="Trung cấp Kế toán TPHCM \| Trung cấp nghề Nhân Lực Quốc Tế"/);
});

test("should add article times for news and never output meta keywords", () => {
  const tags = renderHeadTags(
    newsPageMeta({ title: "Khai giảng", createdAt: "2026-09-01T00:00:00Z" }, "khai-giang")
  );

  assert.match(tags, /property="article:published_time" content="2026-09-01T00:00:00.000Z"/);
  assert.doesNotMatch(tags, /name="keywords"/);
  assert.doesNotMatch(renderHeadTags(staticPageMeta("/")), /name="keywords"/);
});

test("should mark search and 404 pages noindex without canonical", () => {
  [staticPageMeta("/tim-kiem"), notFoundPageMeta()].forEach((meta) => {
    const tags = renderHeadTags(meta);

    assert.match(tags, /name="robots" content="noindex,follow"/);
    assert.doesNotMatch(tags, /rel="canonical"/);
  });
});

test("should strip query, hash and trailing slash from canonical url", () => {
  assert.equal(canonicalUrl("/nganh-dao-tao/?utm_source=fb#register"), "https://trungcapnhanlucquocte.vn/nganh-dao-tao");
  assert.equal(canonicalUrl("/"), "https://trungcapnhanlucquocte.vn/");
});
