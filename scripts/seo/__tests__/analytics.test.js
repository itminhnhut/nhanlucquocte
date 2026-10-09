import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import { contactEventName, trackEvent } from "../../../src/utils/analytics";
import { isSessionRecordingAllowed, readConsent } from "../../../src/utils/consent";

// GA4 chỉ chạy sau khi người dùng bấm Đồng ý (src/components/CookieConsent.jsx). Khi chưa đồng ý
// thì không có window.gtag và trackEvent phải im lặng, không được lỗi.
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

test("should not load any tracker before the visitor agrees", () => {
  const indexHtml = fs.readFileSync("index.html", "utf8");
  // Script đo lường chỉ được nhắc BÊN TRONG hàm __nlqtLoadAnalytics, không chạy lúc nạp trang
  const loader = indexHtml.slice(indexHtml.indexOf("__nlqtLoadAnalytics"));
  assert.match(loader, /googletagmanager\.com\/gtag\/js\?id=G-/);
  assert.match(loader, /clarity\.ms\/tag\//);
  // Không có địa chỉ công cụ nào nằm ngoài hàm nạp
  const beforeLoader = indexHtml.slice(0, indexHtml.indexOf("__nlqtLoadAnalytics"));
  assert.doesNotMatch(beforeLoader, /googletagmanager\.com|clarity\.ms|google-analytics\.com/);
  // Không đoạn nào tự gọi hàm nạp: chỉ CookieConsent gọi, qua startAnalytics()
  assert.doesNotMatch(indexHtml, /__nlqtLoadAnalytics\s*\(/);
  // Và KHÔNG tạo sẵn window.gtag / window.clarity trước khi đồng ý — nếu tạo sẵn thì mọi thao tác
  // trước lúc đồng ý vẫn bị dồn vào hàng đợi rồi gửi hết đi ngay khi người dùng bấm Đồng ý
  assert.doesNotMatch(beforeLoader, /window\.gtag\s*=|function gtag|window\.clarity\s*=/);
});

test("should keep tracking off until consent, and never record sessions on the degree lookup", () => {
  assert.equal(readConsent(), null, "server/chưa chọn → không đo");
  assert.equal(isSessionRecordingAllowed("/tra-cuu-van-bang"), false);
  assert.equal(isSessionRecordingAllowed("/tra-cuu-van-bang/abc"), false);
  assert.equal(isSessionRecordingAllowed("/"), true);
  assert.equal(isSessionRecordingAllowed("/tuyen-sinh"), true);
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
