// Danh sách thẻ <head> cho 1 trang — nguồn duy nhất cho cả React (components/Seo.jsx)
// lẫn HTML tạo sẵn (renderHead.ts), để 2 nơi không lệch nhau.
import appConfig from "../configs/appConfig";
import type { PageMeta } from "./pageMeta";
import { canonicalUrl } from "./url";

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
      imagesrcset: image.srcSet,
      imagesizes: image.sizes,
      fetchpriority: "high",
      ...(image.media ? { media: image.media } : {}),
    },
  }));
}

export function buildHeadTags(meta: PageMeta): HeadTag[] {
  const url = canonicalUrl(meta.path);
  return [
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
