import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { isValidIndexNowKey, notifyIndexNow } from "../indexNow";
import { writePages } from "../pages";
import appConfig from "../../../src/configs/appConfig";

const KEY = "vietuc-indexnow-key-2026";
const TEMPLATE =
  '<!DOCTYPE html>\n<html lang="vi">\n  <head>\n    <meta charset="UTF-8" />\n  </head>\n' +
  '  <body><div id="root"></div></body>\n</html>';
const CONTENT = {
  programs: [{ slug: "chuyen-nganh-dieu-duong-he-trung-cap", title: "TUYỂN SINH NGÀNH ĐIỀU DƯỠNG", content: "<p>A</p>" }],
  news: [{ slug: "hoc-spa", title: "Học spa", content: "<p>B</p>" }],
  isComplete: true,
};

function createWebRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-indexnow-"));
  fs.writeFileSync(path.join(rootDir, "index.html"), TEMPLATE);
  return rootDir;
}

function fakeFetch(status = 200) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return { ok: status < 300, status };
  };
  return { calls, fetchImpl };
}

test("should accept only IndexNow-format keys", () => {
  assert.equal(isValidIndexNowKey(KEY), true);
  assert.equal(isValidIndexNowKey("short"), false);
  assert.equal(isValidIndexNowKey("có dấu cách và ký tự lạ!"), false);
  assert.equal(isValidIndexNowKey(undefined), false);
});

test("should report only indexable pages whose HTML changed since the last generation", () => {
  const rootDir = createWebRoot();

  const first = writePages(rootDir, CONTENT);
  const unchanged = writePages(rootDir, CONTENT);
  const edited = writePages(rootDir, {
    ...CONTENT,
    news: [{ ...CONTENT.news[0], content: "<p>B đã sửa</p>" }],
  });

  assert.ok(first.changedPaths.includes("/nganh-dao-tao/chuyen-nganh-dieu-duong-he-trung-cap"));
  assert.ok(first.changedPaths.includes("/"));
  assert.ok(!first.changedPaths.includes("/tim-kiem"), "trang noindex không gửi IndexNow");
  assert.deepEqual(unchanged.changedPaths, []);
  assert.deepEqual(edited.changedPaths, ["/tin-tuc/hoc-spa"]);
});

test("should ship a verification file matching the configured IndexNow key", () => {
  const key = appConfig.indexNowKey;

  assert.equal(isValidIndexNowKey(key), true);
  assert.equal(fs.readFileSync(path.join(process.cwd(), "public", `${key}.txt`), "utf8"), key);
});

test("should submit changed URLs to IndexNow with the configured key", async () => {
  const { calls, fetchImpl } = fakeFetch();

  const result = await notifyIndexNow(["/", "/tin-tuc/hoc-spa"], KEY, fetchImpl);

  assert.equal(result.submitted, 2);
  assert.equal(calls[0].url, "https://api.indexnow.org/indexnow");
  assert.deepEqual(calls[0].body, {
    host: "trungcapnhanlucquocte.vn",
    key: KEY,
    keyLocation: `https://trungcapnhanlucquocte.vn/${KEY}.txt`,
    urlList: ["https://trungcapnhanlucquocte.vn/", "https://trungcapnhanlucquocte.vn/tin-tuc/hoc-spa"],
  });
});

test("should skip IndexNow with an invalid key or no changes, and never throw on API errors", async () => {
  const { calls, fetchImpl } = fakeFetch(429);

  assert.equal((await notifyIndexNow(["/"], "bad key", fetchImpl)).submitted, 0);
  assert.equal((await notifyIndexNow([], KEY, fetchImpl)).submitted, 0);
  assert.equal(calls.length, 0);

  assert.equal((await notifyIndexNow(["/"], KEY, fetchImpl)).submitted, 0);
  const offline = await notifyIndexNow(["/"], KEY, async () => {
    throw new Error("network down");
  });
  assert.equal(offline.submitted, 0);
});
