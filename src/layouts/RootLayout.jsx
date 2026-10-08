import Topbar from "@/components/Topbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import MobileMenuOverlay from "@/components/MobileMenuOverlay";
import ScrollToTop from "@/components/ScrollToTop";
import TopProgressBar from "@/components/TopProgressBar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { listenContactClicks, trackPageView } from "@/utils/analytics";

// Lần tải đầu không chạy hiệu ứng hiện dần (tránh làm chậm LCP), chỉ khi đã chuyển trang.
// Dựa vào pathname (không dựa vào số lần render) → mở menu mobile không làm nội dung chớp.
function usePageEnterClass(pathname) {
  const initialPathname = useRef(pathname);
  const hasNavigated = useRef(false);
  if (pathname !== initialPathname.current) hasNavigated.current = true;
  return hasNavigated.current ? "page-enter" : "";
}

function RootLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const pageEnterClass = usePageEnterClass(pathname);

  // Đo bấm gọi / Zalo / email cho GA4
  useEffect(() => listenContactClicks(), []);
  // SPA: mỗi lần đổi trang phải tự gửi page_view, nếu không GA4 chỉ ghi trang vào đầu tiên
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return (
    <>
      <TopProgressBar />
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <Header onOpenMobile={() => setMobileOpen(true)} />
        <MobileMenuOverlay
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        {/* Nút nổi ẩn khi menu mobile mở — nếu không sẽ che nội dung panel */}
        {!mobileOpen && <ScrollToTop />}
        <div className="flex-1 gradient-page">
          <div key={pathname} className={pageEnterClass}>
            <Outlet />
          </div>
        </div>
        <Footer />
        {!mobileOpen && <FloatingContact />}
      </div>
    </>
  );
}

export default RootLayout;
