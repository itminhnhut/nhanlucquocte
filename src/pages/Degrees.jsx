import { Seo } from "../components/Seo";
import { staticPageMeta } from "../seo/pageMeta";
import { useState } from "react";
import https from "../utils/https";
import DegreesGuide from "../components/DegreesGuide";

function DegreesSection() {
  const [cccdInput, setCccdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [degrees, setDegrees] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
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
    const code = cccdInput.trim();

    if (!code) {
      setError("Vui lòng nhập số CCCD để tra cứu.");
      setDegrees([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    setError("");
    setLoading(true);

    try {
      const res = await https.get(`client/degrees/${encodeURIComponent(code)}`);

      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      if (!list.length) {
        setDegrees([]);
        setError(
          "Không tìm thấy thông tin văn bằng cho số CCCD này. Vui lòng kiểm tra lại hoặc liên hệ nhà trường."
        );
      } else {
        setDegrees(list);
      }
    } catch (err) {
      console.error("Fetch degree error:", err);
      if (err?.response?.status === 404) {
        setError(
          "Không tìm thấy thông tin văn bằng cho số CCCD này. Vui lòng kiểm tra lại hoặc liên hệ nhà trường."
        );
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
      setDegrees([]);
    } finally {
      setLoading(false);
    }
  };

  const hasData = degrees.length > 0;
  const primaryDegree = hasData ? degrees[degrees.length - 1] : null;

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
                  <div className="relative">
                    <input
                      id="cccdSearch"
                      type="text"
                      placeholder="Nhập số CCCD để tra cứu"
                      className="w-full text-[13px] pl-3 pr-10 py-2 rounded-full border border-slate-300 bg-white shadow-sm focus:border-primary-dark focus:ring-2 focus:ring-primary-dark/30 outline-none transition"
                      value={cccdInput}
                      onChange={(e) => setCccdInput(e.target.value)}
                    />
                    {cccdInput && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                        onClick={() => {
                          setCccdInput("");
                          setDegrees([]);
                          setError("");
                          setHasSearched(false);
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
              {error && (
                <p className="text-[12px] text-red-500 mb-3 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              {!hasData && !error && hasSearched && !loading && (
                <p className="text-[12px] text-slate-500 mb-3 italic">
                  Không có dữ liệu văn bằng cho số CCCD này.
                </p>
              )}

              {/* Thanh kẻ giống file mô tả */}
              <div className="h-[3px] bg-primary/70 mb-4 rounded-full" />

              {/* Summary for primary degree */}
              <div className="space-y-1.5 mb-4">
                <RowLine
                  label="Tên"
                  value={primaryDegree?.fullName || ""}
                  placeholder="Tên học viên sẽ hiển thị sau khi tra cứu"
                  highlight
                />

                <RowLine
                  label="Số CCCD"
                  value={primaryDegree?.cccd || (hasSearched ? cccdInput : "")}
                  placeholder="Số CCCD sẽ hiển thị sau khi tra cứu"
                />

                <RowLine
                  label="Ngày sinh"
                  value={
                    primaryDegree?.dob ? formatDate(primaryDegree.dob) : ""
                  }
                  placeholder="Ngày sinh sẽ hiển thị sau khi tra cứu"
                  gray
                />

                <RowLine
                  label="Số hiệu văn bằng"
                  value={primaryDegree?.degreeCode || ""}
                  placeholder="Số hiệu văn bằng sẽ hiển thị sau khi tra cứu"
                />

                <RowLine
                  label="Tốt nghiệp ngành"
                  value={primaryDegree?.major || ""}
                  placeholder="Tên ngành / chương trình sẽ hiển thị sau khi tra cứu"
                />
              </div>

              {/* Nếu có nhiều hơn 1 bản ghi, hiển thị danh sách chi tiết */}
              {hasData && degrees.length > 1 && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-[12px] text-slate-500 mb-2">
                    Có <span className="font-semibold">{degrees.length}</span>{" "}
                    lần ghi nhận văn bằng cho số CCCD này. Dưới đây là lịch sử
                    chi tiết:
                  </p>
                  <div className="space-y-3">
                    {degrees.map((deg, idx) => (
                      <div
                        key={deg.id || idx}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3 text-[12px]"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-primary-dark">
                            Lần {idx + 1} -{" "}
                            {deg.degreeCode || "Không rõ mã bằng"}
                          </span>
                          {deg.createdAt && (
                            <span className="text-[11px] text-slate-500">
                              Cập nhật: {formatDate(deg.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                          <InfoItem label="Ngành" value={deg.major} />
                          <InfoItem label="Xếp loại" value={deg.rank} />
                          <InfoItem
                            label="Năm tốt nghiệp"
                            value={deg.yearOfGrad}
                          />
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

function RowLine({ label, value, placeholder, gray, highlight }) {
  const showPlaceholder = !value;
  return (
    <div className="grid grid-cols-[135px_minmax(0,1fr)] gap-x-4 items-stretch text-[13px]">
      <div className="flex items-center justify-between text-slate-700 font-semibold">
        <span>{label}</span>
        <span>:</span>
      </div>
      <div
        className={[
          "w-full rounded border text-[13px] px-3 py-2",
          gray ? "bg-slate-100 border-slate-200" : "bg-white border-slate-200",
          highlight && "ring-1 ring-primary/30",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {showPlaceholder ? (
          <span className="text-slate-600">{placeholder}</span>
        ) : (
          <span className="text-slate-800">{value}</span>
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
