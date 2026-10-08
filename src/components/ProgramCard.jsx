import { Link } from "react-router-dom";
import { FEATURED_PROGRAM_SLUGS } from "../configs/featuredPrograms";
import { programDisplayName, programLead, upcomingOpeningDate } from "../seo/programCopy";
import { programHighlights } from "../content/programExtras";

// Thẻ 1 ngành trên trang /programs: tên, mô tả có từ khoá, nhãn nhanh (khai giảng, văn bằng,
// đầu vào, lịch học: chỉ thông tin đã xác nhận) để so sánh ngay trên danh sách.
// `now`: thời điểm render (HTML tạo sẵn) → nhãn khai giảng khớp khi hydrate.
function ProgramCard({ program, now }) {
  const name = program.title ? programDisplayName(program.title, program.slug) : program.name || "Ngành đào tạo";
  const desc = programLead(program.slug, program);
  const isFeatured = FEATURED_PROGRAM_SLUGS.includes(program.slug);
  const openingDate = upcomingOpeningDate(program, now);
  const highlights = programHighlights(program.slug);

  return (
    <Link
      to={`/nganh-dao-tao/${program.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-bold leading-snug text-slate-900 group-hover:text-primary-dark">{name}</h3>
        {isFeatured && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
            Nổi bật
          </span>
        )}
      </div>

      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 line-clamp-3">{desc}</p>

      {(openingDate || highlights.length > 0) && (
        <ul className="mt-3 flex flex-wrap gap-1.5 text-[12px]">
          {openingDate && (
            <li className="rounded-full bg-orange-50 px-2.5 py-0.5 font-semibold text-orange-700">
              Khai giảng {openingDate}
            </li>
          )}
          {highlights.map((label) => (
            <li key={label} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700">
              {label}
            </li>
          ))}
        </ul>
      )}

      <span className="mt-auto pt-3 text-[13px] font-semibold text-primary transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none">
        Xem chi tiết ngành →
      </span>
    </Link>
  );
}

export default ProgramCard;
