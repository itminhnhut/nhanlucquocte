import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { legacyTarget } from "../../../src/components/LegacyRedirect";
import { LEGACY_NEWS_PATHS, LEGACY_REMOVED_PATHS } from "../../../src/configs/legacyPaths";

// Danh sách URL trong sitemap.xml của website đang chạy trungcapnhanlucquocte.vn, tải ngày
// 09/10/2026. Mọi URL ở đây Google đã index → khi đổi sang web mới phải 301 tới trang CÓ THẬT.
// Cập nhật fixture khi trường đăng bài mới: tải lại https://trungcapnhanlucquocte.vn/sitemap.xml
const LEGACY_URLS = fs
  .readFileSync(path.join(process.cwd(), "scripts/seo/__tests__/fixtures/legacy-urls.txt"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const programSlugs = new Set(
  JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/mock/programs.json"), "utf8")).map(
    (item) => item.slug
  )
);
const newsSlugs = new Set(
  JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/mock/posts.json"), "utf8")).map(
    (item) => item.slug
  )
);
const STATIC_TARGETS = new Set([
  "/",
  "/gioi-thieu",
  "/nganh-dao-tao",
  "/du-hoc",
  "/tra-cuu-van-bang",
  "/tin-tuc",
  "/lien-he",
  "/hinh-anh",
  "/chinh-sach-bao-mat",
  "/tuyen-sinh",
]);

/** Quy tắc chung của nginx cho bài cũ chưa liệt kê: /<slug>.html → /tin-tuc/<slug> */
const resolve = (url) => {
  const target = legacyTarget(`/${url}`);
  return target === `/${url}` ? `/tin-tuc/${url.replace(/\.html$/, "")}` : target;
};

test("should send every indexed old URL to a page that exists", () => {
  const broken = [];
  LEGACY_URLS.forEach((url) => {
    const target = resolve(url);
    const program = target.match(/^\/nganh-dao-tao\/(.+)$/);
    const news = target.match(/^\/tin-tuc\/(.+)$/);
    const ok = STATIC_TARGETS.has(target)
      ? true
      : program
        ? programSlugs.has(program[1])
        : news
          ? newsSlugs.has(news[1])
          : false;
    if (!ok) broken.push(`${url} → ${target}`);
  });
  assert.deepEqual(broken, [], "URL cũ trỏ vào trang không tồn tại");
});

test("should keep the renamed news articles mapped by hand", () => {
  // 7 bài này site trường để dấu gạch ở đầu/cuối slug nên quy tắc chung sẽ trỏ sai
  assert.equal(Object.keys(LEGACY_NEWS_PATHS).length, 7);
  Object.entries(LEGACY_NEWS_PATHS).forEach(([old, slug]) => {
    assert.match(old, /\.html$/);
    assert.ok(newsSlugs.has(slug), `${old} trỏ tới bài không có: ${slug}`);
    assert.equal(legacyTarget(`/${old}`), `/tin-tuc/${slug}`);
  });
});

test("should send leftover template pages to the home page, not to a missing news page", () => {
  // Trang sản phẩm hồ tiêu, quế và giỏ hàng của mẫu website cũ — vẫn đang ở trong sitemap của trường
  assert.ok(LEGACY_REMOVED_PATHS.length >= 12);
  LEGACY_REMOVED_PATHS.forEach((url) => assert.equal(legacyTarget(`/${url}`), "/"));
});

test("should redirect old URLs in nginx exactly as the app does", () => {
  const conf = fs.readFileSync(path.join(process.cwd(), "docker/nginx.conf"), "utf8");
  // Bài đổi slug: phải có dòng rewrite riêng, nếu không quy tắc chung đẩy vào 404
  Object.entries(LEGACY_NEWS_PATHS).forEach(([old, slug]) => {
    const base = old.replace(/\.html$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(conf, new RegExp(`rewrite \\^/${base}\\\\\\.html\\$ /tin-tuc/${slug} permanent;`), old);
  });
  // Trang rác: phải được xử lý TRƯỚC quy tắc chung /<slug>.html → /tin-tuc/<slug>
  const catchAll = conf.indexOf("rewrite ^/([a-z0-9-]+)\\.html$ /tin-tuc/$1 permanent;");
  assert.ok(catchAll > 0, "vẫn còn quy tắc chung cho bài cũ");
  LEGACY_REMOVED_PATHS.forEach((url) => {
    const slug = url.replace(/\.html$/, "");
    const at = conf.indexOf(slug);
    assert.ok(at > 0, `nginx chưa xử lý ${url}`);
    assert.ok(at < catchAll, `${url} phải đứng trước quy tắc chung`);
  });
  // Dùng rewrite, không dùng location: nginx chạy rewrite mức server trước khi chọn location
  assert.doesNotMatch(conf, /location = \/(gio-hang|san-pham|star-anise-684)\.html/);
});
