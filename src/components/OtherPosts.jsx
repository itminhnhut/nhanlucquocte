import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import https from "../utils/https";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { formatDateVi } from "../utils/formatDate";

const FALLBACK_COUNT = 5;

// "Bài viết khác" cuối bài tin. HTML tạo sẵn: bài cũ hơn + mới hơn (src/ssr/initialDataForPath.ts)
// để bot theo link tới mọi bài. Mở bằng điều hướng trong trình duyệt: lấy các bài mới nhất.
// Dùng key={slug} ở nơi gọi để đổi bài thì lấy lại danh sách.
function OtherPosts({ slug }) {
  const initialPosts = useInitialData(initialDataKeys.nearbyPosts(slug));
  const [posts, setPosts] = useState(initialPosts ?? []);

  useEffect(() => {
    if (initialPosts) return;
    let isCancelled = false;
    https
      .get("/client/posts", { params: { page: 1, limit: FALLBACK_COUNT + 1, noPaginate: false } })
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (!isCancelled) setPosts(list.filter((post) => post.slug !== slug).slice(0, FALLBACK_COUNT));
      })
      .catch(() => {
        /* Khối phụ: lỗi mạng thì không hiện */
      });
    return () => {
      isCancelled = true;
    };
  }, [slug, initialPosts]);

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
