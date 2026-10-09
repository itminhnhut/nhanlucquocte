import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { PUBLISHED_FEE } from "../../../src/content/fees";
import { ADMISSIONS_SECTIONS } from "../../../src/content/admissions";
import { programsWithUnknownLevel, publishedProgramsByLevel } from "../../../src/content/programFields";
import { renderAppHtml } from "../../../src/ssr/renderPage";

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

/** Bỏ dòng chú thích lập trình — chỉ soát chữ thật sự in ra trang */
const visibleLines = (source) =>
  source.split("\n").filter((line) => {
    const trimmed = line.trimStart();
    return !trimmed.startsWith("//") && !trimmed.startsWith("*") && !trimmed.startsWith("/*");
  });

const CONTENT_FILES = fs
  .readdirSync(path.join(process.cwd(), "src/content"))
  .filter((file) => file.endsWith(".ts"))
  .map((file) => `src/content/${file}`)
  .concat(["src/configs/seo.config.ts", "src/configs/appConfig.ts"]);

const visibleContent = () => CONTENT_FILES.map((file) => visibleLines(read(file)).join("\n")).join("\n");

// Website chỉ dẫn văn bản ĐANG CÓ HIỆU LỰC. Nghị định 81/2021/NĐ-CP, 97/2023/NĐ-CP và
// 104/2022/NĐ-CP đã bị Nghị định 238/2025/NĐ-CP thay thế (xem docs/can-truong-cung-cap.md mục 5).
const REPEALED = ["81/2021/NĐ-CP", "97/2023/NĐ-CP", "104/2022/NĐ-CP"];

test("should not cite a repealed decree in page content", () => {
  const content = visibleContent();
  REPEALED.forEach((number) =>
    assert.doesNotMatch(content, new RegExp(number.replace(/\//g, "\\/")), `còn dẫn ${number}`)
  );
});

test("should state only the one tuition figure the school has published", () => {
  // Nguồn: bài "KHAI GIẢNG LỚP NẤU ĂN NHÀ HÀNG KHÓA 08/2025" trên trungcapnhanlucquocte.vn
  assert.equal(PUBLISHED_FEE.amount, "8.800.000 đồng/khóa");
  assert.equal(PUBLISHED_FEE.announcedOn, "04/8/2025");
  assert.match(PUBLISHED_FEE.course, /Nấu ăn nhà hàng/);

  // Không được xuất hiện con số tiền nào khác trong nội dung web
  const amounts = new Set(
    visibleContent()
      .match(/\d{1,3}(?:\.\d{3})+\s*(?:đồng|đ\b|VNĐ)/gi)
      ?.map((value) => value.replace(/\s+/g, " ")) ?? []
  );
  assert.deepEqual([...amounts], ["8.800.000 đồng"], "chỉ được có đúng mức học phí trường đã công bố");
});

test("should not promise a tuition exemption or scholarship the school has not published", () => {
  const content = visibleContent();
  // Site của trường không có chữ nào về miễn, giảm, hỗ trợ học phí theo chính sách Nhà nước
  assert.doesNotMatch(content, /miễn,? ?(giảm|hỗ trợ) học phí/i);
  assert.doesNotMatch(content, /được miễn học phí/i);
  assert.doesNotMatch(content, /trường (được |sẽ )?miễn (toàn bộ )?học phí/i);
});

test("should not state opening hours the school has never published", () => {
  // Rà 53 trang trungcapnhanlucquocte.vn (09/10/2026): không có chỗ nào công bố giờ làm việc
  const config = read("src/configs/appConfig.ts");
  assert.doesNotMatch(visibleLines(config).join("\n"), /openingHours/);
  ["src/components/Footer.jsx", "src/components/ContactCard.jsx", "src/pages/ContactPage.jsx"].forEach(
    (file) => assert.doesNotMatch(read(file), /openingHoursLabel|8:00 – 17:00/, file)
  );
});

test("should never list a program next to a credential the school has not published", () => {
  // Trợ lý nha khoa, Beauty Therapy, Chăm sóc da: trang của trường không nêu trình độ. Beauty
  // Therapy còn ghi "Thời gian đào tạo: 02 năm" nên xếp vào "khóa ngắn hạn, cấp chứng chỉ" là SAI.
  const unknown = programsWithUnknownLevel().map((program) => program.name);
  assert.deepEqual(unknown.sort(), ["Beauty Therapy", "Chăm sóc da", "Trợ lý nha khoa"]);

  // Dòng liệt kê kèm văn bằng ở /tuyen-sinh chỉ được chứa ngành đã xác nhận
  const withCredential = ADMISSIONS_SECTIONS.flatMap((section) => section.list ?? []).filter((line) =>
    /cấp bằng trung cấp|cấp chứng chỉ/.test(line)
  );
  assert.ok(withCredential.length >= 2, "vẫn còn dòng nêu văn bằng theo hệ");
  withCredential.forEach((line) =>
    unknown.forEach((name) => assert.ok(!line.includes(name), `"${name}" bị liệt kê kèm văn bằng: ${line}`))
  );

  // Quét TOÀN BỘ nội dung: không câu nào được đặt tên 3 nghề này cạnh chữ chứng chỉ/bằng
  // trong cùng một câu. Trước đây lỗi này còn ở programFaqs.ts và guides.ts.
  const CREDENTIAL = /(cấp chứng chỉ|cấp bằng|khóa ngắn hạn|hệ sơ cấp|sơ cấp, ngắn hạn)/;
  CONTENT_FILES.forEach((file) => {
    visibleLines(read(file)).forEach((line, index) => {
      const named = unknown.filter((name) => line.includes(name));
      if (named.length === 0) return;
      // Câu nào nói rõ "chưa công bố" thì được phép nhắc tên kèm ngữ cảnh
      if (/chưa công bố|chưa xác nhận|chưa nêu|KHÔNG|không nêu/.test(line)) return;
      assert.doesNotMatch(
        line,
        CREDENTIAL,
        `${file}:${index + 1} gán văn bằng cho ${named.join(", ")}`
      );
    });
  });

  // /cong-khai: câu tổng số phải đếm theo ngành đã xác nhận
  const html = renderAppHtml("/cong-khai", {}).replace(/<!-- -->/g, "");
  const confirmed = publishedProgramsByLevel("trung-cap").length;
  assert.match(html, new RegExp(`Tổng cộng\\s*${confirmed}\\s*ngành hệ trung cấp`));
  assert.match(html, /chưa công bố hệ đào tạo/);
});

test("should not claim an admission method the school has never published", () => {
  // Rà 68 trang trungcapnhanlucquocte.vn: không chỗ nào viết "không thi tuyển" hay "quanh năm".
  // Ngược lại, trang tuyển sinh liên thông của trường ghi "Hoặc thi tuyển: Một số trường yêu cầu
  // thi môn cơ sở ngành" → câu "xét tuyển, không thi tuyển" là sai với chính hệ đó.
  const FILES = CONTENT_FILES.concat([
    "src/sections/HeroSection.jsx",
    "src/sections/RegisterSection.jsx",
    "src/pages/ProgramDetailPage.jsx",
    "src/pages/DisclosurePage.jsx",
  ]);
  FILES.forEach((file) => {
    const visible = visibleLines(read(file)).join("\n");
    assert.doesNotMatch(visible, /không thi tuyển/i, file);
    assert.doesNotMatch(visible, /quanh năm/i, file);
  });
  // Hệ liên thông phải nêu đúng cả khả năng phải thi
  const admissions = read("src/content/admissions.ts");
  assert.match(admissions, /thi môn cơ sở ngành/);
});

test("should not notify search engines when running outside the server", () => {
  // Chạy bộ tạo trang ở máy mà vẫn ping IndexNow = báo Bing đi lấy các URL chưa tồn tại
  const source = read("scripts/seo/indexNow.js");
  assert.match(source, /INDEXNOW_ENABLED !== "1"/);
  // Máy chủ bật rõ ràng trong docker/env.sh
  assert.match(read("docker/env.sh"), /INDEXNOW_ENABLED=1/);
});
