import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { renderAppHtml } from "../../../src/ssr/renderPage";
import { consentNote, PRIVACY_POLICY_VERSION } from "../../../src/content/privacy";
import { staticPageMeta } from "../../../src/seo/pageMeta";

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), "utf8");
const strip = (html) => html.replace(/<!-- -->/g, "");

test("should ask for explicit, unticked consent in the registration form", () => {
  const html = strip(renderAppHtml("/", {}));
  const checkbox = html.match(/<input[^>]*id="reg-consent"[^>]*>/)?.[0];
  assert.ok(checkbox, "consent checkbox rendered");
  assert.match(checkbox, /type="checkbox"/);
  assert.doesNotMatch(checkbox, /checked/);
  assert.match(html, /href="\/chinh-sach-bao-mat"/);
  // Nhãn gắn với ô nhập (WCAG)
  ["reg-fullName", "reg-phone", "reg-email", "reg-message", "reg-consent"].forEach((id) =>
    assert.match(html, new RegExp(`for="${id}"`), id)
  );
});

test("should keep consent evidence with the policy version", () => {
  const note = consentNote(new Date("2026-09-24T03:00:00.000Z"));
  assert.match(note, new RegExp(PRIVACY_POLICY_VERSION));
  assert.match(note, /2026-09-24T03:00:00.000Z/);
});

test("should not collect placeholder personal data from the footer", () => {
  const footer = read("src/components/Footer.jsx");
  assert.doesNotMatch(footer, /0000000000|defaultPhone|client\/consultations/);
  assert.doesNotMatch(read("src/sections/RegisterSection.jsx"), /0000000000/);
});

test("should load Google Analytics right away, with IP anonymisation", () => {
  const html = read("index.html");
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-/);
  assert.match(html, /anonymize_ip: true/);
  // Không còn lớp đồng ý cookie (nhà trường chọn chạy GA ngay)
  assert.doesNotMatch(html, /CONSENT_KEY|cookie-consent/i);
});

test("should publish privacy policy and disclosure pages as indexable pages", () => {
  ["/chinh-sach-bao-mat", "/cong-khai"].forEach((pagePath) => {
    const meta = staticPageMeta(pagePath);
    assert.ok(meta?.isIndexable, pagePath);
    const html = strip(renderAppHtml(pagePath, {}));
    assert.equal((html.match(/<h1/g) || []).length, 1, pagePath);
  });
  const disclosure = strip(renderAppHtml("/cong-khai", {}));
  assert.match(disclosure, /Quyết định số 1777\/LĐTBXH-QĐ/);
  // Không bịa số liệu: không có con số học phí, tỷ lệ việc làm
  const visibleText = disclosure.replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visibleText, /triệu|đồng\/|VNĐ|\d\s?%/);
  const privacy = strip(renderAppHtml("/chinh-sach-bao-mat", {}));
  assert.match(privacy, /Google Analytics/);
  assert.match(privacy, /Cài đặt cookie/);
});
