import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../utils/https";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { whenIdle } from "../utils/whenIdle";
import { FEATURED_PROGRAM_SLUGS, withFeaturedFirst } from "../configs/featuredPrograms";

// Trang chủ chỉ giới thiệu, không liệt kê hết: 12 ngành = đủ 3 hàng × 4 cột (máy tính),
// 4 hàng × 3 (tablet), 6 hàng × 2 (điện thoại) → hàng nào cũng đầy, không lẻ ô.
// Xem đủ 26 ngành thì bấm "Xem tất cả ngành đào tạo".
const MAX_PROGRAMS = 12;
import { programDisplayName, programLead } from "../seo/programCopy";

function ProgramsSection() {
  // HTML tạo sẵn đã có danh sách ngành → hiện ngay, rồi gọi API ngầm lấy bản mới nhất
  const initialPrograms = useInitialData(initialDataKeys.programs);
  const [programs, setPrograms] = useState(initialPrograms ?? []);
  const [loading, setLoading] = useState(!initialPrograms);
  const [error, setError] = useState("");

  useEffect(() => {
    // Đã có dữ liệu nhúng sẵn → cập nhật ngầm: không hiện khung chờ, lỗi thì giữ bản đang hiện
    const isBackgroundRefresh = Boolean(initialPrograms);
    const fetchPrograms = async () => {
      try {
        if (!isBackgroundRefresh) {
          setLoading(true);
          setError("");
        }

        const res = await http.get("client/programs");

        const items = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];

        setPrograms(items);
      } catch (err) {
        console.error("Error fetching client programs:", err);
        if (isBackgroundRefresh) return;
        setError(
          "Không tải được danh sách ngành đào tạo. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    // Chưa có dữ liệu nhúng sẵn → gọi ngay; đã có rồi → làm mới khi trình duyệt rảnh,
    // tránh tranh băng thông với phần hiển thị đầu tiên (LCP)
    if (!isBackgroundRefresh) {
      fetchPrograms();
      return;
    }
    return whenIdle(fetchPrograms);
  }, []);

  return (
    <section id="programs" className="section-gradient py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-[22px] font-extrabold uppercase text-primary-dark mb-1">
          Chương trình đào tạo
        </h2>
        <p className="text-center text-[13px] text-slate-500 mb-5">
          Đào tạo đa ngành, đa lĩnh vực – phù hợp nhiều định hướng nghề nghiệp
          khác nhau cho học sinh sau THCS, THPT.
        </p>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-[13px]">
          {loading && (
            <>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-xl shadow px-3 py-4 flex flex-col gap-2 border border-slate-100"
                >
                  <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-3 w-full bg-slate-200 rounded"></div>
                  <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
                </div>
              ))}
            </>
          )}

          {!loading && error && (
            <div className="col-span-full text-center text-red-500 text-xs py-4">
              {error}
            </div>
          )}

          {!loading && !error && programs.length === 0 && (
            <div className="col-span-full text-center text-slate-500 text-xs py-4">
              Hiện chưa có ngành đào tạo nào.
            </div>
          )}

          {!loading &&
            !error &&
            withFeaturedFirst(programs).slice(0, MAX_PROGRAMS).map((p) => {
              const key = p.id || p.slug || p.title;
              const desc = programLead(p.slug, p);

              return (
                <Link
                  key={key}
                  to={`/nganh-dao-tao/${p.slug || p.id}`}
                  className="bg-white rounded-xl shadow-md px-3 py-3 flex flex-col gap-1.5 hover:-translate-y-1 hover:shadow-xl hover:border hover:border-primary/40 transition border border-transparent"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-slate-900 line-clamp-2">
                      {programDisplayName(p.title, p.slug)}
                    </div>
                    {/* Chỉ ngành ưu tiên mới gắn nhãn — gắn cho tất cả thì nhãn mất ý nghĩa */}
                    {FEATURED_PROGRAM_SLUGS.includes(p.slug) && (
                      <span className="text-[9px] bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full whitespace-nowrap">
                        Nổi bật
                      </span>
                    )}
                  </div>
                  {desc && (
                    <div className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                      {desc}
                    </div>
                  )}
                </Link>
              );
            })}
        </div>
        {programs.length > MAX_PROGRAMS && (
          <div className="text-center mt-4">
            <Link
              to="/nganh-dao-tao"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 bg-white text-primary-dark text-xs px-4 py-1.5
             transition-all duration-200 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 group"
            >
              <span>Xem tất cả ngành đào tạo</span>
              <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProgramsSection;
