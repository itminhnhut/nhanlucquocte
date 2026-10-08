import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router, routerReady } from "./router";
import AppProviders, { createQueryClient } from "./AppProviders";
import { INITIAL_DATA_SCRIPT_ID, endInitialData, setInitialData } from "./data/initialData";
// CSS Swiper nằm trong stylesheet chính (chặn render như trước): trang chủ render sẵn slider,
// nếu CSS đi theo chunk JS lazy thì slider hiện sai bố cục tới khi JS tải xong.
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./index.css";
import "./assets/css/rich-text.css";

const queryClient = createQueryClient();

// Sau lần render đầu: tắt dữ liệu nhúng sẵn để các trang mở sau gọi API lấy dữ liệu mới
function EndInitialData() {
  useEffect(() => endInitialData(), []);
  return null;
}

function readInitialData() {
  const script = document.getElementById(INITIAL_DATA_SCRIPT_ID);
  if (!script?.textContent) return {};
  try {
    return JSON.parse(script.textContent);
  } catch (err) {
    console.error("[main] Dữ liệu nhúng sẵn hỏng, tải lại từ API:", err);
    return {};
  }
}

const app = (
  <React.StrictMode>
    <AppProviders queryClient={queryClient} helmetContext={undefined}>
      <RouterProvider router={router} />
      <EndInitialData />
    </AppProviders>
  </React.StrictMode>
);

const container = document.getElementById("root");
// HTML tạo sẵn (server đã render nội dung) → hydrate; spa.html / dev server → render mới
routerReady().then(() => {
  if (container.hasChildNodes()) {
    setInitialData(readInitialData());
    ReactDOM.hydrateRoot(container, app);
  } else {
    ReactDOM.createRoot(container).render(app);
  }
});
