import test from "node:test";
import assert from "node:assert/strict";
import { SEO_CONFIG } from "../../../src/configs/seo.config";
import {
  isUpcomingDate,
  parseOpeningDate,
  parseProgramName,
  programHeading,
  programLead,
  programSeoCopy,
} from "../../../src/seo/programCopy";
import { newsPageMeta, truncateAtWord } from "../../../src/seo/pageMeta";
import { demoteH1 } from "../../../src/utils/html";
import { withFeaturedFirst } from "../../../src/configs/featuredPrograms";
import { ALL_PROGRAMS } from "../../../src/content/programFields";

test("should keep every real program title within 60 characters", () => {
  const titles = [
    "TUYỂN SINH NGÀNH KỸ THUẬT XÂY DỰNG HỆ TRUNG CẤP",
    "TUYỂN SINH NGÀNH CÔNG NGHỆ KỸ THUẬT Ô TÔ",
    "TUYỂN SINH LỚP TIẾNG VIỆT THỰC HÀNH CHO NGƯỜI NƯỚC NGOÀI",
  ];

  titles.forEach((title) => {
    const copy = programSeoCopy("slug-moi", { title });
    assert.ok(copy.title.length <= 60, `title quá dài (${copy.title.length}): ${copy.title}`);
  });
});

test("should keep static titles and descriptions within search result limits and unique", () => {
  const entries = Object.values(SEO_CONFIG);

  entries.forEach(({ title, description }) => {
    assert.ok(title.length <= 60, `title quá dài (${title.length}): ${title}`);
    assert.ok(description.length <= 160, `description quá dài (${description.length}): ${description}`);
  });
  assert.equal(new Set(entries.map((entry) => entry.title)).size, entries.length);
  assert.equal(new Set(entries.map((entry) => entry.description)).size, entries.length);
});

test("should convert upper-case program titles to sentence case keeping proper nouns", () => {
  assert.deepEqual(parseProgramName("TUYỂN SINH NGÀNH NGÔN NGỮ ANH"), { name: "Ngôn ngữ Anh", kind: "ngành" });
  assert.deepEqual(parseProgramName("TUYỂN SINH LỚP TIẾNG VIỆT THỰC HÀNH CHO NGƯỜI NƯỚC NGOÀI"), {
    name: "Tiếng Việt thực hành cho người nước ngoài",
    kind: "lớp",
  });
  assert.equal(parseProgramName("TUYỂN SINH NGÀNH ĐIỀU DƯỠNG").name, "Điều dưỡng");
  assert.equal(parseProgramName("TUYỂN SINH NGÀNH KỸ THUẬT XÂY DỰNG HỆ TRUNG CẤP").name, "Kỹ thuật xây dựng");
});

test("should read opening date from API description", () => {
  assert.equal(parseOpeningDate("KHAI GIẢNG NGÀY 7.9.2026"), "07.09.2026");
  assert.equal(parseOpeningDate("KHAI GIẢNG 21.09.2026"), "21.09.2026");
  assert.equal(parseOpeningDate("Đang cập nhật"), null);
});

const BEFORE_OPENING = new Date(2026, 8, 1);
const AFTER_OPENING = new Date(2026, 8, 22);

test("should add the upcoming opening date to program copy", () => {
  const copy = programSeoCopy(
    "ke-toan-doanh-nghiep",
    { title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP", description: "KHAI GIẢNG NGÀY 15.09.2026" },
    BEFORE_OPENING
  );

  assert.match(copy.title, /^Trung cấp Kế toán doanh nghiệp TPHCM \| /);
  assert.match(copy.description, /^Tuyển sinh trung cấp Kế toán doanh nghiệp tại TPHCM/);
  assert.match(copy.description, /Khai giảng 15\.09\.2026\.$/);
  assert.ok(copy.description.length <= 160);
});

test("should drop the opening date from description once it has passed", () => {
  const program = { title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP", description: "KHAI GIẢNG NGÀY 15.09.2026" };

  const copy = programSeoCopy("ke-toan-doanh-nghiep", program, AFTER_OPENING);

  assert.doesNotMatch(copy.description, /Khai giảng/);
});

test("should keep every program in the catalog within search result limits", () => {
  const titles = ALL_PROGRAMS.map(({ slug, name }) => {
    const title = `TUYỂN SINH NGÀNH ${name.toLocaleUpperCase("vi")}`;
    const copy = programSeoCopy(slug, { title, description: "KHAI GIẢNG NGÀY 30.12.2026" }, BEFORE_OPENING);
    assert.ok(copy.title.length <= 60, `${slug} title (${copy.title.length}): ${copy.title}`);
    assert.ok(copy.description.length <= 160, `${slug} description (${copy.description.length})`);
    // Tên ngành dài thì withBrandFit bỏ hậu tố thương hiệu để title không quá 60 ký tự
    if (copy.title.length <= 60 && copy.title.includes(" | ")) assert.match(copy.title, /Nhân Lực Quốc Tế/, slug);
    return copy.title;
  });
  assert.equal(new Set(titles).size, titles.length);
});

test("should build a readable keyword heading and lead for program pages", () => {
  assert.equal(programHeading("TUYỂN SINH NGÀNH ĐIỀU DƯỠNG"), "Trung cấp Điều dưỡng tại TPHCM");
  assert.equal(programHeading("TUYỂN SINH KHÓA HỌC NGHIỆP VỤ BẢO MẪU"), "Khóa học Nghiệp vụ bảo mẫu tại TPHCM");

  const lead = programLead("ke-toan-doanh-nghiep", {
    title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP",
    description: "KHAI GIẢNG NGÀY 07.09.2026",
  });
  assert.match(lead, /^Tuyển sinh trung cấp Kế toán doanh nghiệp tại TPHCM/);
  assert.doesNotMatch(lead, /KHAI GIẢNG/);
});

test("should generate copy from program name for new programs", () => {
  const copy = programSeoCopy("nganh-moi", { title: "TUYỂN SINH NGÀNH LOGISTICS", description: "" });

  assert.equal(copy.title, "Trung cấp Logistics TPHCM | Trung cấp nghề Nhân Lực Quốc Tế");
  assert.match(copy.description, /^Tuyển sinh trung cấp Logistics tại TPHCM/);
});

test("should cut long news descriptions at a word boundary", () => {
  const long = "Học viên Nhân Lực Quốc Tế tham gia ngày hội việc làm ".repeat(10);

  const cut = truncateAtWord(long);

  assert.ok(cut.length <= 155);
  assert.match(cut, /…$/);
  assert.doesNotMatch(cut, /\s…$/);
  assert.equal(newsPageMeta({ title: "Ngày hội việc làm" }, "ngay-hoi").title, "Ngày hội việc làm | Trường Trung cấp nghề Nhân Lực Quốc Tế");
  // Tiêu đề vừa 60 ký tự → giữ nguyên, không ghép thương hiệu
  const fitHeadline = "Học spa chuyên nghiệp ở TPHCM: lộ trình cho người mới";
  assert.equal(newsPageMeta({ title: fitHeadline }, "spa").title, fitHeadline);
  // Tiêu đề quá dài → cắt ở ranh giới từ cho thẻ <title>
  const longHeadline = "Đào tạo kỹ năng mềm chuyên sâu dành cho học viên trước khi xuất cảnh năm 2026";
  const cutTitle = newsPageMeta({ title: longHeadline }, "ky-nang-mem").title;
  assert.ok(cutTitle.length <= 60, cutTitle);
  assert.match(cutTitle, /…$/);
});

test("should demote h1 headings inside CMS content to h2", () => {
  assert.equal(demoteH1('<h1 class="x">A</h1><h2>B</h2><h1>C</h1>'), '<h2 class="x">A</h2><h2>B</h2><h2>C</h2>');
  assert.equal(demoteH1("<header>x</header>"), "<header>x</header>");
});

test("should put featured programs first on the homepage keeping the rest in order", () => {
  const programs = [{ slug: "a" }, { slug: "b" }, { slug: "chuyen-nganh-dieu-duong-he-trung-cap" }, { slug: "c" }];

  assert.deepEqual(
    withFeaturedFirst(programs).map((program) => program.slug),
    ["chuyen-nganh-dieu-duong-he-trung-cap", "a", "b", "c"]
  );
});

test("should decide whether an opening date has passed by Vietnam date, not server timezone", () => {
  // 27/09 18:00 UTC = 28/09 01:00 giờ Việt Nam
  const lateNightUtc = new Date("2026-09-27T18:00:00.000Z");

  assert.equal(isUpcomingDate("28.09.2026", lateNightUtc), true);
  assert.equal(isUpcomingDate("27.09.2026", lateNightUtc), false);
});
