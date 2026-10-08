import test from "node:test";
import assert from "node:assert/strict";
import { programExtras } from "../../../src/content/programExtras";
import { PROGRAM_NAMES } from "../../../src/content/programFields";
import { GUIDES, otherGuides } from "../../../src/content/guides";
import { renderAppHtml } from "../../../src/ssr/renderPage";
import { initialDataForPath } from "../../../src/ssr/initialDataForPath";

test("should build fit info for every program in the catalog", () => {
  Object.keys(PROGRAM_NAMES).forEach((slug) => {
    const extras = programExtras(slug);
    assert.ok(extras, slug);
    assert.ok(extras.entry, slug);
    extras.sameField.forEach((item) => assert.notEqual(item.path, `/nganh-dao-tao/${slug}`));
  });
  assert.equal(programExtras("chuyen-nganh-dieu-duong-he-trung-cap")?.name, "Điều dưỡng");
  assert.equal(programExtras("nganh-moi-chua-xep-nhom"), null);
});

test("should only state entry levels the school has confirmed", () => {
  assert.match(programExtras("tuyen-sinh-cong-nghe-ky-thuat-o-to-khai-giang-ngay-03-03-2026").entry, /THCS, THPT/);
  assert.match(programExtras("ke-toan-doanh-nghiep").entry, /THCS, THPT/);
  assert.equal(programExtras("ke-toan-doanh-nghiep").schedule, undefined);
  assert.match(programExtras("nghiep-vu-nghe-nong-nghiep-he-so-cap").credential, /chứng chỉ/);
  assert.match(programExtras("ke-toan-doanh-nghiep").credential, /bằng tốt nghiệp trung cấp/);
  // Ngành trường chưa công bố rõ hệ đào tạo → không nêu văn bằng
  assert.equal(programExtras("cham-soc-nguoi-cao-tuoi").credential, null);
  assert.equal(programExtras("nghiep-vu-bao-mau").credential, null);
});

test("should link related programs in the same field", () => {
  const extras = programExtras("khai-giang-ky-thuat-lam-banh-khoa-106-he-trung-cap");
  assert.deepEqual(extras.sameField.map((item) => item.name), [
    "Kỹ thuật chế biến món ăn",
    "Quản trị khách sạn",
    "Nghiệp vụ lễ tân",
    "Nghiệp vụ pha chế",
  ]);
});

test("should prerender the fit block on a program page", () => {
  const program = { id: 1, slug: "khai-giang-ky-thuat-lam-banh-khoa-106-he-trung-cap", title: "Làm bánh", content: "<p>Nội dung</p>", active: true };
  const path = `/nganh-dao-tao/${program.slug}`;
  const html = renderAppHtml(path, initialDataForPath(path, { programs: [program], news: [] })).replace(/<!-- -->/g, "");
  assert.match(html, /Ngành Kỹ thuật làm bánh có phù hợp với bạn\?/);
  // PROGRAM_PAGES_READY=false → link ngành cùng lĩnh vực trỏ về trang danh sách, không tạo link gãy
  assert.match(html, /href="\/nganh-dao-tao"/);
});

test("should suggest guides linked from the article first", () => {
  const related = otherGuides("nen-hoc-nghe-gi");
  assert.equal(related[0].slug, "tot-nghiep-lop-9-nen-hoc-gi");
  assert.ok(related.every((guide) => guide.slug !== "nen-hoc-nghe-gi"));
  assert.equal(otherGuides(GUIDES[0].slug, 50).length, GUIDES.length - 1);
});
