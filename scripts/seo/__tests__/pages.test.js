import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { writePages } from "../pages";

const TEMPLATE =
  '<!DOCTYPE html>\n<html lang="vi">\n  <head>\n    <meta charset="UTF-8" />\n  </head>\n' +
  '  <body><div id="root"></div></body>\n</html>';

function createWebRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-pages-"));
  fs.writeFileSync(path.join(rootDir, "index.html"), TEMPLATE);
  return rootDir;
}

const read = (rootDir, ...parts) => fs.readFileSync(path.join(rootDir, ...parts), "utf8");

test("should write one HTML file per static page, detail page and 404", () => {
  const rootDir = createWebRoot();

  writePages(rootDir, {
    programs: [{ slug: "ke-toan", title: "TUYỂN SINH NGÀNH KẾ TOÁN" }],
    news: [{ slug: "khai-giang", title: "Khai giảng" }],
    isComplete: true,
  });

  assert.match(read(rootDir, "index.html"), /canonical" href="https:\/\/trungcapnhanlucquocte\.vn\/"/);
  assert.match(read(rootDir, "lien-he", "index.html"), /canonical" href="https:\/\/trungcapnhanlucquocte\.vn\/lien-he"/);
  assert.match(read(rootDir, "nganh-dao-tao", "ke-toan", "index.html"), /<title>Trung cấp Kế toán TPHCM \| Trung cấp nghề Nhân Lực Quốc Tế<\/title>/);
  assert.match(read(rootDir, "tin-tuc", "khai-giang", "index.html"), /<title>Khai giảng \| Trường Trung cấp nghề Nhân Lực Quốc Tế<\/title>/);
  assert.match(read(rootDir, "404.html"), /noindex,follow/);
});

test("should not duplicate SEO block in home page when regenerated", () => {
  const rootDir = createWebRoot();
  const content = { programs: [], news: [], isComplete: true };

  writePages(rootDir, content);
  writePages(rootDir, content);

  const home = read(rootDir, "index.html");
  assert.equal((home.match(/<!--seo:start-->/g) || []).length, 1);
  assert.match(read(rootDir, "gioi-thieu", "index.html"), /\/gioi-thieu"/);
  assert.doesNotMatch(read(rootDir, "gioi-thieu", "index.html"), /rel="canonical" href="https:\/\/trungcapnhanlucquocte\.vn\/"/);
});

test("should remove detail pages that no longer exist in API", () => {
  const rootDir = createWebRoot();
  writePages(rootDir, { programs: [{ slug: "cu" }, { slug: "moi" }], news: [], isComplete: true });

  writePages(rootDir, { programs: [{ slug: "moi" }], news: [], isComplete: true });

  assert.equal(fs.existsSync(path.join(rootDir, "nganh-dao-tao", "cu")), false);
  assert.equal(fs.existsSync(path.join(rootDir, "nganh-dao-tao", "moi", "index.html")), true);
  assert.equal(fs.existsSync(path.join(rootDir, "nganh-dao-tao", "index.html")), true);
});

test("should write a neutral SPA fallback page without homepage canonical", () => {
  const rootDir = createWebRoot();

  writePages(rootDir, { programs: [], news: [], isComplete: true });

  const spa = read(rootDir, "spa.html");
  assert.doesNotMatch(spa, /rel="canonical"/);
  assert.doesNotMatch(spa, /<!--seo:start-->/);
  assert.match(spa, /<div id="root"><\/div>/);
});

test("should keep existing detail pages when API data is incomplete", () => {
  const rootDir = createWebRoot();
  writePages(rootDir, { programs: [{ slug: "ke-toan" }], news: [], isComplete: true });

  writePages(rootDir, { programs: [], news: [], isComplete: false });

  assert.equal(fs.existsSync(path.join(rootDir, "nganh-dao-tao", "ke-toan", "index.html")), true);
});

test("should preload the hero image only on the home page", () => {
  const rootDir = createWebRoot();

  writePages(rootDir, {
    programs: [{ slug: "ke-toan", title: "TUYỂN SINH NGÀNH KẾ TOÁN" }],
    news: [],
    isComplete: true,
  });

  const home = read(rootDir, "index.html");
  // 2 thẻ preload khớp 2 <source> của banner (điện thoại / máy tính) → mỗi máy chỉ tải 1 ảnh
  assert.equal((home.match(/rel="preload" as="image"/g) || []).length, 2);
  assert.match(home, /imagesrcset="[^"]*banner-nen_800\.webp 800w/);
  assert.match(home, /imagesrcset="[^"]*banner-nen-mobile_400\.webp 400w/);
  assert.match(home, /media="\(max-width: 639px\)"/);
  assert.match(home, /imagesizes="\(max-width: 1280px\) 100vw, 1280px"/);
  ["lien-he", "nganh-dao-tao"].forEach((dir) => {
    assert.doesNotMatch(read(rootDir, dir, "index.html"), /rel="preload"/, dir);
  });
  assert.doesNotMatch(read(rootDir, "nganh-dao-tao", "ke-toan", "index.html"), /rel="preload"/);
  assert.doesNotMatch(read(rootDir, "spa.html"), /rel="preload"/);
});

const SSR_CONTENT = {
  programs: [
    {
      slug: "ke-toan-doanh-nghiep",
      title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP",
      content: "<p>Học nghiệp vụ kế toán thực tế.</p>",
    },
  ],
  news: [{ slug: "khai-giang", title: "Khai giảng", content: "<p>Bài </script><script>alert(1)</script></p>" }],
  isComplete: true,
};
const rootOf = (html) => html.match(/<div id="root">([\s\S]*?)<\/div><script id="__INITIAL_DATA__"/)?.[1] ?? "";

test("should prerender page body and embed its data for hydration", () => {
  const rootDir = createWebRoot();

  writePages(rootDir, SSR_CONTENT);

  const program = read(rootDir, "nganh-dao-tao", "ke-toan-doanh-nghiep", "index.html");
  assert.match(program, /<h1[^>]*>Trung cấp Kế toán doanh nghiệp tại TPHCM<\/h1>/);
  assert.match(program, /Học nghiệp vụ kế toán thực tế\./);
  assert.match(program, /<script id="__INITIAL_DATA__" type="application\/json">\{/);
  assert.match(read(rootDir, "index.html"), /href="\/nganh-dao-tao\/ke-toan-doanh-nghiep"/);
  assert.match(read(rootDir, "gioi-thieu", "index.html"), /<h1[^>]*>Giới thiệu Trường Trung cấp nghề Nhân Lực Quốc Tế<\/h1>/);
  assert.match(read(rootDir, "spa.html"), /<div id="root"><\/div>/);
});

test("should not let CMS content close the embedded data script", () => {
  const rootDir = createWebRoot();

  writePages(rootDir, SSR_CONTENT);

  const news = read(rootDir, "tin-tuc", "khai-giang", "index.html");
  const dataScript = news.match(/<script id="__INITIAL_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1];
  assert.doesNotMatch(dataScript, /<\/?script/i);
  assert.equal(JSON.parse(dataScript)["post:khai-giang"].title, "Khai giảng");
});

test("should keep a single prerendered root when regenerating from the home page template", () => {
  const rootDir = createWebRoot();

  writePages(rootDir, SSR_CONTENT);
  writePages(rootDir, SSR_CONTENT);

  const home = read(rootDir, "index.html");
  assert.equal((home.match(/id="root"/g) || []).length, 1);
  assert.equal((home.match(/id="__INITIAL_DATA__"/g) || []).length, 1);
  assert.ok(rootOf(home).length > 0);
});

test("should keep prerendered pages with data when the API fails on refresh", () => {
  const rootDir = createWebRoot();
  writePages(rootDir, SSR_CONTENT);

  writePages(rootDir, { programs: [], news: [], isComplete: false });

  assert.match(read(rootDir, "index.html"), /href="\/nganh-dao-tao\/ke-toan-doanh-nghiep"/);
  assert.match(read(rootDir, "nganh-dao-tao", "index.html"), /Trung cấp Kế toán doanh nghiệp/);
});

test("should not prerender the search page body because its content depends on the query string", () => {
  const rootDir = createWebRoot();

  writePages(rootDir, SSR_CONTENT);

  const search = read(rootDir, "tim-kiem", "index.html");
  assert.match(search, /<div id="root"><\/div>/);
  assert.match(search, /noindex,follow/);
});
