import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToHashWhenReady } from "../utils/scrollToHash";

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Có #hash (vd "/#register") → cuộn tới phần tử đó thay vì lên đầu trang
    if (hash) return scrollToHashWhenReady(hash);

    // Mỗi lần đổi route / query (kể cả ?q=...) → đẩy lên top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    return undefined;
  }, [pathname, search, hash]);

  return null;
}

export default ScrollToTop;
