import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import appConfig from "../../../src/configs/appConfig";
import { programPageMeta } from "../../../src/seo/pageMeta";

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
  ["chuyen-nganh-dieu-duong-he-trung-cap", "cham-soc-sac-dep-he-trung-cap"].forEach((slug) => {
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
