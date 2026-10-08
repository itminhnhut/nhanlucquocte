import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import ContactCard from "../components/ContactCard";
import { staticPageMeta } from "../seo/pageMeta";
import { DISCLOSURE_PATH, SCHOOL_IDENTITY } from "../content/disclosure";
import { LEVEL_LABEL, PROGRAM_FIELDS, programsByLevel } from "../content/programFields";
import { PRIVACY_POLICY_PATH } from "../content/privacy";
import { ADMISSIONS_PATH } from "../content/admissions";
import appConfig from "../configs/appConfig";

const SECTION_TITLE = "text-[19px] md:text-[21px] font-bold text-primary-dark mb-3";
const LINK = "text-primary font-medium underline underline-offset-2";
// Bài ngành chưa import vào database → liệt kê tên ngành kèm trình độ, chưa link sang trang ngành
// Chỉ ghi hệ đào tạo khi trường đã công bố rõ; ngành chưa rõ thì để trống, không tự suy ra
const programLabel = (program) =>
  program.levelConfirmed ? `${program.name} (${LEVEL_LABEL[program.level].toLowerCase()})` : program.name;

function DisclosurePage() {
  return (
    <>
      <Seo meta={staticPageMeta(DISCLOSURE_PATH)} />
      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 text-[14px] text-slate-700 leading-relaxed space-y-8">
        <header>
          <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
            <Link to="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700">Công khai thông tin</span>
          </nav>
          <h1 className="text-[24px] md:text-[28px] font-extrabold text-primary-dark leading-snug">
            Công khai thông tin Trường Trung cấp nghề Nhân Lực Quốc Tế
          </h1>
          <p className="mt-2">
            Công khai thông tin về pháp lý, ngành nghề đào tạo, văn bằng và tuyển sinh của{" "}
            {appConfig.legalName}, để người học và phụ huynh tra cứu, đối chiếu.
          </p>
        </header>

        <section aria-labelledby="cong-khai-phap-ly">
          <h2 id="cong-khai-phap-ly" className={SECTION_TITLE}>
            Thông tin pháp lý
          </h2>
          <dl className="grid gap-x-6 gap-y-3 rounded-2xl bg-white border border-slate-100 shadow-sm p-5 sm:grid-cols-[180px_1fr]">
            {SCHOOL_IDENTITY.map((item) => (
              <div key={item.label} className="contents">
                <dt className="font-semibold text-slate-500">{item.label}</dt>
                <dd className="text-slate-800">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="cong-khai-nganh">
          <h2 id="cong-khai-nganh" className={SECTION_TITLE}>
            Ngành nghề đào tạo
          </h2>
          <p className="mb-3">
            Các ngành, nghề nhà trường đang tuyển sinh. Ngành chưa ghi hệ đào tạo là ngành trường chưa
            công bố rõ trên thông báo tuyển sinh — vui lòng gọi hotline để được xác nhận.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {PROGRAM_FIELDS.map((field) => (
              <div key={field.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-1.5">{field.name}</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {field.programs.map((program) => (
                    <li key={program.slug}>{programLabel(program)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-3">
            Tổng cộng {programsByLevel("trung-cap").length} ngành hệ trung cấp (cấp bằng trung cấp),{" "}
            {programsByLevel("so-cap").length} khóa sơ cấp, ngắn hạn (cấp chứng chỉ) và{" "}
            {programsByLevel("lien-thong").length} chương trình liên thông đại học.
          </p>
        </section>

        <section aria-labelledby="cong-khai-van-bang">
          <h2 id="cong-khai-van-bang" className={SECTION_TITLE}>
            Văn bằng, chứng chỉ
          </h2>
          <p>
            Học viên hoàn thành chương trình trung cấp được cấp bằng tốt nghiệp trung cấp theo Luật Giáo dục
            nghề nghiệp; khóa ngắn hạn được cấp chứng chỉ. Văn bằng, chứng chỉ do trường cấp tra cứu được tại
            trang{" "}
            <Link to="/tra-cuu-van-bang" className={LINK}>
              tra cứu văn bằng
            </Link>{" "}
            bằng số CCCD đã đăng ký khi nhập học.
          </p>
        </section>

        <section aria-labelledby="cong-khai-tuyen-sinh">
          <h2 id="cong-khai-tuyen-sinh" className={SECTION_TITLE}>
            Tuyển sinh
          </h2>
          <p className="mb-2">
            Thông tin tuyển sinh đầy đủ (ngành, lịch khai giảng, hồ sơ, quy trình) tại trang{" "}
            <Link to={ADMISSIONS_PATH} className={LINK}>
              tuyển sinh
            </Link>
            .
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Đối tượng: người tốt nghiệp THCS, THPT; người đã có bằng trung cấp (chương trình liên thông). Trường xét tuyển, không thi tuyển.</li>
            <li>Trường khai giảng nhiều đợt trong năm, nhận hồ sơ quanh năm; lịch khai giảng đợt gần nhất được thông báo khi tư vấn.</li>
            <li>
              Học phí khác nhau theo từng ngành và hệ đào tạo; bảng học phí được nhà trường gửi khi
              người học liên hệ tư vấn.
            </li>
            <li>
              Hồ sơ và cách đăng ký: xem{" "}
              <Link to="/cau-hoi-thuong-gap" className={LINK}>
                câu hỏi thường gặp
              </Link>{" "}
              hoặc{" "}
              <Link to="/#register" className={LINK}>
                đăng ký tư vấn
              </Link>
              .
            </li>
          </ul>
        </section>

        <section aria-labelledby="cong-khai-phan-anh">
          <h2 id="cong-khai-phan-anh" className={SECTION_TITLE}>
            Tiếp nhận phản ánh, yêu cầu về dữ liệu cá nhân
          </h2>
          <p>
            Phản ánh, kiến nghị và yêu cầu về dữ liệu cá nhân gửi về email{" "}
            <a href={`mailto:${appConfig.email}`} className={LINK}>
              {appConfig.email}
            </a>{" "}
            hoặc hotline {appConfig.phone} ({appConfig.openingHoursLabel}). Xem{" "}
            <Link to={PRIVACY_POLICY_PATH} className={LINK}>
              Chính sách bảo vệ dữ liệu cá nhân
            </Link>
            .
          </p>
        </section>

        <ContactCard />
      </main>
    </>
  );
}

export default DisclosurePage;
