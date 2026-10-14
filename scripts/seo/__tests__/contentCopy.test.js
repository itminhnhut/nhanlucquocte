import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import appConfig from "../../../src/configs/appConfig";
import { programPageMeta } from "../../../src/seo/pageMeta";
import { programSeoCopy } from "../../../src/seo/programCopy";
import { renderAppHtml } from "../../../src/ssr/renderPage";

const CANONICAL_ADDRESS = "Số 6 Phan Đình Giót, phường Tân Sơn Hòa (Quận Tân Bình cũ), TP. Hồ Chí Minh";

// Chạy từ root project (npm run test:seo)
const readSource = (file) => fs.readFileSync(path.join(process.cwd(), "src", file), "utf8");

const VISIBLE_COPY_FILES = [
  "sections/IntroSection.jsx",
  "sections/HeroSection.jsx",
  "sections/TrainingFieldsSection.jsx",
  "pages/ContactPage.jsx",
  "pages/NewsPage.jsx",
  "pages/SearchPage.jsx",
  "pages/Degrees.jsx",
  "pages/AboutPage.jsx",
];

test("should use the canonical school address in config", () => {
  assert.equal(appConfig.address, CANONICAL_ADDRESS);
});

test("should describe the school as vocational, never as a university or study-abroad service", () => {
  VISIBLE_COPY_FILES.forEach((file) => {
    const source = readSource(file);

    assert.doesNotMatch(source, /giáo dục đại học|hệ đại\s+học|sinh viên|du học/i, file);
  });
});

test("should not show conflicting student counts on home and about pages", () => {
  const hero = readSource("sections/HeroSection.jsx");
  const about = readSource("pages/AboutPage.jsx");

  assert.doesNotMatch(hero, /25\.000|20\+/, "HeroSection");
  assert.doesNotMatch(about, /40\.000|3\.000/, "AboutPage");
});

test("should give campus images descriptive alt text", () => {
  assert.doesNotMatch(readSource("sections/IntroSection.jsx"), /alt=\{`Hình ảnh trường \$\{/);
});

test("should keep program descriptions short and free of the old ward", () => {
  ["dieu-duong-he-trung-cap", "cham-soc-sac-dep-he-trung-cap"].forEach((slug) => {
    const { description } = programPageMeta({ title: "TUYỂN SINH NGÀNH X" }, slug);

    assert.doesNotMatch(description, /Bàn Cờ|Quận 3/, slug);
    assert.ok(description.length <= 160, `${slug}: ${description.length}`);
  });
});

test("should not preload the hero image in the shared HTML template", () => {
  const template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");

  assert.doesNotMatch(template, /rel="preload"[\s\S]*?welcome_back_to_school/);
});

test("should keep Google and Bing site verification tags in the shared HTML template", () => {
  const template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");

  assert.match(template, /name="google-site-verification"/);
  assert.match(template, /<meta name="msvalidate\.01" content="6B9CB4DD823FB21C81485DF4FA0336D9" \/>/);
});

test("should not load the Google map before the visitor asks for it", () => {
  // iframe của Google gửi IP, referrer và cookie Google ngay khi mở trang. Chính sách bảo mật
  // của trường khẳng định không gì của Google nhận được dữ liệu khi chưa đồng ý.
  const source = fs.readFileSync(path.join(process.cwd(), "src/pages/ContactPage.jsx"), "utf8");
  assert.match(source, /showMap \? \(/, "iframe phải nằm sau một lần bấm");
  assert.match(source, /Mở bản đồ/);
  // Và HTML tạo sẵn không được chứa iframe nào
  const html = renderAppHtml("/lien-he", {});
  assert.doesNotMatch(html, /<iframe/i, "HTML tạo sẵn còn nhúng iframe");
  assert.match(html, /Mở bản đồ/);
});

test("should not claim a level in the description when the school has not published one", () => {
  // Ba ngành này trường không nêu hệ đào tạo ở đâu; chính trang ngành ghi "gọi hotline để
  // được xác nhận". Description cũ vẫn mở đầu "Tuyển sinh trung cấp …" — nói ngược nội dung.
  const CHUA_CONG_BO = ["cham-soc-da-chuyen-nghiep", "beauty-therapy-lieu-phap-lam-dep", "nghiep-vu-tro-ly-nha-khoa"];
  CHUA_CONG_BO.forEach((slug) => {
    const { title, description } = programSeoCopy(slug, { title: "", description: "" });
    // Chỉ xét phần KHẲNG ĐỊNH về ngành, không xét tên trường (tên trường vốn chứa
    // "Trung cấp nghề" nên quét cả câu là bắt oan thương hiệu)
    assert.doesNotMatch(description, /Tuyển sinh trung cấp/i, `${slug}: description khẳng định trung cấp`);
    assert.match(description, /^Tuyển sinh ngành /, `${slug}: phải nêu trung lập là "ngành"`);
    assert.doesNotMatch(title, /^Trung cấp/, `${slug}: title khẳng định trung cấp`);
  });
});

test("should still describe a confirmed trung cap program as trung cap", () => {
  const { description } = programSeoCopy("dieu-duong-he-trung-cap", { title: "", description: "" });
  assert.match(description, /trung cấp/i);
});

test("should describe a lien thong program as lien thong, matching its title", () => {
  // 2 ngành liên thông có levelConfirmed → trường ĐÃ công bố hệ, nhưng mô tả mặc định
  // thiếu nhánh "lien-thong" nên tụt về "ngành …" trong khi title ghi "Liên thông đại học …"
  const { title, description } = programSeoCopy("lien-thong-dai-hoc-nganh-quan-tri-dich-vu-an-uong-va-am-thuc", {
    title: "",
    description: "",
  });
  assert.match(title, /^Liên thông đại học/);
  assert.match(description, /^Tuyển sinh liên thông đại học/);

  // Tên danh mục đã chứa chữ "Liên thông" → không được ghép tiền tố lần nữa
  const lap = programSeoCopy("lien-thong-tu-trung-cap-len-dai-hoc", { title: "", description: "" });
  assert.doesNotMatch(lap.title, /Liên thông đại học Liên thông/i, lap.title);
  assert.doesNotMatch(lap.description, /liên thông đại học Liên thông/i, lap.description);
});

test("should ask for the three fields the admin shows but never receives", () => {
  // Trang Tư vấn của admin có sẵn cột location, currentLevel và programId, nhưng form đăng ký
  // chưa bao giờ hỏi → ba cột đó luôn trống, nhân viên tuyển sinh không biết người đăng ký
  // muốn học ngành gì, ở đâu, đang học tới đâu.
  const html = renderAppHtml("/", { programs: [{ id: 7, title: "Điều dưỡng", slug: "dieu-duong-he-trung-cap" }] });
  assert.match(html, /id="reg-program"/, "thiếu ô chọn ngành");
  assert.match(html, /id="reg-level"/, "thiếu ô trình độ hiện tại");
  assert.match(html, /id="reg-location"/, "thiếu ô nơi ở");
  // Ô ngành phải lấy từ danh sách thật, không phải danh sách gõ tay
  assert.match(html, /<option value="7">Điều dưỡng<\/option>/);
  // Vẫn phải cho phép bỏ trống: người chưa biết chọn gì thì nhờ trường tư vấn
  assert.match(html, /Chưa chọn — nhờ trường tư vấn/);
  const source = fs.readFileSync(path.join(process.cwd(), "src/sections/RegisterSection.jsx"), "utf8");
  // API khai programId là số, ô select trả chuỗi
  assert.match(source, /payload\.programId = Number\(values\.programId\)/);
});

test("should keep the register form inside the screen on a phone", () => {
  // Thẻ <select> lấy chiều rộng tối thiểu theo option DÀI NHẤT (tên ngành dài nhất), mà phần
  // tử flex không co nhỏ hơn min-content nếu thiếu min-w-0 → cả form tràn ngang trên điện
  // thoại, phải kéo ngang mới đọc được.
  const source = fs.readFileSync(path.join(process.cwd(), "src/sections/RegisterSection.jsx"), "utf8");
  const selects = source.match(/<select[\s\S]*?>/g) ?? [];
  assert.equal(selects.length, 2, "số ô chọn đã đổi, xem lại phép kiểm này");
  selects.forEach((tag) => {
    assert.match(tag, /w-full/, "ô chọn thiếu w-full");
    assert.match(tag, /min-w-0/, "ô chọn thiếu min-w-0 — tên ngành dài sẽ làm tràn ngang");
  });
});

test("should fetch the program list once even when two blocks need it", () => {
  // Trang chủ có hai chỗ cần danh sách: khối "Chương trình đào tạo" và ô chọn ngành trong form
  // đăng ký. Mỗi chỗ tự gọi là tải client/programs hai lần — 254 KB nhân đôi.
  const hook = fs.readFileSync(path.join(process.cwd(), "src/hooks/usePrograms.js"), "utf8");
  assert.match(hook, /function fetchProgramsOnce/);
  assert.match(hook, /if \(!inFlight\)/, "request đang bay phải được dùng chung");
  assert.equal((hook.match(/\.get\("client\/programs"\)/g) ?? []).length, 1, "còn nhiều chỗ tự gọi");
  // Các trang khác không được tự gọi lại danh sách đầy đủ (SearchPage gọi kèm ?search= là khác)
  ["src/sections/ProgramsSection.jsx", "src/sections/RegisterSection.jsx"].forEach((file) => {
    const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    assert.ok(!/\.get\(["\`']client\/programs["\`']\)/.test(source), `${file} tự gọi API thay vì dùng hook`);
  });
});
