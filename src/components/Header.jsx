import HeaderSearch from "./HeaderSearch";
import { useEffect, useRef, useState } from "react";
import { MAIN_NAV } from "../configs/navigation";
import { NavLink } from "react-router-dom";

function Header({ onOpenMobile }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 64) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="bg-white shadow-sm sticky top-0 left-0 right-0 z-40 transition-transform duration-300 ease-out"
      style={{
        position: "-webkit-sticky",
        WebkitTransform: isVisible
          ? "translate3d(0, 0, 0)"
          : "translate3d(0, -100%, 0)",
        transform: isVisible
          ? "translate3d(0, 0, 0)"
          : "translate3d(0, -100%, 0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-7">
        <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer">
          <NavLink to="/" end className="px-2 py-1 rounded-full flex gap-3">
            <img
              src="/images/logo-sim.png"
              alt="Logo Trường Trung cấp nghề Nhân Lực Quốc Tế"
              width="64"
              height="64"
              className="h-14 sm:h-16 w-auto object-contain rounded-xl shadow-sm"
              style={{ imageRendering: "auto" }}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-primary-dark font-extrabold text-lg">
                Nhân Lực Quốc Tế
              </span>
              <div className="flex flex-col leading-tight text-slate-600 text-[11px]">
                <span>Trường Trung cấp nghề</span>
                <span>Tân Bình, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </NavLink>
        </div>

        <nav className="hidden xl:flex flex-1 justify-start gap-2 text-[13px]">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-2 py-1 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary-dark text-white shadow-sm"
                    : "text-slate-500 hover:bg-blue-50 hover:text-primary-dark"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:flex flex-col items-end gap-1 ml-auto">
          <HeaderSearch />
        </div>

        {/* Mobile actions */}
        <div className="flex xl:hidden items-center gap-2 ml-auto">
          <button
            className="w-9 h-9 rounded-full border border-blue-200 bg-blue-50 text-primary-dark flex items-center justify-center text-base shadow-sm hover:bg-primary-dark hover:text-white hover:border-primary-dark transition"
            onClick={onOpenMobile}
            aria-label="Mở menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
