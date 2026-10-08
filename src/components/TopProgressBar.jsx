import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { subscribePendingRequests } from "../utils/requestTracker";

// Thanh tiến trình mỏng trên đầu trang: chạy khi đổi trang hoặc đang có request API.
// Chạy tới ~85% rồi chờ; xong hết request → lên 100% và mờ dần.
const NAVIGATION_PULSE_MS = 300;
const FINISH_WIDTH_MS = 250;
const FADE_OUT_MS = 300;

function useIsLoading() {
  const { pathname } = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => subscribePendingRequests(setPendingCount), []);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), NAVIGATION_PULSE_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return pendingCount > 0 || isNavigating;
}

function TopProgressBar() {
  const isLoading = useIsLoading();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(10);
      // Đợi 1 frame để trình duyệt nhận width 10% trước khi transition lên 85%
      const frame = requestAnimationFrame(() => setProgress(85));
      return () => cancelAnimationFrame(frame);
    }
    setProgress(100);
    const hideTimer = setTimeout(() => setIsVisible(false), FINISH_WIDTH_MS);
    const resetTimer = setTimeout(() => setProgress(0), FINISH_WIDTH_MS + FADE_OUT_MS);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(resetTimer);
    };
  }, [isLoading]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[9999] h-[3px] pointer-events-none transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-white shadow-[0_0_10px_rgba(103,232,249,0.9)] motion-reduce:transition-none"
        style={{
          width: `${progress}%`,
          transition:
            progress === 85
              ? "width 2.5s cubic-bezier(0.1, 0.6, 0.2, 1)"
              : progress === 0
              ? "none"
              : `width ${FINISH_WIDTH_MS}ms ease-out`,
        }}
      />
    </div>
  );
}

export default TopProgressBar;
