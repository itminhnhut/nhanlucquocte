import test from "node:test";
import assert from "node:assert/strict";
import { PROGRAM_FAQ_GROUPS, programFaqGroupBySlug } from "../../../src/content/programFaqs";
import { ALL_PROGRAMS } from "../../../src/content/programFields";
import { SITE_FAQS, parseAnswer } from "../../../src/content/faqs";
import { FAQ_PAGE_PATH, STATIC_PATHS, programPageMeta, staticPageMeta } from "../../../src/seo/pageMeta";

// Slug ngành trong danh mục (src/content/programFields.ts)
const PROGRAM_SLUGS = ALL_PROGRAMS.map((program) => program.slug);

const graphNode = (meta, type) => meta.jsonLd[0]["@graph"].find((node) => node["@type"] === type);

test("should point every FAQ link on the site to an existing page", () => {
  const allFaqs = [...SITE_FAQS, ...PROGRAM_FAQ_GROUPS.flatMap((group) => group.faqs)];
  const hrefs = allFaqs.flatMap((faq) => parseAnswer(faq.answer).filter((part) => part.href).map((part) => part.href));

  hrefs.forEach((href) => {
    const exists =
      STATIC_PATHS.includes(href) || href === "/#register" || PROGRAM_SLUGS.some((slug) => href === `/nganh-dao-tao/${slug}`);
    assert.ok(exists, `link không tồn tại: ${href}`);
  });
});

test("should use a current program slug as the main slug of each group", () => {
  PROGRAM_FAQ_GROUPS.forEach((group) => assert.ok(PROGRAM_SLUGS.includes(group.slugs[0]), group.slugs[0]));
});

test("should add preset FAQPage schema to program page when CMS content has no FAQ", () => {
  const meta = programPageMeta({ title: "TUYỂN SINH NGÀNH CHĂM SÓC SẮC ĐẸP", content: "<p>Giới thiệu</p>" }, "cham-soc-sac-dep-he-trung-cap");

  const faq = graphNode(meta, "FAQPage");

  assert.deepEqual(
    faq.mainEntity.map((item) => item.name),
    programFaqGroupBySlug("cham-soc-sac-dep-he-trung-cap").faqs.map((item) => item.question)
  );
});

test("should prefer the FAQ written in CMS content over preset questions", () => {
  const content = "<h2>Câu hỏi thường gặp</h2><h3>Câu hỏi từ admin?</h3><p>Trả lời.</p>";

  const meta = programPageMeta({ title: "TUYỂN SINH NGÀNH KẾ TOÁN DOANH NGHIỆP", content }, "ke-toan-doanh-nghiep");

  assert.deepEqual(graphNode(meta, "FAQPage").mainEntity.map((item) => item.name), ["Câu hỏi từ admin?"]);
});

test("should not mark program questions again on the FAQ page (one markup per Q&A)", () => {
  const questions = graphNode(staticPageMeta(FAQ_PAGE_PATH), "FAQPage").mainEntity.map((item) => item.name);
  const programQuestions = PROGRAM_FAQ_GROUPS.flatMap((group) => group.faqs.map((faq) => faq.question));

  assert.equal(questions.length, SITE_FAQS.length);
  programQuestions.forEach((question) => assert.ok(!questions.includes(question), question));
  assert.equal(new Set(programQuestions).size, programQuestions.length);
});
