import test from "node:test";
import assert from "node:assert/strict";
import { GUIDES, guidePath } from "../../../src/content/guides";
import { PROGRAM_FIELDS } from "../../../src/content/programFields";
import { STATIC_PATHS, guidePageMeta, staticPageMeta } from "../../../src/seo/pageMeta";
import { renderAppHtml } from "../../../src/ssr/renderPage";

const guideText = (guide) =>
  [guide.title, guide.description, guide.lead, ...guide.sections.flatMap((s) => [
    s.heading,
    ...(s.paragraphs ?? []),
    ...(s.list ?? []),
    ...(s.table ? [...s.table.head, ...s.table.rows.flat()] : []),
  ])].join("\n");

const KNOWN_PROGRAM_SLUGS = new Set(PROGRAM_FIELDS.flatMap((field) => field.programs.map((program) => program.slug)));
const KNOWN_PAGES = new Set([...STATIC_PATHS, "/"]);

test("should keep guide titles and descriptions within SERP limits", () => {
  GUIDES.forEach((guide) => {
    assert.ok(guide.metaTitle.length <= 60, `${guide.slug} title ${guide.metaTitle.length}`);
    assert.ok(guide.description.length <= 160, `${guide.slug} description ${guide.description.length}`);
  });
  assert.equal(new Set(GUIDES.map((guide) => guide.metaTitle)).size, GUIDES.length, "unique titles");
});

test("should only link guides to pages and programs that exist", () => {
  GUIDES.forEach((guide) => {
    for (const [, , href] of guideText(guide).matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(href)) {
        assert.ok(href.startsWith("https://zalo.me/"), `${guide.slug}: external ${href}`);
        continue;
      }
      const pathOnly = href.split("#")[0] || "/";
      const programSlug = pathOnly.startsWith("/nganh-dao-tao/") ? pathOnly.slice("/nganh-dao-tao/".length) : null;
      assert.ok(
        programSlug ? KNOWN_PROGRAM_SLUGS.has(programSlug) : KNOWN_PAGES.has(pathOnly),
        `${guide.slug}: ${href}`
      );
    }
  });
});

test("should not invent fees, student counts or job rates in guides", () => {
  GUIDES.forEach((guide) => {
    const text = guideText(guide);
    // "du học" được phép (trường có chương trình du học); cấm con số tự nghĩ ra
    assert.doesNotMatch(text, /sinh viên|triệu|đồng\/|VNĐ|\d+\s?%\s?(có việc|việc làm)/i, guide.slug);
    // "đại học" chỉ được nhắc trong ngữ cảnh học liên thông
    for (const line of text.split("\n").filter((l) => /đại học/i.test(l))) {
      assert.match(line, /liên thông|học lên|thi đại học|xét tuyển/i, `${guide.slug}: ${line.slice(0, 80)}`);
    }
  });
});

test("should mark up guides as articles with a breadcrumb and list them in static pages", () => {
  GUIDES.forEach((guide) => {
    const meta = guidePageMeta(guide);
    const graph = JSON.stringify(meta.jsonLd);
    assert.equal(meta.path, guidePath(guide.slug));
    assert.match(graph, /"@type":"Article"/);
    assert.match(graph, /"@type":"BreadcrumbList"/);
    assert.ok(STATIC_PATHS.includes(meta.path));
    assert.deepEqual(staticPageMeta(meta.path), meta);
  });
  assert.equal(staticPageMeta("/cam-nang/khong-co"), null);
  assert.ok(staticPageMeta("/cam-nang")?.isIndexable);
});

test("should prerender a guide with its H1, sections and internal links", () => {
  const guide = GUIDES[0];
  const html = renderAppHtml(guidePath(guide.slug), {});
  assert.equal((html.match(/<h1/g) || []).length, 1);
  assert.ok(html.includes(guide.sections[0].heading));
  assert.match(html, /href="\/nganh-dao-tao"/);
  assert.match(html, /<strong[^>]*>/);

  const list = renderAppHtml("/cam-nang", {});
  GUIDES.forEach((item) => assert.ok(list.includes(`href="${guidePath(item.slug)}"`), item.slug));
});
