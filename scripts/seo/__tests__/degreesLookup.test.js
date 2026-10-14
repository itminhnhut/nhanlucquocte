import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { CCCD_PATTERN, flattenRecords } from "../../../src/pages/Degrees";

const source = fs.readFileSync(path.join(process.cwd(), "src/pages/Degrees.jsx"), "utf8");

// Dữ liệu thật trả về từ GET client/certificates/034077006515 (ngày 14/10/2026)
const API_RESPONSE = [
  {
    id: 3,
    fullName: "NGUYỄN VIỆT CƯỜNG",
    dateOfBirth: "1977-12-30T00:00:00.000Z",
    schoolCode: "NLQT",
    certificates: [
      {
        id: 4,
        certNumber: "000705/BC-NLQT",
        serialNo: "000705",
        seriesCode: "BC",
        program: "CHĂM SÓC SẮC ĐẸP",
        level: 4,
        qualification: "TRUNG_CAP",
        deliveryMode: "OFFLINE",
      },
    ],
  },
];

test("should query the certificates table, not the empty degrees table", () => {
  // Bảng `degrees` của API có 0 dòng và chỉ ghi được qua form tốt nghiệp của từng học viên;
  // toàn bộ 67 hồ sơ văn bằng của trường nằm ở `certificate-records`.
  assert.match(source, /client\/certificates\/\$\{encodeURIComponent\(code\)\}/);
  assert.doesNotMatch(source, /client\/degrees/);
});

test("should read the real fields the lookup returns", () => {
  const [row] = flattenRecords(API_RESPONSE);
  assert.equal(row.fullName, "NGUYỄN VIỆT CƯỜNG");
  assert.equal(row.dateOfBirth, "1977-12-30T00:00:00.000Z");
  assert.equal(row.certNumber, "000705/BC-NLQT");
  assert.equal(row.program, "CHĂM SÓC SẮC ĐẸP");
  assert.equal(row.qualification, "Trung cấp");
  assert.equal(row.deliveryMode, "Học trực tiếp");
});

test("should list every certificate a person holds", () => {
  const rows = flattenRecords([
    {
      fullName: "Học viên hai bằng",
      certificates: [
        { id: 1, certNumber: "A/SCN-NLQT", qualification: "SO_CAP" },
        { id: 2, certNumber: "B/BC-NLQT", qualification: "TRUNG_CAP" },
      ],
    },
  ]);
  assert.equal(rows.length, 2);
  assert.deepEqual(
    rows.map((row) => row.qualification),
    ["Sơ cấp", "Trung cấp"]
  );
});

test("should return nothing when a record has no certificate attached", () => {
  assert.deepEqual(flattenRecords([{ fullName: "Chưa có bằng" }]), []);
  assert.deepEqual(flattenRecords([]), []);
});

test("should accept a 12-digit CCCD and a 9-digit CMND but reject anything else", () => {
  assert.ok(CCCD_PATTERN.test("034077006515"));
  assert.ok(CCCD_PATTERN.test("075191016026"));
  assert.ok(CCCD_PATTERN.test("123456789"));
  ["", "1234", "034077006515 ", "03407700651a", "01234567890123"].forEach((value) =>
    assert.ok(!CCCD_PATTERN.test(value), `phải chặn "${value}"`)
  );
});

test("should not show a field the certificates lookup never returns", () => {
  // API công khai không trả CCCD (tránh phát tán số định danh), cũng không có xếp loại,
  // năm tốt nghiệp hay ngày cập nhật → không được để ô trống chờ dữ liệu không bao giờ tới.
  ["Số CCCD\"", "Xếp loại", "Năm tốt nghiệp", "Cập nhật:"].forEach((label) =>
    assert.ok(!source.includes(`label="${label}`) && !source.includes(label), `còn hiển thị ${label}`)
  );
});
