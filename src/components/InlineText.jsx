import { Link } from "react-router-dom";

// Chữ có link [chữ](/duong-dan hoặc https://…) và chữ đậm **chữ** (nội dung soạn trong src/content/*)
const TOKEN_PATTERN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

const LINK_CLASS = "text-primary font-medium underline underline-offset-2 hover:text-primary-dark";

function InlineText({ text }) {
  const parts = [];
  let lastIndex = 0;
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const [, linkText, href, boldText] = match;
    if (boldText) {
      // Chữ đậm có thể chứa link: **Trung cấp [Ô tô](/nganh-dao-tao/…):**
      parts.push(
        <strong key={match.index} className="text-slate-900">
          <InlineText text={boldText} />
        </strong>
      );
    } else if (/^https?:\/\//.test(href)) {
      parts.push(
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {linkText}
        </a>
      );
    } else {
      // Kể cả "/#register": ScrollToTop cuộn tới form sau khi chuyển trang
      parts.push(<Link key={match.index} to={href} className={LINK_CLASS}>{linkText}</Link>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}

export default InlineText;
