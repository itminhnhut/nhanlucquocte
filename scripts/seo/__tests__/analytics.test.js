import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import { contactEventName, trackEvent } from "../../../src/utils/analytics";

// GA4 chạy ngay khi mở trang (không có lớp đồng ý cookie) → chỉ cần có window.gtag là gửi được
function withBrowser(run) {
  const calls = [];
  globalThis.window = { gtag: (...args) => calls.push(args), location: { pathname: "/tuyen-sinh" } };
  try {
    run();
  } finally {
    delete globalThis.window;
  }
  return calls;
}

test("should name contact link clicks for GA4 conversions", () => {
  assert.equal(contactEventName("tel:+84707917119"), "click_call");
  assert.equal(contactEventName("https://zalo.me/0707917119"), "click_zalo");
  assert.equal(contactEventName("mailto:nhanlucquocte.edu@trungcapnhanlucquocte.vn"), "click_email");
  assert.equal(contactEventName("/lien-he"), null);
  assert.equal(contactEventName("https://example.com/zalo.me/x"), null);
  assert.equal(contactEventName(undefined), null);
});

test("should send GA4 events with the current page path", () => {
  assert.deepEqual(withBrowser(() => trackEvent("click_call")), [
    ["event", "click_call", { page_path: "/tuyen-sinh" }],
  ]);
  // Server (tạo HTML sẵn): không có window → không lỗi
  assert.doesNotThrow(() => trackEvent("click_call"));
});

test("should load gtag.js right away, without a consent gate", () => {
  const indexHtml = fs.readFileSync("index.html", "utf8");
  assert.match(indexHtml, /googletagmanager\.com\/gtag\/js\?id=G-/);
  assert.match(indexHtml, /gtag\("config", "G-[A-Z0-9]+"/);
});

test("should track a lead after the consultation form is sent, without personal data", () => {
  const form = fs.readFileSync("src/sections/RegisterSection.jsx", "utf8");
  const call = form.match(/trackEvent\("generate_lead", ([^)]*)\)/)?.[1];
  assert.ok(call, "generate_lead sent");
  assert.doesNotMatch(call, /fullName|phone|email|values/);
  // generate_lead chỉ được gửi SAU khi API nhận đơn (không tính các trackEvent khác trong file)
  assert.ok(
    form.indexOf('https.post("client/consultations"') < form.indexOf('trackEvent("generate_lead"'),
    "only after the API accepted it"
  );
  // Phễu: có mốc bắt đầu điền form và mốc gửi lỗi
  assert.match(form, /trackEvent\("form_start"/);
  assert.match(form, /trackEvent\("form_error"/);
});
