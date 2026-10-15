import test from "node:test";
import assert from "node:assert/strict";
import { programExtras } from "../../../src/content/programExtras";
import { PROGRAM_FIELDS, PROGRAM_NAMES } from "../../../src/content/programFields";
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
  assert.equal(programExtras("dieu-duong-he-trung-cap")?.name, "Điều dưỡng");
  assert.equal(programExtras("nganh-moi-chua-xep-nhom"), null);
});

test("should only state entry levels the school has confirmed", () => {
  assert.match(programExtras("trung-cap-ky-thuat-sua-chua-o-to").entry, /THCS, THPT/);
  assert.match(programExtras("ke-toan-doanh-nghiep").entry, /THCS, THPT/);
  assert.equal(programExtras("ke-toan-doanh-nghiep").schedule, undefined);
  assert.match(programExtras("nghiep-vu-nghe-nong-nghiep-he-so-cap").credential, /chứng chỉ/);
  assert.match(programExtras("ke-toan-doanh-nghiep").credential, /bằng tốt nghiệp trung cấp/);
  // Trường đã công bố rõ trên trang của mình (xem căn cứ ở đầu src/content/programFields.ts)
  assert.match(programExtras("cham-soc-nguoi-cao-tuoi").credential, /chứng chỉ/);
  assert.match(programExtras("nghiep-vu-pha-che").credential, /chứng chỉ/);
  assert.match(programExtras("thiet-ke-noi-that").credential, /bằng tốt nghiệp trung cấp/);
  // Ngành trường chưa công bố rõ hệ đào tạo → không nêu văn bằng
  assert.equal(programExtras("nghiep-vu-tro-ly-nha-khoa").credential, null);
  assert.equal(programExtras("cham-soc-da-chuyen-nghiep").credential, null);
});

test("should link related programs in the same field", () => {
  const extras = programExtras("ky-thuat-lam-banh");
  assert.deepEqual(extras.sameField.map((item) => item.name), [
    "Kỹ thuật chế biến món ăn",
    "Quản trị khách sạn",
    "Nghiệp vụ lễ tân",
    "Nghiệp vụ pha chế",
  ]);
});

test("should prerender the fit block on a program page", () => {
  const program = { id: 1, slug: "ky-thuat-lam-banh", title: "Làm bánh", content: "<p>Nội dung</p>", active: true };
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

test("should give every program the same number of inbound links from other programs", () => {
  // Soát site 15/10/2026: link nội bộ trỏ vào trang ngành lệch từ 3 tới 27. Khối "ngành khác"
  // xoay vòng để không ngành nào bị bỏ rơi.
  const demVao = new Map();
  const slugs = PROGRAM_FIELDS.flatMap((field) => field.programs.map((item) => item.slug));
  slugs.forEach((slug) => demVao.set(slug, 0));

  slugs.forEach((slug) => {
    const extras = programExtras(slug);
    assert.ok(extras, slug);
    extras.otherPrograms.forEach((item) => {
      const dich = item.path.replace("/nganh-dao-tao/", "");
      assert.notEqual(dich, slug, `${slug} tự trỏ vào chính nó`);
      demVao.set(dich, (demVao.get(dich) ?? 0) + 1);
    });
  });

  const so = [...demVao.values()];
  assert.ok(Math.min(...so) > 0, "ngành nào cũng phải được trỏ tới ít nhất một lần");
  assert.ok(Math.max(...so) - Math.min(...so) <= 3, `lệch quá nhiều: ${Math.min(...so)}–${Math.max(...so)}`);
  assert.ok(Math.min(...so) >= 4, `có ngành gần như không ai trỏ tới: ${Math.min(...so)}`);
});

test("should not repeat a program that is already listed under the same field", () => {
  PROGRAM_FIELDS.forEach((field) =>
    field.programs.forEach((item) => {
      const extras = programExtras(item.slug);
      const trungLap = extras.otherPrograms.filter((other) =>
        extras.sameField.some((same) => same.path === other.path)
      );
      assert.deepEqual(trungLap, [], `${item.slug} lặp link`);
    })
  );
});
