import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { CCCD_PATTERN, flattenRecords } from "../../../src/pages/Degrees";

const source = fs.readFileSync(path.join(process.cwd(), "src/pages/Degrees.jsx"), "utf8");

// Dữ liệu thật trả về từ GET client/certificates/… (ngày 14/10/2026). API gộp hai nguồn và
// mỗi nguồn chỉ có một nửa số trường — đây là lý do phải hiện cả 3 dòng Trình độ / Xếp loại /
// Năm tốt nghiệp, nguồn nào thiếu thì để trống.
const HO_SO_VAN_BANG = [
  {
    source: "certificate",
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
        rank: null,
        yearOfGrad: null,
      },
    ],
  },
];

const BANG_QUA_HOC_VIEN = [
  {
    source: "degree",
    id: 4,
    fullName: "TEST",
    dateOfBirth: "1992-10-07T00:00:00.000Z",
    schoolCode: "NLQT",
    certificates: [
      {
        id: 4,
        certNumber: "TEST-1",
        serialNo: "TEST-1",
        seriesCode: "",
        program: "Công nghệ thông tin",
        level: null,
        qualification: null,
        deliveryMode: null,
        rank: "GIỎI",
        yearOfGrad: 2026,
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

test("should read every field a certificate record returns", () => {
  const [row] = flattenRecords(HO_SO_VAN_BANG);
  assert.equal(row.source, "certificate");
  assert.equal(row.fullName, "NGUYỄN VIỆT CƯỜNG");
  assert.equal(row.dateOfBirth, "1977-12-30T00:00:00.000Z");
  assert.equal(row.certNumber, "000705/BC-NLQT");
  assert.equal(row.program, "CHĂM SÓC SẮC ĐẸP");
  assert.equal(row.qualification, "Trung cấp");
  assert.equal(row.deliveryMode, "Học trực tiếp");
  // Nguồn này không có hai trường dưới → phải là chuỗi rỗng, không phải "null"
  assert.equal(row.rank, "");
  assert.equal(row.yearOfGrad, "");
});

test("should read the rank and graduation year a degree record returns", () => {
  // Bằng cấp qua hệ thống học viên: có Xếp loại và Năm tốt nghiệp, không có Trình độ
  const [row] = flattenRecords(BANG_QUA_HOC_VIEN);
  assert.equal(row.source, "degree");
  assert.equal(row.fullName, "TEST");
  assert.equal(row.certNumber, "TEST-1");
  assert.equal(row.program, "Công nghệ thông tin");
  assert.equal(row.rank, "GIỎI");
  assert.equal(row.yearOfGrad, "2026", "năm phải là chuỗi để hiển thị, không phải số");
  assert.equal(row.qualification, "");
  assert.equal(row.deliveryMode, "");
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

test("should show every field the lookup can return", () => {
  // API gộp hai nguồn: thiếu dòng nào là người tra cứu mất thông tin có thật trong hồ sơ
  ["Tên", "Ngày sinh", "Số hiệu văn bằng", "Tốt nghiệp ngành", "Trình độ", "Xếp loại", "Ngày tốt nghiệp"].forEach(
    (label) => assert.ok(source.includes(`label: "${label}"`), `thiếu dòng ${label}`)
  );
});

test("should never echo back the national ID", () => {
  // API công khai KHÔNG trả idNumber (tránh phát tán số định danh) → không được có ô chờ nó,
  // và cũng không được hiển thị lại số người dùng vừa nhập như thể đó là dữ liệu đã xác minh.
  ["Số CCCD\"", "Cập nhật:"].forEach((label) =>
    assert.ok(!source.includes(`label="${label}`) && !source.includes(label), `còn hiển thị ${label}`)
  );
});

test("should merge one certificate that comes back from both sources", () => {
  // API gộp hai bảng, nên cùng một tấm bằng có thể về hai lần: một dòng ở hồ sơ văn bằng
  // (có Trình độ), một dòng nhập qua hệ thống học viên (có Xếp loại, Năm tốt nghiệp).
  // Đếm thành 2 là trang báo "có 2 văn bằng" cho người chỉ có một.
  const rows = flattenRecords([
    {
      source: "certificate",
      fullName: "NGUYỄN VIỆT CƯỜNG",
      certificates: [
        { id: 4, certNumber: "000705/BC-NLQT", program: "CHĂM SÓC SẮC ĐẸP", qualification: "TRUNG_CAP", rank: null, yearOfGrad: null },
      ],
    },
    {
      source: "degree",
      fullName: "NGUYỄN VIỆT CƯỜNG",
      certificates: [
        { id: 9, certNumber: "000705/bc _nlqt", program: "CHĂM SÓC SẮC ĐẸP", qualification: null, rank: "GIỎI", yearOfGrad: 2026 },
      ],
    },
  ]);
  assert.equal(rows.length, 1, "vẫn đếm thành nhiều bằng");
  // Gộp lại thì có đủ cả ba trường, mỗi trường lấy từ nguồn có nó
  assert.equal(rows[0].qualification, "Trung cấp");
  assert.equal(rows[0].rank, "GIỎI");
  assert.equal(rows[0].yearOfGrad, "2026");
});

test("should still list two genuinely different certificates", () => {
  const rows = flattenRecords([
    {
      source: "certificate",
      fullName: "Học viên hai bằng",
      certificates: [
        { id: 1, certNumber: "A/SCN-NLQT", program: "Sơ cấp A", qualification: "SO_CAP" },
        { id: 2, certNumber: "B/BC-NLQT", program: "Trung cấp B", qualification: "TRUNG_CAP" },
      ],
    },
  ]);
  assert.equal(rows.length, 2);
});

test("should not merge two different people who share one diploma number", () => {
  // Một số bằng cũ (001528/BC-NLQT) thuộc HAI người khác nhau trên site cũ — API trả 4 dòng
  // cho 2 người (mỗi người lặp 2 nguồn). Gộp theo mỗi số bằng là nhập hai người thành một
  // và làm MẤT một người khỏi kết quả tra cứu.
  const hai_nguoi = ["TRẦN THỤY THÙY TRANG", "LÂM THỊ HUYỀN TRANG"].flatMap((fullName, i) =>
    ["certificate", "degree"].map((source) => ({
      source,
      fullName,
      dateOfBirth: i === 0 ? "1997-04-27T00:00:00.000Z" : "1991-11-21T00:00:00.000Z",
      certificates: [
        { id: 100 + i, certNumber: "001528/BC-NLQT", program: "ĐIỀU DƯỠNG", qualification: source === "certificate" ? "TRUNG_CAP" : null },
      ],
    }))
  );
  const rows = flattenRecords(hai_nguoi);
  assert.equal(rows.length, 2, "gộp mất một người");
  assert.deepEqual(
    rows.map((row) => row.fullName).sort(),
    ["LÂM THỊ HUYỀN TRANG", "TRẦN THỤY THÙY TRANG"]
  );
  // Mỗi người vẫn được gộp đủ trường từ cả hai nguồn
  rows.forEach((row) => assert.equal(row.qualification, "Trung cấp"));
});

test("should prefer the full graduation date over the year alone", () => {
  const [ngay] = flattenRecords([
    { source: "degree", fullName: "A", certificates: [{ id: 1, certNumber: "X", graduationDate: "2026-06-15T00:00:00.000Z", yearOfGrad: 2026 }] },
  ]);
  assert.equal(ngay.graduationDate, "2026-06-15T00:00:00.000Z");
  assert.equal(ngay.yearOfGrad, "2026");
});
