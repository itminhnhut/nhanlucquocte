import { useMemo } from "react";
import { Link } from "react-router-dom";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { formatDateVi } from "../utils/formatDate";

const FALLBACK_COUNT = 5;

// "Bài viết khác" cuối bài tin. HTML tạo sẵn: bài cũ hơn + mới hơn (src/ssr/initialDataForPath.ts)
// để bot theo link tới mọi bài.
// Không có dữ liệu nhúng thì dùng chung danh sách `fallbackPosts` của trang cha — khối này và
// sidebar "Tin mới nhất" trước đây mỗi bên tự gọi /client/posts, tức 2 request cho cùng một danh sách.
// Dùng key={slug} ở nơi gọi để đổi bài thì dựng lại.
function OtherPosts({ slug, fallbackPosts }) {
  const initialPosts = useInitialData(initialDataKeys.nearbyPosts(slug));
  const posts = useMemo(() => {
    const list = initialPosts ?? fallbackPosts ?? [];
    return list.filter((post) => post.slug !== slug).slice(0, FALLBACK_COUNT);
  }, [initialPosts, fallbackPosts, slug]);

  if (!posts.length) return null;

  return (
    <section aria-labelledby="other-posts" className="mt-8">
      <h2 id="other-posts" className="text-[18px] font-bold text-slate-900 mb-3">
        Bài viết khác
      </h2>
      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
        {posts.map((post) => (
          <li key={post.id || post.slug}>
            <Link
              to={`/tin-tuc/${post.slug}`}
              className="flex items-baseline justify-between gap-3 px-4 py-3 text-[14px] text-slate-800 hover:bg-slate-50 hover:text-primary-dark transition"
            >
              <span className="font-medium">{post.title}</span>
              {post.createdAt && (
                <time dateTime={post.createdAt} className="shrink-0 text-[12px] text-slate-500">
                  {formatDateVi(post.createdAt)}
                </time>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default OtherPosts;
