import { Link } from "react-router-dom";
import { PROGRAM_FIELDS } from "../content/programFields";

// Lĩnh vực đào tạo ở trang chủ: nhóm ngành lấy từ danh mục chung (src/content/programFields.ts),
// mỗi nhóm link tới đúng mục lĩnh vực ở trang Chương trình đào tạo.
function TrainingFieldsSection() {
  return (
    <section id="nganh" className="section-gradient py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-[22px] font-extrabold uppercase text-primary-dark mb-1">
          Lĩnh vực đào tạo
        </h2>
        <p className="mx-auto mb-6 max-w-3xl text-center text-[13px] text-slate-600">
          Trường tuyển sinh hệ trung cấp và các khóa sơ cấp, ngắn hạn theo chỉ tiêu nhà nước, chú trọng
          thực hành và gắn với nhu cầu tuyển dụng trong nước lẫn thị trường lao động ngoài nước.
        </p>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAM_FIELDS.map((field) => (
            <li
              key={field.id}
              className="reveal flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[18px]">
                {field.icon}
              </span>
              <div className="min-w-0">
                <h3 className="text-[14px] font-semibold text-primary-dark">
                  <Link to={`/nganh-dao-tao#${field.anchor}`} className="hover:underline">
                    {field.name}
                  </Link>
                </h3>
                <p className="mt-0.5 text-[12px] leading-relaxed text-slate-600">
                  {field.programs.map((program) => program.name).join(", ")}.
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-center text-[13px] text-slate-600">
          Cần biết ngành nào đang tuyển sinh, học bao lâu và học phí bao nhiêu?{" "}
          <Link to="/tuyen-sinh" className="font-medium text-primary underline underline-offset-2">
            Xem thông tin tuyển sinh
          </Link>{" "}
          hoặc{" "}
          <Link to="/lien-he" className="font-medium text-primary underline underline-offset-2">
            liên hệ nhà trường
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export default TrainingFieldsSection;
