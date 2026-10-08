import test from "node:test";
import assert from "node:assert/strict";
import { SITE_FAQS, answerText, parseAnswer } from "../../../src/content/faqs";
import { FAQ_PAGE_PATH, STATIC_PATHS, staticPageMeta } from "../../../src/seo/pageMeta";

test("should publish FAQ page with FAQPage schema listing every question", () => {
  const meta = staticPageMeta(FAQ_PAGE_PATH);
  const page = meta.jsonLd[0]["@graph"].find((node) => node["@type"] === "FAQPage");

  assert.ok(STATIC_PATHS.includes(FAQ_PAGE_PATH));
  assert.equal(meta.isIndexable, true);
  assert.equal(page.mainEntity.length, SITE_FAQS.length);
  assert.equal(page.mainEntity[0].name, SITE_FAQS[0].question);
});

test("should keep FAQ schema answers as plain text without link syntax", () => {
  const meta = staticPageMeta(FAQ_PAGE_PATH);
  const answers = meta.jsonLd[0]["@graph"].find((node) => node["@type"] === "FAQPage").mainEntity;

  answers.forEach((item) => assert.doesNotMatch(item.acceptedAnswer.text, /\]\(|\[/));
});

test("should split answers into text and links in order", () => {
  assert.deepEqual(parseAnswer("Xem [Liên hệ](/lien-he) nhé"), [
    { text: "Xem " },
    { text: "Liên hệ", href: "/lien-he" },
    { text: " nhé" },
  ]);
  assert.equal(answerText("Xem [Liên hệ](/lien-he)."), "Xem Liên hệ.");
});
