import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_URL } from "@/configs/env";
import { trackRequestEnd, trackRequestStart } from "./requestTracker";

// API_URL đọc từ window.__ENV__ (runtime Docker/EasyPanel) hoặc import.meta.env (local dev)
const https: AxiosInstance = axios.create({
  baseURL: API_URL,
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

/**
 * Kiểu thật của client sau interceptor.
 *
 * Interceptor ở trên trả thẳng `response.data`, nên kiểu `AxiosInstance` không còn đúng: nơi
 * gọi nhận PHẦN THÂN phản hồi chứ không phải AxiosResponse. Không khai lại thì mọi chỗ đọc
 * `res.meta` bị TypeScript báo lỗi, mà bỏ qua thì checkJs không soi được file .jsx nào.
 * Hình dạng thân phản hồi theo hợp đồng API: `{ data, meta }` (API_DOCS mục 1).
 */
export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  noPaginate?: boolean;
}

export interface ApiBody {
  data?: unknown;
  meta?: ApiMeta;
  message?: string;
}

interface ApiClient {
  get<T = ApiBody>(url: string, config?: Parameters<AxiosInstance["get"]>[1]): Promise<T>;
  post<T = ApiBody>(url: string, body?: unknown, config?: Parameters<AxiosInstance["post"]>[2]): Promise<T>;
  put<T = ApiBody>(url: string, body?: unknown, config?: Parameters<AxiosInstance["put"]>[2]): Promise<T>;
  delete<T = ApiBody>(url: string, config?: Parameters<AxiosInstance["delete"]>[1]): Promise<T>;
}

// Ép kiểu một lần ở đây, có giải thích, thay vì để mỗi nơi gọi tự đoán hình dạng
export default https as unknown as ApiClient;
