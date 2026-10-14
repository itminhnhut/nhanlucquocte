import { Seo } from "../components/Seo";
import { staticPageMeta } from "../seo/pageMeta";
import { useRef, useState } from "react";
import https from "../utils/https";
import DegreesGuide from "../components/DegreesGuide";

// Tra cứu theo CCCD qua GET client/certificates/{idNumber}. Đây là bảng đang chứa dữ liệu văn
// bằng của trường (bản ghi hợp nhất từ dữ liệu văn bằng cũ); bảng `degrees` của API rỗng nên
// không dùng. API nhận đúng 9–13 chữ số và KHÔNG trả lại số CCCD, xếp loại hay năm tốt nghiệp.
export const CCCD_PATTERN = /^\d{9,13}$/;

const NOT_FOUND =
  "Không tìm thấy thông tin văn bằng cho số CCCD này. Vui lòng kiểm tra lại hoặc liên hệ nhà trường.";

const QUALIFICATION_LABEL = {
  SO_CAP: "Sơ cấp",
  TRUNG_CAP: "Trung cấp",
  CAO_DANG: "Cao đẳng",
  DAI_HOC: "Đại học",
  GDPT: "Giáo dục phổ thông",
  KHAC: "Khác",
};

const DELIVERY_LABEL = {
  OFFLINE: "Học trực tiếp",
  ONLINE: "Học trực tuyến",
};

// Khai ở một chỗ để lúc chờ và lúc có kết quả dựng đúng số dòng, cùng chiều cao → không giật.
// Ô trống để dấu "—" (1 dòng) thay vì câu dài 2 dòng trên điện thoại, vì câu dài co lại khi có
// dữ liệu là nhảy bố cục.
const SUMMARY_ROWS = [
  { label: "Tên", read: (row) => row?.fullName, highlight: true },
  { label: "Ngày sinh", read: (row, formatDate) => (row?.dateOfBirth ? formatDate(row.dateOfBirth) : ""), gray: true },
  { label: "Số hiệu văn bằng", read: (row) => row?.certNumber },
  { label: "Tốt nghiệp ngành", read: (row) => row?.program },
  // Ba dòng dưới tuỳ nguồn: hồ sơ văn bằng cũ có Trình độ, bằng cấp qua hệ thống học viên
  // có Xếp loại và Năm tốt nghiệp. Luôn dựng đủ dòng để khung không đổi chiều cao; nguồn nào
  // không có trường đó thì ô là dấu "—".
  { label: "Trình độ", read: (row) => row?.qualification, gray: true },
  { label: "Xếp loại", read: (row) => row?.rank },
  { label: "Năm tốt nghiệp", read: (row) => row?.yearOfGrad, gray: true },
];

/**
 * Một người có thể có nhiều văn bằng → dàn phẳng thành từng dòng để hiển thị.
 *
 * API gộp hai nguồn, mỗi nguồn chỉ có một nửa số trường (xem `source`):
 *   "certificate" → qualification, level, deliveryMode;  rank, yearOfGrad = null
 *   "degree"      → rank, yearOfGrad;                    qualification, level = null
 * Nên map hết rồi để chỗ hiển thị tự bỏ qua trường rỗng.
 */
/** Chuẩn hoá số bằng theo đúng quy tắc API dùng để tra (docs mục 5): bỏ khoảng trắng,
 *  không phân biệt hoa thường, `_` và gạch dài đều coi như gạch ngang. */
const chuanHoaSoBang = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[_–—]/g, "-");

export const flattenRecords = (records) => {
  const theoSoBang = new Map();
  records.forEach((record) =>
    (record.certificates ?? []).forEach((certificate) => {
      const row = {
        id: certificate.id,
        source: record.source ?? "",
        fullName: record.fullName,
        dateOfBirth: record.dateOfBirth,
        certNumber: certificate.certNumber,
        program: certificate.program,
        qualification: QUALIFICATION_LABEL[certificate.qualification] ?? "",
        deliveryMode: DELIVERY_LABEL[certificate.deliveryMode] ?? "",
        rank: certificate.rank ?? "",
        yearOfGrad: certificate.yearOfGrad ? String(certificate.yearOfGrad) : "",
      };
      // Cùng một tấm bằng có thể về từ CẢ HAI nguồn (một dòng ở hồ sơ văn bằng, một dòng
      // nhập qua hệ thống học viên). Gộp theo số bằng và lấy trường nào có giá trị, nếu
      // không trang sẽ báo "có 2 văn bằng" cho người chỉ có một.
      const key = chuanHoaSoBang(certificate.certNumber) || `id-${certificate.id}`;
      const da_co = theoSoBang.get(key);
      if (!da_co) {
        theoSoBang.set(key, row);
        return;
      }
      Object.entries(row).forEach(([field, value]) => {
        if (!da_co[field] && value) da_co[field] = value;
      });
    })
  );
  return [...theoSoBang.values()];
};

function DegreesSection() {
  const [cccdInput, setCccdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [degrees, setDegrees] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const seoMeta = staticPageMeta("/tra-cuu-van-bang");

  const formatDate = (iso) => {
    if (!iso) return "";
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return iso;
    const d = dt.getDate().toString().padStart(2, "0");
    const m = (dt.getMonth() + 1).toString().padStart(2, "0");
    const y = dt.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (loading) return; // nhấn Enter liên tục trên điện thoại sẽ gọi API nhiều lần
    const code = cccdInput.trim();

    if (!code) {
      setError("Vui lòng nhập số CCCD để tra cứu.");
      setDegrees([]);
      setHasSearched(false);
      return;
    }

    // Chặn tại trang để người dùng thấy lý do, thay vì nhận lỗi 400 của API
    if (!CCCD_PATTERN.test(code)) {
      // Ô nhập đã lọc sẵn chữ và dấu, nên chỉ còn khả năng sai độ dài
      setError("Số CCCD phải có từ 9 đến 13 chữ số (CCCD thường là 12 số, CMND cũ 9 số).");
      setDegrees([]);
      setHasSearched(false);
      return;
    }

    inputRef.current?.blur(); // nhập đúng rồi mới đóng bàn phím, sai thì để người dùng sửa ngay
    setHasSearched(true);
    setError("");
    setLoading(true);

    try {
      const res = await https.get(`client/certificates/${encodeURIComponent(code)}`);
      const records = Array.isArray(res?.data) ? res.data : [];
      const list = flattenRecords(records);

      if (!list.length) {
        setDegrees([]);
        setError(NOT_FOUND);
      } else {
        setDegrees(list);
      }
    } catch (err) {
      console.error("Fetch certificate error:", err);
      const status = err?.response?.status;
      setError(status === 404 || status === 400 ? NOT_FOUND : "Có lỗi xảy ra, vui lòng thử lại sau.");
      setDegrees([]);
    } finally {
      setLoading(false);
    }
  };

  const hasData = degrees.length > 0;
  const primaryDegree = hasData ? degrees[0] : null;

  return (
    <>
      <Seo meta={seoMeta} />

      <section className="py-10 sm:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-[22px] sm:text-[24px] font-extrabold uppercase text-primary-dark">
              Tra cứu văn bằng, chứng chỉ Trường Trung cấp nghề Nhân Lực Quốc Tế
            </h1>
            <p className="text-[13px] text-slate-500 mt-2 max-w-2xl mx-auto">
              Học viên sử dụng{" "}
              <span className="font-semibold">
                số CCCD đã đăng ký khi nhập học
              </span>{" "}
              để tra cứu. Hệ thống hiển thị{" "}
              <span className="font-semibold">văn bằng, chứng chỉ do nhà trường đã cấp</span>.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 border-b border-slate-100">
              <div>
                <h2 className="text-[15px] font-semibold text-primary-dark">
                  Tra cứu theo CCCD
                </h2>
                <p className="text-[12px] text-slate-600">
                  Nhập chính xác số CCCD đã đăng ký khi nhập học.
                </p>
              </div>

              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto"
              >
                <div className="flex-1 min-w-[220px]">
                  <label htmlFor="cccdSearch" className="sr-only">
                    Số CCCD
                  </label>
                  {/* Ô nhập lọc sẵn chỉ còn chữ số: gõ nhầm dấu cách hay dấu chấm trên điện thoại
                      cũng không bật thông báo lỗi, nên khung thông báo không nhấp nháy */}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      id="cccdSearch"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      enterKeyHint="search"
                      maxLength={13}
                      placeholder="Nhập số CCCD để tra cứu"
                      className="w-full text-[13px] pl-3 pr-10 py-2 rounded-full border border-slate-300 bg-white shadow-sm focus:border-primary-dark focus:ring-2 focus:ring-primary-dark/30 outline-none transition"
                      value={cccdInput}
                      onChange={(e) => setCccdInput(e.target.value.replace(/\D/g, ""))}
                    />
                    {cccdInput && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                        aria-label="Xoá số đã nhập"
                        onClick={() => {
                          setCccdInput("");
                          setDegrees([]);
                          setError("");
                          setHasSearched(false);
                          inputRef.current?.focus();
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-primary-dark text-white text-[13px] font-semibold px-5 py-2 shadow hover:shadow-md hover:bg-primary-dark/90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang tra cứu..." : "Xem văn bằng"}
                </button>
              </form>
            </div>

            {/* Body */}
            <div className="px-5 sm:px-6 py-5">
              {/* Chừa sẵn chiều cao cho thông báo: hiện/ẩn không đẩy phần dưới xuống */}
              <div className="min-h-[44px] mb-1" role="status" aria-live="polite">
                {error && (
                  <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}
                {!error && hasSearched && !loading && !hasData && (
                  <p className="text-[12px] text-slate-500 italic px-3 py-2">
                    Không có dữ liệu văn bằng cho số CCCD này.
                  </p>
                )}
                {loading && (
                  <p className="text-[12px] text-slate-500 italic px-3 py-2">Đang tra cứu văn bằng…</p>
                )}
              </div>

              {/* Thanh kẻ giống file mô tả */}
              <div className="h-[3px] bg-primary/70 mb-4 rounded-full" />

              {/* Khung kết quả: luôn đúng 5 dòng, lúc chờ chỉ phần giá trị đổi thành vạch mờ
                  nên chiều cao không đổi — không giật khi dữ liệu về */}
              <div className="space-y-1.5 mb-4">
                {SUMMARY_ROWS.map((row) => (
                  <RowLine
                    key={row.label}
                    label={row.label}
                    value={loading ? "" : row.read(primaryDegree, formatDate) || ""}
                    loading={loading}
                    gray={row.gray}
                    highlight={row.highlight}
                  />
                ))}
              </div>

              {/* Nếu có nhiều hơn 1 bản ghi, hiển thị danh sách chi tiết */}
              {hasData && degrees.length > 1 && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-[12px] text-slate-500 mb-2">
                    Có <span className="font-semibold">{degrees.length}</span>{" "}
                    văn bằng, chứng chỉ gắn với số CCCD này. Dưới đây là chi tiết:
                  </p>
                  <div className="space-y-3">
                    {degrees.map((deg, idx) => (
                      <div
                        key={deg.id || idx}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3 text-[12px]"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-primary-dark">
                            {deg.certNumber || "Không rõ số hiệu văn bằng"}
                          </span>
                          {deg.qualification && (
                            <span className="text-[11px] text-slate-500">
                              {deg.qualification}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                          <InfoItem label="Ngành" value={deg.program} />
                          <InfoItem label="Xếp loại" value={deg.rank} />
                          <InfoItem label="Năm tốt nghiệp" value={deg.yearOfGrad} />
                          <InfoItem label="Hình thức học" value={deg.deliveryMode} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note dưới cùng (nhỏ, nhẹ) */}
              <p className="mt-4 text-[11px] text-slate-500">
                Học viên tra cứu văn bằng bằng{" "}
                <span className="font-semibold">số CCCD</span>. Nếu đã nhập đúng
                số CCCD nhưng không có kết quả, vui lòng liên hệ phòng đào tạo /
                tuyển sinh để được hỗ trợ.
              </p>
            </div>
          </div>

          <DegreesGuide />
        </div>
      </section>
    </>
  );
}

function RowLine({ label, value, loading, gray, highlight }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[135px_minmax(0,1fr)] gap-x-3 sm:gap-x-4 items-stretch text-[13px]">
      <div className="flex items-center justify-between text-slate-700 font-semibold">
        <span>{label}</span>
        <span>:</span>
      </div>
      <div
        className={[
          // min-h giữ đúng chiều cao 1 dòng cho cả 3 trạng thái: chờ, trống, có dữ liệu
          "flex min-h-[38px] w-full items-center rounded border text-[13px] px-3 py-2",
          gray ? "bg-slate-100 border-slate-200" : "bg-white border-slate-200",
          highlight && "ring-1 ring-primary/30",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {loading ? (
          <span aria-hidden="true" className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
        ) : (
          <span className="text-slate-800">{value || <span className="text-slate-400">—</span>}</span>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex text-slate-600">
      <span className="font-semibold mr-1.5">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

export default DegreesSection;
