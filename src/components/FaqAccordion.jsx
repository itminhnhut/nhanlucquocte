import { Link } from "react-router-dom";
import { parseAnswer } from "../content/faqs";

// Link nội bộ trong câu trả lời (kể cả "/#register": ScrollToTop cuộn tới form sau khi chuyển trang)
function AnswerPart({ part }) {
  if (!part.href) return part.text;
  return (
    <Link
      to={part.href}
      className="text-primary font-medium underline underline-offset-2 hover:text-primary-dark"
    >
      {part.text}
    </Link>
  );
}

/**
 * Danh sách hỏi–đáp dạng bấm-để-mở (<details>, không cần JS).
 * questionTag: thẻ heading của câu hỏi theo cấu trúc trang (h2 hoặc h3).
 */
function FaqAccordion({ faqs, questionTag: QuestionTag = "h3", openFirst = false }) {
  return (
    <div className="rounded-2xl bg-white shadow-soft border border-slate-100 px-4 md:px-6 py-1">
      {faqs.map((faq, index) => (
        <details
          key={faq.question}
          className="faq-item group border-b last:border-b-0 border-slate-200 py-4"
          open={openFirst && index === 0}
        >
          <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
            <QuestionTag className="!m-0 text-[15px] md:text-[16px] font-semibold text-primary-dark">
              {faq.question}
            </QuestionTag>
            <span className="shrink-0 transition-transform group-open:rotate-45 text-primary text-xl leading-none">
              +
            </span>
          </summary>
          <p className="pt-2 leading-relaxed text-slate-700">
            {parseAnswer(faq.answer).map((part, partIndex) => (
              <AnswerPart key={partIndex} part={part} />
            ))}
          </p>
        </details>
      ))}
    </div>
  );
}

export default FaqAccordion;
