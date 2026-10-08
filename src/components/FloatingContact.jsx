import { useEffect, useState } from "react";
import appConfig from "../configs/appConfig";

function FloatingContact() {
  const [showTop, setShowTop] = useState(false);
  const handleBackTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 200) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-5 bottom-20 flex flex-col gap-3 z-40 max-[480px]:right-3 max-[480px]:bottom-16">
      <a
        href={appConfig.zalo}
        target="_blank"
        rel="noopener"
        aria-label="Zalo"
        className="relative w-10 h-10 rounded-full pulse-ring flex items-center justify-center text-white"
      >
        <div className="relative z-10 w-full h-full rounded-full bg-[#0068ff] flex items-center justify-center">
          <span className="px-2 py-1 bg-white text-[#0068ff] rounded-full text-[10px] font-bold">
            Zalo
          </span>
        </div>
      </a>

      <a
        href={`tel:${appConfig.phoneE164}`}
        aria-label="Gọi điện"
        className="relative w-10 h-10 rounded-full pulse-ring flex items-center justify-center text-white"
      >
        <div className="relative z-10 w-full h-full rounded-full bg-red-600 flex items-center justify-center text-lg">
          ☎
        </div>
      </a>

      <button
        type="button"
        id="btn-back-top"
        aria-label="Lên đầu trang"
        onClick={handleBackTop}
        className={
          "w-10 h-10 rounded-full flex items-center justify-center bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.4)] text-lg " +
          "transition-all duration-300 ease-out " +
          (showTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none")
        }
      >
        ↑
      </button>
    </div>
  );
}

export default FloatingContact;
