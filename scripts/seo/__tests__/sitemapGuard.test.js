import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { generateSitemapFile } from "../generate";

const SITEMAP_CU = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://trungcapnhanlucquocte.vn/tin-tuc/bai-cu</loc></url>
</urlset>`;

/** Ghi sẵn một sitemap "đang chạy" rồi gọi bộ tạo với env xấu, xem nó có phá không */
const chayVoiEnv = async (env) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-guard-"));
  const file = path.join(dir, "sitemap.xml");
  fs.writeFileSync(file, SITEMAP_CU, "utf8");
  const result = await generateSitemapFile(file, env);
  const sau = fs.readFileSync(file, "utf8");
  fs.rmSync(dir, { recursive: true, force: true });
  return { result, sau };
};

test("should keep the running sitemap when VITE_API_URL is missing", async () => {
  const { result, sau } = await chayVoiEnv({});
  assert.equal(result.isComplete, false);
  assert.equal(sau, SITEMAP_CU, "đã ghi đè sitemap bằng danh sách rỗng");
});

test("should keep the running sitemap when the url is still a docker placeholder", async () => {
  // Dockerfile build với VITE_API_URL=__VITE_API_URL__; ghi đè ở bước này là image mang theo
  // sitemap thiếu toàn bộ URL bài viết và trang ngành đi deploy.
  for (const url of ["__VITE_API_URL__", "https://__VITE_API_URL__/api"]) {
    const { result, sau } = await chayVoiEnv({ VITE_API_URL: url });
    assert.equal(result.isComplete, false, url);
    assert.equal(sau, SITEMAP_CU, `${url}: đã ghi đè sitemap`);
  }
});

test("should not leave a stale bundled test running after its source is deleted", () => {
  // dist-server/tests/*.test.cjs được node --test chạy theo pattern; file cũ còn sót thì vẫn chạy
  // dù nguồn đã xoá, làm số test báo cao hơn thực tế.
  const source = fs.readFileSync(path.join(process.cwd(), "scripts/build-server.mjs"), "utf8");
  assert.match(source, /rmSync\(path\.join\(OUT_DIR, "tests"\)/);
});
