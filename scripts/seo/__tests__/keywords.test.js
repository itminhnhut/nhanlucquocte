import test from "node:test";
import assert from "node:assert/strict";
import { GUIDES, guidePath } from "../../../src/content/guides";
import { PROGRAM_KEYWORDS, targetKeyword } from "../../../src/seo/keywords";
import { STATIC_PATHS, programPageMeta, staticPageMeta } from "../../../src/seo/pageMeta";
import { programHeading, programLead } from "../../../src/seo/programCopy";
import { PROGRAM_NAMES } from "../../../src/content/programFields";
import { buildSitemap } from "../sitemap";
import { checkPage, keywordMatch, parsePage, toAscii } from "../audit";

const found = (text, keyword) => keywordMatch(text, keyword) !== "missing";

test("should match Vietnamese keywords ignoring case and punctuation", () => {
  assert.equal(keywordMatch("Học nấu ăn hay làm bánh? So sánh", "học nấu ăn hay làm bánh"), "exact");
  assert.equal(keywordMatch("Trung cấp Công nghệ kỹ thuật ô tô", "trung cấp ô tô"), "partial");
  assert.equal(keywordMatch("Trung cấp Kế toán", "học làm bánh"), "missing");
  assert.equal(toAscii("Trường trung cấp Quận 3"), "truong trung cap quan 3");
});

test("should put every static page and guide keyword in its title and description", () => {
  STATIC_PATHS.forEach((path) => {
    const keyword = targetKeyword(path);
    const meta = staticPageMeta(path);
    if (!keyword || !meta?.isIndexable) return;
    assert.ok(found(meta.title, keyword), `${path} title: ${meta.title}`);
    assert.ok(found(meta.description, keyword), `${path} description: ${meta.description}`);
  });
});

test("should open each guide with its exact keyword in title, H1, description and lead", () => {
  GUIDES.forEach((guide) => {
    ["metaTitle", "title", "description", "lead"].forEach((field) => {
      assert.equal(keywordMatch(guide[field], guide.keyword), "exact", `${guide.slug} ${field}`);
    });
  });
});

test("should give each page its own keyword (no two pages target the same phrase)", () => {
  const keywords = [
    // STATIC_PATHS đã gồm các bài cẩm nang
    ...STATIC_PATHS.map(targetKeyword),
    ...Object.values(PROGRAM_KEYWORDS),
  ].filter(Boolean);
  assert.equal(new Set(keywords).size, keywords.length);
});

test("should keep program keywords in title, H1 and lead", () => {
  Object.entries(PROGRAM_NAMES).forEach(([slug, name]) => {
    const program = { slug, title: `TUYỂN SINH NGÀNH ${name.toLocaleUpperCase("vi")}` };
    const keyword = PROGRAM_KEYWORDS[slug];
    const { title } = programPageMeta(program, slug);
    assert.ok(found(title, keyword), `${slug} title: ${title}`);
    const heading = programHeading(program.title, slug);
    assert.ok(found(`${heading} ${programLead(slug, program)}`, keyword), `${slug} H1/lead`);
  });
});

test("should list guides with lastmod and a monthly changefreq in the sitemap", () => {
  const xml = buildSitemap({});
  const guide = GUIDES[0];
  assert.match(xml, new RegExp(`${guidePath(guide.slug)}</loc>\\n    <lastmod>${guide.dateModified}</lastmod>`));
  assert.doesNotMatch(xml, /trungcapnhanlucquocte\.vn\/<\/loc>\n    <lastmod>/);
});

test("should treat empty alt as decorative but flag a missing alt attribute", () => {
  const html = `<html lang="vi"><body><div id="root"><h1>x</h1><img src="/a.jpg" alt=""><img src="/b.jpg"></div></body></html>`;
  const page = parsePage(html, "http://localhost/news");
  const { issues } = checkPage(page, { path: "/tin-tuc", status: 200, sitemapPaths: new Set(["/tin-tuc"]) });
  assert.ok(issues.some((item) => item.message === "1 ảnh thiếu thuộc tính alt"));
});

test("should flag missing H1, thin content and missing keyword in the audit", () => {
  const html = `<html lang="vi"><head><title>Trang</title><link rel="canonical" href="https://trungcapnhanlucquocte.vn/cam-nang"></head><body><div id="root"><h2>Không có H1</h2><p>ít chữ</p></div></body></html>`;
  const page = parsePage(html, "http://localhost/cam-nang");
  const { issues } = checkPage(page, { path: "/cam-nang", status: 200, sitemapPaths: new Set() });
  const checks = issues.map((item) => `${item.level}:${item.check}`);
  ["error:H1", "warn:Nội dung", "error:Từ khoá", "error:Description", "warn:Sitemap"].forEach((expected) =>
    assert.ok(checks.includes(expected), `${expected} in ${checks.join(", ")}`)
  );
});
