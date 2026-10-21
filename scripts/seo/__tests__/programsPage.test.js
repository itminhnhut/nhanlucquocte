import test from "node:test";
import assert from "node:assert/strict";
import { ALL_PROGRAMS, PROGRAM_FIELDS, PROGRAM_NAMES, groupProgramsByField } from "../../../src/content/programFields";
import { renderAppHtml } from "../../../src/ssr/renderPage";
import { initialDataForPath } from "../../../src/ssr/initialDataForPath";
import { initialDataKeys } from "../../../src/data/initialData";
import { FEATURED_PROGRAM_SLUGS } from "../../../src/configs/featuredPrograms";

// Slug ngành theo danh mục trong src/content/programFields.ts (bài ngành sẽ import vào database)
const REAL_SLUGS = ALL_PROGRAMS.map((program) => program.slug);
const toPrograms = (slugs) =>
  slugs.map((slug) => ({ slug, title: `TUYỂN SINH NGÀNH ${(PROGRAM_NAMES[slug] ?? slug).toLocaleUpperCase("vi")}` }));

test("should place every current program in exactly one field", () => {
  const groups = groupProgramsByField(toPrograms(REAL_SLUGS));

  const placed = groups.flatMap((group) => group.programs.map((program) => program.slug));
  assert.deepEqual([...placed].sort(), [...REAL_SLUGS].sort());
  assert.ok(groups.every((group) => group.field.id !== "khac"), "không ngành nào rơi vào nhóm Khác");
  assert.equal(new Set(PROGRAM_FIELDS.map((field) => field.id)).size, PROGRAM_FIELDS.length);
});

test("should keep new programs visible under an other-programs field and skip empty fields", () => {
  const groups = groupProgramsByField(toPrograms(["ke-toan-doanh-nghiep", "nganh-logistics"]));

  assert.deepEqual(groups.map((group) => group.field.id), ["kinh-te", "khac"]);
  // Slug lạ từ database vẫn vào đúng lĩnh vực nếu tiêu đề chứa tên nghề
  const byTitle = groupProgramsByField([{ slug: "bai-moi-123", title: "TUYỂN SINH NGÀNH CHĂM SÓC SẮC ĐẸP" }]);
  assert.equal(byTitle[0].field.id, "lam-dep");
});

test("should prerender the programs page with field headings, intro, FAQ and contact card", () => {
  const programs = toPrograms(REAL_SLUGS);

  const html = renderAppHtml("/nganh-dao-tao", initialDataForPath("/nganh-dao-tao", { programs, news: [], isComplete: true }));
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  PROGRAM_FIELDS.forEach((field) => assert.match(html, new RegExp(`<h2[^>]*id="${field.anchor}"[^>]*>`), field.id));
  assert.match(text, /Số 6 Phan Đình Giót, phường Tân Sơn Hòa \(Quận Tân Bình cũ\)/);
  assert.match(text, /Chọn ngành theo sở thích/);
  assert.match(text, /Tốt nghiệp THCS có học trung cấp được không\?/);
  assert.match(text, /Liên hệ tư vấn tuyển sinh/);
  assert.equal((html.match(/href="\/nganh-dao-tao\//g) || []).length >= REAL_SLUGS.length, true);
  assert.doesNotMatch(html, /"@type":"FAQPage"/);
});

test("should show confirmed quick facts and field comparison guides on program cards", () => {
  const programs = [
    { id: 1, slug: "trung-cap-ky-thuat-sua-chua-o-to", title: "TUYỂN SINH NGÀNH KỸ THUẬT SỬA CHỮA Ô TÔ", description: "KHAI GIẢNG NGÀY 07.10.2026", active: true },
    { id: 2, slug: "ky-thuat-lam-banh", title: "TUYỂN SINH NGÀNH KỸ THUẬT LÀM BÁNH", description: "KHAI GIẢNG NGÀY 07.09.2026", active: true },
    { id: 3, slug: "nghiep-vu-nghe-nong-nghiep-he-so-cap", title: "TUYỂN SINH NGHIỆP VỤ NGHỀ NÔNG NGHIỆP HỆ SƠ CẤP", active: true },
  ];
  const data = initialDataForPath("/nganh-dao-tao", { programs, news: [] }, new Date("2026-09-25T02:00:00.000Z"));
  assert.equal(data.renderedAt, "2026-09-25T02:00:00.000Z");
  const html = renderAppHtml("/nganh-dao-tao", data).replace(/<!-- -->/g, "");
  assert.match(html, /Khai giảng 07\.10\.2026/);
  assert.doesNotMatch(html, /Khai giảng 07\.09\.2026/, "ngày đã qua không hiện");
  assert.match(html, /Cấp bằng trung cấp/);
  assert.match(html, /Cấp chứng chỉ/);
  assert.match(html, /3 ngành và khóa học đang tuyển sinh/);
});

test("should let the home page reach every program in one click", () => {
  // Search Console 19/10/2026: trang chủ gánh 117/145 lượt hiển thị — là trang duy nhất Google
  // thật sự tin. Trước đây nó chỉ trỏ tới 12/26 ngành, 14 ngành còn lại phải đi vòng.
  const programs = PROGRAM_FIELDS.flatMap((field) => field.programs).map((item, i) => ({
    id: i + 1,
    slug: item.slug,
    title: item.name,
    description: "mô tả",
  }));
  const html = renderAppHtml("/", { [initialDataKeys.programs]: programs });

  const thieu = programs.filter((p) => !html.includes(`href="/nganh-dao-tao/${p.slug}"`));
  assert.deepEqual(thieu.map((p) => p.slug), [], "trang chủ phải trỏ tới mọi ngành");
});

test("should put the programs people actually search for in the card grid", () => {
  // Chọn theo dữ liệu, không theo cảm tính: chăm sóc người cao tuổi đang ở hạng 16–25, còn
  // chế biến món ăn và kỹ thuật xây dựng là hai ngành cấp nhiều văn bằng nhất sau điều dưỡng.
  for (const slug of ["cham-soc-nguoi-cao-tuoi", "ky-thuat-che-bien-mon-an", "trung-cap-ky-thuat-xay-dung"]) {
    assert.ok(FEATURED_PROGRAM_SLUGS.includes(slug), `${slug} phải nằm trong nhóm ưu tiên`);
  }
  assert.ok(FEATURED_PROGRAM_SLUGS.length <= 12, "nhóm ưu tiên không được vượt số thẻ hiện trên trang chủ");
});
