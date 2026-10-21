import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { renderAppHtml } from "../../../src/ssr/renderPage";
import { consentNote, PRIVACY_POLICY_VERSION } from "../../../src/content/privacy";
import { staticPageMeta } from "../../../src/seo/pageMeta";
import appConfig from "../../../src/configs/appConfig";
import { ROUTES } from "../../../src/content/directions";

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
  // Phải khai báo ĐỦ bên nhận dữ liệu: thiếu Microsoft Clarity là thiếu một bên chuyển dữ liệu
  // ra nước ngoài (công cụ này quay lại phiên, không chỉ đếm lượt truy cập).
  assert.match(privacy, /Microsoft Clarity/);
  assert.match(privacy, /Microsoft Corporation/);
  assert.match(privacy, /ngoài Việt Nam/);
  // Mô tả đúng cơ chế đang chạy: có banner đồng ý, chưa đồng ý thì không tải gì
  assert.match(privacy, /chỉ khi bạn bấm Đồng ý/i);
  assert.match(privacy, /Cài đặt cookie/);
  assert.match(privacy, /không chạy ở trang tra cứu văn bằng/);
  // Ô đồng ý ở form tư vấn thì vẫn là đồng ý thật, phải giữ
  assert.match(privacy, /tự tích ô đồng ý/);
});

test("should tell search engines the Google profile and the website are the same school", () => {
  // Hồ sơ Google Maps lập 21/10/2026. Thiếu khai báo này thì Google coi hồ sơ bản đồ và website
  // là hai thực thể rời nhau, không cái nào đủ mạnh để giữ vị trí 1 cho chính tên trường.
  const graph = JSON.stringify(staticPageMeta("/")?.jsonLd ?? {});
  assert.match(graph, /place_id:ChIJB2eeS-EpdTERRdxvFwK6VRQ/, "sameAs phải có hồ sơ Google");

  const node = (staticPageMeta("/").jsonLd[0]["@graph"] ?? []).find((item) =>
    String(item["@type"]).includes("LocalBusiness")
  );
  assert.ok(node, "vẫn còn khối LocalBusiness");
  assert.ok(node.sameAs.some((url) => url.includes("place_id:")), "hồ sơ bản đồ nằm trong sameAs");
  assert.match(node.hasMap, /query_place_id=ChIJB2eeS-EpdTERRdxvFwK6VRQ/, "hasMap trỏ đúng hồ sơ");
});

test("should open turn-by-turn directions to the school profile, not a bare address", () => {
  // Nút cũ chỉ tra theo chữ nên Maps mở ra "Số 6 Phan Đình Giót" — một địa chỉ vô danh, không
  // phải hồ sơ trường. Kèm place_id thì mở đúng hồ sơ, nơi có ảnh, đánh giá, giờ mở cửa.
  assert.match(appConfig.directionsLink, /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1/);
  assert.match(appConfig.directionsLink, /destination_place_id=ChIJB2eeS-EpdTERRdxvFwK6VRQ/);
  assert.match(appConfig.mapLink, /query_place_id=ChIJB2eeS-EpdTERRdxvFwK6VRQ/);

  // Khung nhúng KHÔNG nhận place_id (đã thử: ra bản đồ thế giới) nên vẫn phải dò theo chữ
  assert.doesNotMatch(appConfig.mapUrl, /place_id/);
  assert.match(appConfig.mapUrl, /output=embed/);
});

test("should show the directions call to action on the contact page", () => {
  const html = renderAppHtml("/lien-he", {});
  assert.match(html, /Chỉ đường tới trường/);
  assert.match(html, /maps\/dir\/\?api=1/);
});

test("should show each route as a chain of landmarks, not one long sentence", () => {
  // Câu dài liền mạch đúng nhưng phải đọc hết mới biết đi đâu; trên điện thoại thành khối chữ.
  ROUTES.forEach((tuyen) => {
    assert.ok(tuyen.steps.length >= 3, `${tuyen.from}: tuyến phải có ít nhất 3 mốc`);
    assert.equal(tuyen.steps.at(-1), "Phan Đình Giót", `${tuyen.from}: mốc cuối phải là địa chỉ trường`);
    tuyen.steps.forEach((step) => {
      assert.ok(step.length <= 45, `${tuyen.from}: mốc "${step}" còn dài như một câu`);
    });
  });

  const html = renderAppHtml("/lien-he", {});
  // Tên đường vẫn nằm trong HTML để tìm kiếm theo khu vực đọc được
  for (const moc of ["Lăng Cha Cả", "Hoàng Văn Thụ", "Cộng Hòa", "Phạm Văn Đồng"]) {
    assert.ok(html.includes(moc), `mất mốc ${moc}`);
  }
});
