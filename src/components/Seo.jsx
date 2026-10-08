import { Helmet } from "react-helmet-async";
import { buildHeadTags } from "../seo/headTags";

// Render meta của trang từ PageMeta (src/seo/pageMeta.ts).
// Dùng chung buildHeadTags với HTML tạo sẵn → thẻ khớp với bản bot đọc được.
function renderTag(tag, index) {
  switch (tag.kind) {
    case "title":
      return <title key={index}>{tag.text}</title>;
    case "meta":
      return <meta key={index} {...tag.attrs} />;
    case "link":
      return <link key={index} {...tag.attrs} />;
    case "jsonld":
      return (
        <script key={index} type="application/ld+json">
          {tag.json}
        </script>
      );
    // Preload chỉ có tác dụng trong HTML ban đầu → không render lại lúc chạy
    case "preload":
      return null;
    default:
      return null;
  }
}

export function Seo({ meta }) {
  if (!meta) return null;
  return <Helmet>{buildHeadTags(meta).map(renderTag)}</Helmet>;
}
