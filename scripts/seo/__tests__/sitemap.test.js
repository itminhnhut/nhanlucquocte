import test from "node:test";
import assert from "node:assert/strict";
import { buildSitemap } from "../sitemap";
import { toPublishableItems } from "../content";
import { GUIDES } from "../../../src/content/guides";

const countUrls = (xml) => (xml.match(/<url>/g) || []).length;

test("should include program and news detail pages with canonical domain", () => {
  const xml = buildSitemap({
    programs: [{ slug: "tuyen-sinh-nganh-ke-toan" }],
    news: [{ slug: "khai-giang-2026" }],
  });

  assert.match(xml, /<loc>https:\/\/trungcapnhanlucquocte\.vn\/nganh-dao-tao\/tuyen-sinh-nganh-ke-toan<\/loc>/);
  assert.match(xml, /<loc>https:\/\/trungcapnhanlucquocte\.vn\/tin-tuc\/khai-giang-2026<\/loc>/);
});

test("should list only real indexable static routes", () => {
  const xml = buildSitemap({});

  assert.match(xml, /<loc>https:\/\/trungcapnhanlucquocte\.vn\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/trungcapnhanlucquocte\.vn\/lien-he<\/loc>/);
  assert.match(xml, /<loc>https:\/\/trungcapnhanlucquocte\.vn\/cau-hoi-thuong-gap<\/loc>/);
  assert.doesNotMatch(xml, /\/register<|\/study<|\/tim-kiem</);
  // 16 trang tĩnh (gồm /du-hoc, /hoc-phi, /hop-tac-doanh-nghiep, /hoat-dong-hoc-vien, /hinh-anh) + cẩm nang
  assert.equal(countUrls(xml), 16 + GUIDES.length);
  assert.match(xml, /<loc>https:\/\/trungcapnhanlucquocte\.vn\/cam-nang\/nen-hoc-nghe-gi<\/loc>/);
});

test("should drop duplicate slugs in sitemap", () => {
  const xml = buildSitemap({ programs: [{ slug: "a" }, { slug: "a" }, { id: 17 }] });

  assert.equal((xml.match(/\/nganh-dao-tao\/a</g) || []).length, 1);
  assert.match(xml, /\/nganh-dao-tao\/17</);
});

test("should skip inactive items and unsafe slugs from API data", () => {
  const items = toPublishableItems([
    { slug: "ok" },
    { slug: "an", active: false },
    { slug: "../etc" },
    { slug: "a/b" },
    { title: "không slug" },
    { slug: "ok" },
  ]);

  assert.deepEqual(items.map((item) => item.slug), ["ok"]);
});
