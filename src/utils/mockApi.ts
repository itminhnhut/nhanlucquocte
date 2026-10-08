// Nguồn dữ liệu giả lập thay cho API, dùng khi backend của trường chưa sẵn sàng.
// Dữ liệu lấy từ chính website của trường (public/mock/*.json) và có ĐÚNG hình dạng API thật:
//   client/programs        → { data: [...] }
//   client/programs/:slug  → { data: {...} }
//   client/posts           → { data: [...], meta: { page, limit, total, totalPages, noPaginate } }
//   client/posts/:slug     → { data: {...} }
// Khi có API thật: đặt VITE_USE_MOCK=0 (hoặc VITE_API_URL trỏ API thật + VITE_USE_MOCK=0) là xong,
// không phải sửa chỗ gọi API nào.
import { USE_MOCK } from "@/configs/env";

export interface MockProgram {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  description: string;
  content: string;
  active: boolean;
}

export interface MockPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string | null;
  category: string;
  content: string;
  createdAt: string;
  isHot: boolean;
  programs: { id: number; title: string; slug: string }[];
}

const MOCK_DIR = "/mock";
let cache: { programs?: MockProgram[]; posts?: MockPost[] } = {};

async function load<T>(name: "programs" | "posts"): Promise<T[]> {
  if (!cache[name]) {
    const res = await fetch(`${MOCK_DIR}/${name}.json`);
    if (!res.ok) throw new Error(`Không đọc được dữ liệu giả lập ${name}`);
    cache = { ...cache, [name]: await res.json() };
  }
  return (cache[name] ?? []) as unknown as T[];
}

function paginate<T>(items: T[], page: number, limit: number, noPaginate: boolean) {
  if (noPaginate) {
    return { data: items, meta: { page: 1, limit: items.length, total: items.length, totalPages: 1, noPaginate: true } };
  }
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total: items.length, totalPages: Math.max(1, Math.ceil(items.length / limit)), noPaginate: false },
  };
}

const num = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** Trả dữ liệu cho 1 endpoint; null = endpoint không có trong mock (vd tra cứu văn bằng) */
export async function mockRequest(url: string, params: Record<string, unknown> = {}): Promise<unknown | null> {
  const path = url.replace(/^\/+/, "").split("?")[0];

  if (path === "client/programs") {
    const programs = (await load<MockProgram>("programs")).filter((item) => item.active !== false);
    const search = String(params.search ?? params.q ?? "").trim().toLowerCase();
    const filtered = search
      ? programs.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(search))
      : programs;
    return { data: filtered };
  }

  if (path.startsWith("client/programs/")) {
    const slug = decodeURIComponent(path.slice("client/programs/".length));
    const program = (await load<MockProgram>("programs")).find((item) => item.slug === slug);
    if (!program) throw Object.assign(new Error("Không tìm thấy ngành"), { response: { status: 404 } });
    return { data: program };
  }

  if (path === "client/posts") {
    const posts = await load<MockPost>("posts");
    const category = String(params.category ?? "").trim().toLowerCase();
    const filtered = category ? posts.filter((item) => item.category.toLowerCase() === category) : posts;
    return paginate(filtered, num(params.page, 1), num(params.limit, 10), params.noPaginate === true);
  }

  if (path.startsWith("client/posts/")) {
    const slug = decodeURIComponent(path.slice("client/posts/".length));
    const post = (await load<MockPost>("posts")).find((item) => item.slug === slug);
    if (!post) throw Object.assign(new Error("Không tìm thấy bài viết"), { response: { status: 404 } });
    return { data: post };
  }

  return null;
}

export const isMockEnabled = () => USE_MOCK;
