import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MAIN_NAV } from "../configs/navigation";
import HeaderSearch from "./HeaderSearch";
import appConfig from "../configs/appConfig";

function MobileMenuOverlay({ open, onClose }) {
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    if (open) {
      setEnter(true);
    } else {
      setEnter(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
        enter ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`absolute z-50 top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          enter ? "translate-x-0" : "translate-x-full"
        } rounded-l-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo-sim.png"
              alt="Logo Trường Trung cấp nghề Nhân Lực Quốc Tế"
              width="40"
              height="40"
              className="h-10 w-auto object-contain rounded-lg shadow-sm"
              style={{ imageRendering: "auto" }}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-primary-dark font-extrabold text-[14px]">
                Nhân Lực Quốc Tế
              </span>
              <div className="flex flex-col leading-tight text-slate-600 text-[10px]">
                <span>Trường Trung cấp nghề</span>
                <span>Tân Bình, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 text-base hover:bg-slate-100 hover:text-slate-800 transition"
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="px-4 py-4 text-[15px] space-y-1 flex-1 flex flex-col">
          {/* Search */}
          <div className="mb-3">
            <HeaderSearch />
          </div>

          <div className="space-y-1 text-[14px]">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 transition ${
                    isActive
                      ? "bg-primary-soft text-primary-dark font-semibold shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-primary-dark"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <section>
            <div className="mt-4 border-t border-slate-100 pt-3 text-[12px] text-slate-600 space-y-1">
              {/* TODO: chỉnh lại hotline/địa chỉ đúng theo Topbar.jsx nếu cần */}
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-primary-dark text-[13px]">
                  📞
                </span>
                <a
                  className="hover:text-primary-dark"
                  href={`tel:${appConfig.phoneE164}`}
                >
                  Hotline: {appConfig.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 text-[13px]">
                  📍
                </span>
                <span>Cơ sở: {appConfig.address}</span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              <p>
                © 2026 {appConfig.legalName}. Bảo lưu mọi quyền.
              </p>
            </div>
          </section>
        </nav>
      </div>
    </div>
  );
}

export default MobileMenuOverlay;
