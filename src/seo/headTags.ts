// Danh sách thẻ <head> cho 1 trang — nguồn duy nhất cho cả React (components/Seo.jsx)
// lẫn HTML tạo sẵn (renderHead.ts), để 2 nơi không lệch nhau.
import appConfig from "../configs/appConfig";
import type { PageMeta } from "./pageMeta";
import { canonicalUrl } from "./url";
import { readEnv } from "../configs/env";

export type HeadTag =
  | { kind: "title"; text: string }
  | { kind: "meta"; attrs: Record<string, string> }
  | { kind: "link"; attrs: Record<string, string> }
  | { kind: "jsonld"; json: string }
  | { kind: "preload"; attrs: Record<string, string> };

// "<" trong JSON-LD có thể đóng thẻ <script> sớm → escape thành <
export function toSafeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const named = (name: string, content: string): HeadTag => ({ kind: "meta", attrs: { name, content } });
const property = (prop: string, content: string): HeadTag => ({
  kind: "meta",
  attrs: { property: prop, content },
});

function imageTags(meta: PageMeta): HeadTag[] {
  if (!meta.image) return [];
  return [
    property("og:image", meta.image),
    property("og:image:alt", meta.title),
    ...(meta.imageWidth && meta.imageHeight
      ? [
          property("og:image:width", String(meta.imageWidth)),
          property("og:image:height", String(meta.imageHeight)),
        ]
      : []),
    named("twitter:image", meta.image),
  ];
}

function articleTags(meta: PageMeta): HeadTag[] {
  if (meta.ogType !== "article") return [];
  return [
    ...(meta.publishedTime ? [property("article:published_time", meta.publishedTime)] : []),
    ...(meta.modifiedTime ? [property("article:modified_time", meta.modifiedTime)] : []),
  ];
}

function preloadTags(meta: PageMeta): HeadTag[] {
  if (!meta.preloadImage) return [];
  return [meta.preloadImage].flat().map((image) => ({
    kind: "preload" as const,
    attrs: {
      rel: "preload",
      as: "image",
      href: image.href,
      ...(image.srcSet ? { imagesrcset: image.srcSet } : {}),
      ...(image.sizes ? { imagesizes: image.sizes } : {}),
      fetchpriority: "high",
      ...(image.media ? { media: image.media } : {}),
    },
  }));
}

/**
 * Bắt tay sớm với kho ảnh.
 *
 * Ảnh bài viết nằm trên tên miền khác (bucket của trường), nên trình duyệt phải làm lại DNS →
 * TCP → TLS trước khi tải được byte đầu tiên. Đo trên điện thoại 4G ngày 21/10/2026: ảnh bài nổi
 * bật ở /tin-tuc xong lúc 5.554ms và chính là phần tử LCP. preconnect cho phép làm phần bắt tay
 * đó song song với lúc đọc HTML.
 */
function preconnectTags(): HeadTag[] {
  const hosts = new Set<string>();
  for (const raw of [readEnv("VITE_API_URL"), ...readEnv("VITE_IMAGE_HOSTS").split(",")]) {
    const value = raw.trim();
    if (!value) continue;
    try {
      hosts.add(new URL(value.includes("//") ? value : `https://${value}`).origin);
    } catch {
      // Env ghi sai định dạng thì bỏ qua, không được làm hỏng thẻ head
    }
  }
  return [...hosts].flatMap((origin) => [
    { kind: "link" as const, attrs: { rel: "preconnect", href: origin, crossorigin: "" } },
    // Trình duyệt cũ không hiểu preconnect thì vẫn tra DNS trước được
    { kind: "link" as const, attrs: { rel: "dns-prefetch", href: origin } },
  ]);
}

export function buildHeadTags(meta: PageMeta): HeadTag[] {
  const url = canonicalUrl(meta.path);
  return [
    ...preconnectTags(),
    ...preloadTags(meta),
    { kind: "title", text: meta.title },
    named("description", meta.description),
    named("robots", meta.isIndexable ? "index,follow" : "noindex,follow"),
    ...(meta.isIndexable ? [{ kind: "link", attrs: { rel: "canonical", href: url } } as HeadTag] : []),
    property("og:type", meta.ogType),
    property("og:locale", "vi_VN"),
    property("og:site_name", appConfig.name),
    property("og:title", meta.title),
    property("og:description", meta.description),
    property("og:url", url),
    ...imageTags(meta),
    ...articleTags(meta),
    named("twitter:card", "summary_large_image"),
    named("twitter:title", meta.title),
    named("twitter:description", meta.description),
    ...meta.jsonLd.map((schema): HeadTag => ({ kind: "jsonld", json: toSafeJson(schema) })),
  ];
}
