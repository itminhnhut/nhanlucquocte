// Mục "Câu hỏi thường gặp" trong nội dung CMS (không cần backend):
//   <h2>Câu hỏi thường gặp</h2>      ← tiêu đề mục (h2/h3/h4)
//   <h3>Học bao lâu?</h3><p>…</p>    ← mỗi câu hỏi là tiêu đề nhỏ hơn, câu trả lời theo sau
// Mục kết thúc ở tiêu đề cùng cấp/lớn hơn tiêu đề mục, hoặc cuối nội dung.
// Xử lý bằng chuỗi (không DOM) để chạy được cả trong trình duyệt lẫn server Node.
import { escapeHtml } from "./renderHead";

export interface FaqItem {
  question: string;
  answerHtml: string;
  answerText: string;
}

interface FaqSection {
  /** Nội dung giữa tiêu đề mục và câu hỏi đầu tiên (lời dẫn) — giữ nguyên khi hiển thị */
  introHtml: string;
  /** Mọi câu hỏi có tiêu đề; câu trả lời có thể chỉ có ảnh (answerText rỗng) */
  items: FaqItem[];
  start: number;
  end: number;
}

interface Heading {
  level: number;
  text: string;
  start: number;
  end: number;
}

const FAQ_MARKER = /câu hỏi thường gặp|hỏi\s*(?:&amp;|&|và|-|–)?\s*đáp|\bfaq\b/i;
const HEADING_PATTERN = /<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi;

function toText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

function findHeadings(html: string): Heading[] {
  return Array.from(html.matchAll(HEADING_PATTERN), (match) => ({
    level: Number(match[1]),
    text: toText(match[2]),
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
  }));
}

export function extractFaqSection(html: unknown): FaqSection | null {
  if (typeof html !== "string" || !html) return null;
  const headings = findHeadings(html);
  const markerIndex = headings.findIndex((heading) => FAQ_MARKER.test(heading.text));
  if (markerIndex === -1) return null;

  const marker = headings[markerIndex];
  const after = headings.slice(markerIndex + 1);
  const closing = after.find((heading) => heading.level <= marker.level);
  const end = closing ? closing.start : html.length;
  const questions = after.filter((heading) => heading.level > marker.level && heading.start < end);

  if (!questions.length) return null;
  const items = questions
    .map((question, index) => {
      const answerEnd = questions[index + 1]?.start ?? end;
      const answerHtml = html.slice(question.end, answerEnd).trim();
      return { question: question.text, answerHtml, answerText: toText(answerHtml) };
    })
    .filter((item) => item.question && item.answerHtml);

  if (!items.length) return null;
  const introHtml = html.slice(marker.end, questions[0].start).trim();
  return { introHtml, items, start: marker.start, end };
}

/** Chỉ câu trả lời có chữ mới vào schema (Google cần text); câu chỉ có ảnh vẫn hiển thị trên trang */
export function faqSchema(items: FaqItem[]): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    mainEntity: items.filter((item) => item.answerText).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answerText },
    })),
  };
}

/**
 * Thay mục FAQ trong HTML bằng danh sách bấm-để-mở (<details>) — không cần JS.
 * Giao diện giống components/FaqAccordion.jsx (FAQ soạn sẵn theo ngành) để trang ngành và bài tin đồng bộ.
 */
export function renderFaqAccordion(html: string): string {
  const section = extractFaqSection(html);
  if (!section) return html;
  const items = section.items
    .map(
      (item) =>
        `<details class="faq-item group border-b last:border-b-0 border-slate-200 py-4">` +
        `<summary class="cursor-pointer list-none flex items-center justify-between gap-3">` +
        `<h3 class="!m-0 text-[15px] md:text-[16px] font-semibold text-primary-dark">${escapeHtml(item.question)}</h3>` +
        `<span class="shrink-0 transition-transform duration-300 group-open:rotate-45 text-primary text-xl leading-none">+</span>` +
        `</summary><div class="pt-2 leading-relaxed text-slate-700">${item.answerHtml}</div></details>`
    )
    .join("");
  const block =
    `<section class="faq not-prose mt-8">` +
    `<h2 class="text-[18px] md:text-[20px] font-bold text-primary-dark mb-3">Câu hỏi thường gặp</h2>` +
    `${section.introHtml ? `<div class="mb-3">${section.introHtml}</div>` : ""}` +
    `<div class="rounded-2xl bg-white shadow-soft border border-slate-100 px-4 md:px-6 py-1">${items}</div></section>`;
  return `${html.slice(0, section.start)}${block}${html.slice(section.end)}`;
}
