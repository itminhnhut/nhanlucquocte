import { Seo } from "../components/Seo";
import { staticPageMeta } from "../seo/pageMeta";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NewsSection from "../sections/NewsSection";
import https from "../utils/https";

function SearchPage() {
  const seoMeta = staticPageMeta("/tim-kiem");
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [programsError, setProgramsError] = useState("");

  useEffect(() => {
    if (!q) {
      setPrograms([]);
      setProgramsError("");
      setLoadingPrograms(false);
      return;
    }

    let ignore = false;
    const fetchPrograms = async () => {
      try {
        setLoadingPrograms(true);
        setProgramsError("");
        const res = await https.get("client/programs", {
          params: {
            page: 1,
            limit: 12,
            search: q,
          },
        });

        if (ignore) return;

        const list = Array.isArray(res.data) ? res.data : [];
        setPrograms(list);
      } catch (err) {
        if (ignore) return;
        console.error("Error fetching programs search:", err);
        setPrograms([]);
        setProgramsError(
          "Không tải được danh sách ngành đào tạo. Vui lòng thử lại."
        );
      } finally {
        if (!ignore) {
          setLoadingPrograms(false);
        }
      }
    };

    fetchPrograms();

    return () => {
      ignore = true;
    };
  }, [q]);

  return (
    <>
      <Seo meta={seoMeta} />

      <div className="max-w-7xl mx-auto px-4 py-8 text-[14px] text-slate-700">
        <h1 className="text-2xl font-bold text-primary-dark mb-3">
          Kết quả tìm kiếm
        </h1>
        {q ? (
          <p className="mb-4">
            Từ khóa:{" "}
            <span className="font-semibold text-primary-dark">"{q}"</span>
          </p>
        ) : (
          <p className="mb-4">
            Bạn chưa nhập từ khóa. Vui lòng dùng ô tìm kiếm ở header để tìm theo
            ngành học hoặc tin tức.
          </p>
        )}

        <div className="mt-4 border-t border-slate-200 pt-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-primary-dark mb-2">
              Gợi ý ngành học phù hợp
            </h2>
            <p className="text-[13px] text-slate-600 mb-3">
              Danh sách ngành được gợi ý dựa trên từ khóa bạn tìm kiếm.
              {q && (
                <>
                  {" "}
                  với từ khóa <span className="font-semibold">"{q}"</span>.
                </>
              )}
            </p>

            {!q && (
              <p className="text-[12px] text-slate-500 mb-2">
                Vui lòng nhập từ khóa ở ô tìm kiếm để xem các ngành đào tạo phù
                hợp.
              </p>
            )}

            {q && loadingPrograms && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            )}

            {programsError && (
              <p className="text-[12px] text-red-500 mb-2">{programsError}</p>
            )}

            {q &&
              !loadingPrograms &&
              !programsError &&
              programs.length === 0 && (
                <p className="text-[12px] text-slate-500 mb-2 italic">
                  Không tìm thấy ngành học nào phù hợp với từ khóa này.
                </p>
              )}

            {programs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.map((p) => {
                  const desc =
                    p?.description ||
                    `Chương trình đào tạo ngành <b>${p.title}</b>`;

                  return (
                    <a
                      href={`/nganh-dao-tao/${p.slug}`}
                      key={p.id}
                      className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-2 cursor-pointer"
                    >
                      <h3 className="font-bold text-[15px] text-primary-dark line-clamp-2">
                        {p.title}
                      </h3>
                      {desc && (
                        <p
                          className="text-[12px] text-slate-600 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: desc }}
                        />
                      )}
                      {p.degreeType && (
                        <span className="inline-flex mt-auto text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-primary-dark font-medium w-max">
                          {p.degreeType}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
