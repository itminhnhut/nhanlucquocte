import { Link } from "react-router-dom";
import { programExtras } from "../content/programExtras";

const LINK_CLASS = "text-primary font-medium underline underline-offset-2 hover:text-primary-dark";

// Nội dung cố định theo ngành (src/content/programExtras.ts): render giống nhau ở server và
// trình duyệt vì chỉ phụ thuộc slug
function ProgramExtras({ slug }) {
  const extras = programExtras(slug);
  if (!extras) return null;

  return (
    <section aria-labelledby="program-fit" className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 id="program-fit" className="text-[18px] md:text-[20px] font-bold text-primary-dark mb-3">
        Ngành {extras.name} có phù hợp với bạn?
      </h2>
      <dl className="grid gap-x-4 gap-y-0.5 sm:gap-y-3 text-[14px] sm:grid-cols-[150px_1fr] [&>dd]:mb-2.5 sm:[&>dd]:mb-0">
        {extras.interest && (
          <>
            <dt className="font-semibold text-slate-500">Phù hợp nếu bạn</dt>
            <dd className="text-slate-800">
              {extras.interest.toLowerCase()} (lĩnh vực {extras.fieldName}).
            </dd>
          </>
        )}
        <dt className="font-semibold text-slate-500">Đầu vào</dt>
        <dd className="text-slate-800">{extras.entry}</dd>
        {extras.schedule && (
          <>
            <dt className="font-semibold text-slate-500">Lịch học</dt>
            <dd className="text-slate-800">{extras.schedule}</dd>
          </>
        )}
        {/* Chỉ nêu văn bằng khi trường đã công bố rõ hệ đào tạo của ngành */}
        {extras.credential && (
          <>
            <dt className="font-semibold text-slate-500">Văn bằng</dt>
            <dd className="text-slate-800">{extras.credential}</dd>
          </>
        )}
        <dt className="font-semibold text-slate-500">Học phí</dt>
        <dd className="text-slate-800">
          Khác nhau theo ngành và hệ đào tạo.{" "}
          <Link to="/tuyen-sinh" className={LINK_CLASS}>
            Xem thông tin tuyển sinh
          </Link>
          .
        </dd>
      </dl>

      {extras.sameField.length > 0 && (
        <div className="mt-5">
          <h3 className="text-[15px] font-bold text-slate-800 mb-2">Ngành cùng lĩnh vực {extras.fieldName}</h3>
          <ul className="flex flex-wrap gap-2">
            {extras.sameField.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="inline-flex rounded-full border border-primary/20 bg-white px-3 py-1 text-[13px] text-primary-dark hover:bg-primary/5"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {extras.guides.length > 0 && (
        <div className="mt-5">
          <h3 className="text-[15px] font-bold text-slate-800 mb-2">Đọc thêm trước khi chọn ngành</h3>
          <ul className="list-disc pl-5 space-y-1 text-[14px]">
            {extras.guides.map((guide) => (
              <li key={guide.path}>
                <Link to={guide.path} className={LINK_CLASS}>
                  {guide.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default ProgramExtras;
