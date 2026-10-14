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

export default https;
