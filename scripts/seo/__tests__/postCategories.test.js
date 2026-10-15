import test from "node:test";
import assert from "node:assert/strict";
import { POST_CATEGORIES, categoryByValue, categoryBySlug, categoryPath, filterByCategory } from "../../../src/configs/postCategories";

// Bốn chuỗi này phải khớp Y HỆT giá trị lưu trong database của trường; lệch một dấu là bộ lọc
// im lặng trả về rỗng. Trang quản trị chỉ cho chọn đúng 4 giá trị này.
test("should match the four values the admin form allows", () => {
  assert.deepEqual(
    POST_CATEGORIES.map((c) => c.value).sort(),
    ["du học", "hoạt động", "tin tức", "tuyển sinh"]
  );
});

test("should find a category whatever unicode form the CMS stored", () => {
  const nfd = "tuyển sinh".normalize("NFD");
  assert.notEqual(nfd, "tuyển sinh", "chuỗi thử phải thật sự khác dạng");
  assert.equal(categoryByValue(nfd)?.slug, "tuyen-sinh");
});

test("should ignore a category the CMS typed by hand", () => {
  assert.equal(categoryByValue("Ngôn ngữ Hàn Quốc"), null);
  assert.equal(categoryByValue(""), null);
  assert.equal(categoryByValue(null), null);
  assert.equal(categoryByValue(42), null);
});

test("should fall back to the full list for an unknown slug", () => {
  assert.equal(categoryBySlug("linh-tinh"), null);
  assert.equal(categoryBySlug(""), null);
  assert.equal(categoryPath(), "/tin-tuc");
  assert.equal(categoryPath("du-hoc"), "/tin-tuc?danh-muc=du-hoc");
});

test("should show no wrong post on the first paint of a shared category link", () => {
  // HTML tạo sẵn của /tin-tuc luôn là 10 bài chưa lọc, dùng chung cho mọi ?danh-muc=
  const nhungSan = [
    { slug: "a", category: "tin tức" },
    { slug: "b", category: "du học" },
    { slug: "c", category: "hoạt động" },
  ];
  const ra = filterByCategory(nhungSan, categoryBySlug("du-hoc"));
  assert.deepEqual(ra.map((p) => p.slug), ["b"]);
  assert.equal(filterByCategory(nhungSan, null).length, 3, "không lọc thì giữ nguyên");
  assert.deepEqual(filterByCategory([], categoryBySlug("du-hoc")), []);
});
