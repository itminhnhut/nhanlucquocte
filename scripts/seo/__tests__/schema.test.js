import test from "node:test";
import assert from "node:assert/strict";
import {
  STATIC_PATHS,
  newsPageMeta,
  programPageMeta,
  programsListPageMeta,
  staticPageMeta,
} from "../../../src/seo/pageMeta";

const graphOf = (meta) => meta.jsonLd[0]["@graph"];
// @type có thể là mảng (vd ["Course", "EducationalOccupationalProgram"])
const nodeOf = (meta, type) => graphOf(meta).find((node) => [].concat(node["@type"]).includes(type));

test("should describe the school as EducationalOrganization with logo and new address", () => {
  const org = nodeOf(staticPageMeta("/"), "EducationalOrganization");

  assert.equal(org.name, "Trường Trung cấp nghề Nhân Lực Quốc Tế");
  assert.equal(org.logo.url, "https://trungcapnhanlucquocte.vn/images/logo-512.png");
  assert.equal(org.address.streetAddress, "Số 6 Phan Đình Giót");
  assert.equal(org.address.addressLocality, "Phường Tân Sơn Hòa");
  assert.equal(org.telephone, "+84707917119");
  assert.match(org.hasMap, /^https:\/\/www\.google\.com\/maps/);
  assert.deepEqual(org.openingHoursSpecification.dayOfWeek, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  assert.equal(org.openingHoursSpecification.opens, "08:00");
});

test("should never claim university programs or the old address in any static page schema", () => {
  STATIC_PATHS.forEach((path) => {
    const json = JSON.stringify(staticPageMeta(path).jsonLd);

    // "liên thông lên cao đẳng, đại học" (FAQ) là hợp lệ; cấm câu sai "đại học và sau đại học"
    assert.doesNotMatch(json, /sau đại học|đào tạo đại học|Bàn Cờ|Nguyễn Thị Minh Khai/i, path);
  });
});

test("should add breadcrumb and course with readable name on program pages", () => {
  const meta = programPageMeta({ title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP" }, "ke-toan-doanh-nghiep");

  const course = nodeOf(meta, "Course");
  const crumbs = nodeOf(meta, "BreadcrumbList").itemListElement.map((item) => item.name);

  assert.equal(course.name, "Trung cấp Kế toán doanh nghiệp");
  assert.equal(course.provider["@id"], "https://trungcapnhanlucquocte.vn/#organization");
  assert.equal(course.provider.name, "Trường Trung cấp nghề Nhân Lực Quốc Tế");
  assert.deepEqual(course["@type"], ["Course", "EducationalOccupationalProgram"]);
  assert.equal(course.programType, "Trung cấp");
  assert.equal(course.educationalCredentialAwarded, "Bằng tốt nghiệp trung cấp");
  assert.deepEqual(crumbs, ["Trang chủ", "Ngành đào tạo", "Trung cấp Kế toán doanh nghiệp"]);
});

test("should not claim a credential for programs whose level the school has not stated", () => {
  const meta = programPageMeta({ title: "TUYỂN SINH CHĂM SÓC NGƯỜI CAO TUỔI" }, "cham-soc-nguoi-cao-tuoi");
  const course = nodeOf(meta, "Course");

  assert.equal(course.programType, undefined);
  assert.equal(course.educationalCredentialAwarded, undefined);
});

test("should list programs as Course items on the programs page", () => {
  const meta = programsListPageMeta([
    { slug: "ke-toan", title: "TUYỂN SINH NGÀNH KẾ TOÁN" },
    { slug: "bao-mau", title: "TUYỂN SINH KHÓA HỌC NGHIỆP VỤ BẢO MẪU" },
  ]);

  const items = nodeOf(meta, "ItemList").itemListElement;

  assert.equal(items.length, 2);
  assert.equal(items[1].position, 2);
  assert.equal(items[1].item["@type"], "Course");
  assert.equal(items[1].item.name, "Khóa học Nghiệp vụ bảo mẫu");
  assert.equal(items[0].item.url, "https://trungcapnhanlucquocte.vn/nganh-dao-tao/ke-toan");
});

test("should link news articles to the school as publisher", () => {
  const meta = newsPageMeta({ title: "Khai giảng 2026", createdAt: "2026-09-01" }, "khai-giang");

  const article = nodeOf(meta, "Article");

  assert.equal(article.publisher["@id"], "https://trungcapnhanlucquocte.vn/#organization");
  assert.equal(article.headline, "Khai giảng 2026");
  assert.ok(nodeOf(meta, "EducationalOrganization").logo);
});

test("should identify the school clearly so search engines do not confuse it with other Nhân Lực Quốc Tế names", () => {
  const org = nodeOf(staticPageMeta("/"), "EducationalOrganization");

  assert.equal(org.foundingDate, "2007");
  assert.ok(org.alternateName.includes("Trường Trung cấp nghề Nhân Lực Quốc Tế"));
  assert.ok(org.alternateName.includes("Trung cấp nghề Nhân Lực Quốc Tế"));
  assert.match(org.description, /Số 6 Phan Đình Giót/);
  assert.match(org.description, /Quyết định số 1777\/LĐTBXH-QĐ/);
  assert.ok(org.sameAs.every((url) => /^https:\/\//.test(url)), "sameAs chỉ chứa link đã điền");
  assert.equal(new Set(org.alternateName).size, org.alternateName.length);
  assert.ok(org.alternateName.length >= 3);
});

test("should mark short courses with a certificate and only list an upcoming start date", () => {
  const future = programPageMeta(
    { title: "TUYỂN SINH NGHIỆP VỤ NGHỀ NÔNG NGHIỆP HỆ SƠ CẤP", description: "KHAI GIẢNG NGÀY 07.10.2099" },
    "nghiep-vu-nghe-nong-nghiep-he-so-cap"
  );
  const program = nodeOf(future, "EducationalOccupationalProgram");
  assert.equal(program.programType, "Sơ cấp, ngắn hạn");
  assert.equal(program.educationalCredentialAwarded, "Chứng chỉ");
  assert.equal(program.startDate, "2099-10-07");
  const past = programPageMeta({ title: "TUYỂN SINH NGÀNH ĐIỀU DƯỠNG", description: "KHAI GIẢNG NGÀY 07.09.2020" }, "chuyen-nganh-dieu-duong-he-trung-cap");
  assert.equal(nodeOf(past, "EducationalOccupationalProgram").startDate, undefined);
});

test("should name the author and publisher inline on articles (Google reads author.name)", () => {
  const meta = newsPageMeta({ slug: "bai", title: "Bài", createdAt: "2026-09-10T02:00:00.000Z" }, "bai");
  const article = nodeOf(meta, "Article");
  assert.equal(article.author.name, "Trường Trung cấp nghề Nhân Lực Quốc Tế");
  assert.equal(article.author.url, "https://trungcapnhanlucquocte.vn/");
  assert.equal(article.publisher.logo.url, "https://trungcapnhanlucquocte.vn/images/logo-512.png");
});
