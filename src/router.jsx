import { createBrowserRouter } from "react-router-dom";
import { clientRoutes } from "./routes.client";

export const router = createBrowserRouter(clientRoutes);

// Chờ router tải xong chunk của trang đang mở trước khi render/hydrate: hydrate lúc
// chưa có trang sẽ lệch với HTML tạo sẵn.
export function routerReady() {
  if (router.state.initialized) return Promise.resolve();
  return new Promise((resolve) => {
    const unsubscribe = router.subscribe((state) => {
      if (!state.initialized) return;
      unsubscribe();
      resolve();
    });
  });
}
