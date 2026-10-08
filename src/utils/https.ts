import axios, { AxiosInstance, AxiosResponse, AxiosAdapter } from "axios";
import { API_URL, USE_MOCK } from "@/configs/env";
import { mockRequest } from "./mockApi";
import { trackRequestEnd, trackRequestStart } from "./requestTracker";

// Chưa có backend → trả dữ liệu giả lập ngay tại tầng axios, nên mọi chỗ gọi API giữ nguyên.
// Endpoint không có trong mock (vd tra cứu văn bằng) vẫn đi ra mạng như bình thường.
const mockAdapter: AxiosAdapter = async (config) => {
  const url = config.url ?? "";
  const data = await mockRequest(url, (config.params ?? {}) as Record<string, unknown>);
  if (data === null) {
    const { default: http } = await import("axios");
    return http.defaults.adapter!(config) as never;
  }
  return { data, status: 200, statusText: "OK", headers: {}, config } as never;
};

// API_URL đọc từ window.__ENV__ (runtime Docker/EasyPanel) hoặc import.meta.env (local dev)
const https: AxiosInstance = axios.create({
  baseURL: API_URL,
  ...(USE_MOCK ? { adapter: mockAdapter } : {}),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR — đếm request đang chờ cho thanh tiến trình
https.interceptors.request.use(
  (config) => {
    trackRequestStart();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR — trả đúng response.data
https.interceptors.response.use(
  (response: AxiosResponse) => {
    trackRequestEnd();
    return response.data; // để gọi API cực gọn: const res = await https.get('/xxx')
  },
  (error) => {
    trackRequestEnd();
    return Promise.reject(error);
  }
);

export default https;
