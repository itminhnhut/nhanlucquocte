import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import ContentSections from "../components/ContentSections";
import { staticPageMeta } from "../seo/pageMeta";
import { PRIVACY_POLICY_PATH, PRIVACY_SECTIONS } from "../content/privacy";
import appConfig from "../configs/appConfig";

function PrivacyPage() {
  return (
    <>
      <Seo meta={staticPageMeta(PRIVACY_POLICY_PATH)} />
      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 text-[15px] text-slate-700 leading-relaxed">
        <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">Chính sách bảo vệ dữ liệu cá nhân</span>
        </nav>
        <h1 className="text-[24px] md:text-[30px] font-extrabold text-slate-900 leading-tight">
          Chính sách bảo vệ dữ liệu cá nhân
        </h1>
        <p className="mt-3">
          Chính sách bảo vệ dữ liệu cá nhân này cho biết {appConfig.legalName} thu những dữ liệu gì qua
          website trungcapnhanlucquocte.vn, dùng để làm gì, lưu bao lâu, chia sẻ với ai, và cách bạn thực hiện
          các quyền của mình theo Luật Bảo vệ dữ liệu cá nhân.
        </p>
        <ContentSections sections={PRIVACY_SECTIONS} />
      </main>
    </>
  );
}

export default PrivacyPage;
