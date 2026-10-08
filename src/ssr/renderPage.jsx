// Render sẵn phần <body> (#root) của 1 URL bằng chính app React, dùng khi tạo HTML
// cho bot (Google, ChatGPT… không phải chạy JS mới thấy nội dung). Trình duyệt
// hydrate lại từ đúng dữ liệu đã nhúng (src/data/initialData.ts).
// StaticRouter + useRoutes (đồng bộ): app không dùng loader/action của data router.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, useRoutes } from "react-router-dom";
import AppProviders, { createQueryClient } from "../AppProviders";
import { endInitialData, setInitialData } from "../data/initialData";
import { routes } from "../routes";

function AppRoutes() {
  return useRoutes(routes);
}

/** HTML bên trong <div id="root"> cho `path` với dữ liệu `initialData` */
export function renderAppHtml(path, initialData) {
  setInitialData(initialData);
  try {
    return renderToString(
      <StrictMode>
        <AppProviders queryClient={createQueryClient()} helmetContext={{}}>
          <StaticRouter location={path}>
            <AppRoutes />
          </StaticRouter>
        </AppProviders>
      </StrictMode>
    );
  } finally {
    endInitialData();
  }
}
