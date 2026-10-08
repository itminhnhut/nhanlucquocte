import { useEffect, useState } from "react";

// false ở lần render đầu (server + lúc hydrate), true ngay sau khi trình duyệt gắn xong.
// Dùng cho phần chỉ nên tải sau (vd ảnh slider dưới banner) để không tranh băng thông với ảnh LCP.
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);
  return isHydrated;
}
