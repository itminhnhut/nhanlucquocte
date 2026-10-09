import { Link } from "react-router-dom";
import appConfigs from "../configs/appConfig";
import { PRIVACY_POLICY_PATH } from "../content/privacy";
import { DISCLOSURE_PATH } from "../content/disclosure";
import { OPEN_SETTINGS_EVENT } from "./CookieConsent";

// Footer liệt kê cả trang không nằm ở menu trên (Cẩm nang) — xem src/configs/navigation.ts
const QUICK_LINKS = [
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/tuyen-sinh", label: "Tuyển sinh" },
  { to: "/hoc-phi", label: "Học phí" },
  { to: "/hop-tac-doanh-nghiep", label: "Hợp tác doanh nghiệp" },
  { to: "/hoat-dong-hoc-vien", label: "Hoạt động học viên" },
  { to: "/hinh-anh", label: "Hình ảnh" },
  { to: "/lien-he", label: "Tư vấn tuyển sinh" },
  { to: "/cau-hoi-thuong-gap", label: "Câu hỏi thường gặp" },
  { to: "/cam-nang", label: "Cẩm nang tuyển sinh" },
  { to: DISCLOSURE_PATH, label: "Công khai thông tin" },
  { to: "/tra-cuu-van-bang", label: "Tra cứu văn bằng" },
];

function Footer() {
  return (
    <footer className="bg-primary-dark text-blue-100 mt-8 pt-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3 pb-6 border-b border-blue-300/40 text-[13px]">
          <div>
            <div className="font-bold uppercase text-sm mb-2">{appConfigs.legalName}</div>
            <p>
              Thành lập năm {appConfigs.foundingYear} theo {appConfigs.foundingDecision}
              <br />
              Địa chỉ:{" "}
              <a
                href={appConfigs.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-300"
              >
                {appConfigs.address}
              </a>
              <br />
              Điện thoại:{" "}
              <a href={`tel:${appConfigs.phoneE164}`} className="underline hover:text-blue-300">
                {appConfigs.phone}
              </a>
              <br />
              Email:{" "}
              <a
                href={`mailto:${appConfigs.email}`}
                className="text-white font-semibold hover:underline break-all"
              >
                {appConfigs.email}
              </a>
            </p>
          </div>
          <div>
            <div className="font-bold uppercase text-sm mb-2">Liên kết nhanh</div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 md:grid-cols-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-blue-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-bold uppercase text-sm mb-2">Nhận tư vấn miễn phí</div>
            <p className="mb-3">
              Để lại thông tin hoặc nhắn Zalo, bộ phận tuyển sinh sẽ liên hệ tư vấn ngành học, lịch
              khai giảng và học phí.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/#register"
                className="inline-flex items-center rounded-full bg-gradient-to-tr from-primary to-orange-400 px-4 py-2 text-xs font-semibold text-white"
              >
                Đăng ký tư vấn
              </Link>
              <a
                href={appConfigs.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-blue-200/60 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-4 text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 {appConfigs.legalName}. Bảo lưu mọi quyền.</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to={PRIVACY_POLICY_PATH} className="underline hover:text-blue-200">
              Chính sách bảo vệ dữ liệu cá nhân
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
              className="text-left underline hover:text-blue-200"
            >
              Cài đặt cookie
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
