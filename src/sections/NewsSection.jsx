import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import https from "../utils/https";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { whenIdle } from "../utils/whenIdle";
import { formatDateVi } from "../utils/formatDate";

// 8 bài = 2 hàng × 4 cột (máy tính), 4 hàng × 2 (điện thoại) → cũng luôn đầy hàng.
// Ít hơn ngành vì thẻ tin có ảnh, để trang chủ không quá dài.
const MAX_POSTS = 8;

function NewsSection() {
  // Trang 1 tin tức đã nhúng sẵn trong HTML tạo trước → hiện ngay, rồi gọi API ngầm lấy bản mới nhất
  const initialPage = useInitialData(initialDataKeys.firstPostsPage);
  const [posts, setPosts] = useState(() => (initialPage?.data ?? []).slice(0, MAX_POSTS));
  const [loading, setLoading] = useState(!initialPage);
  const [error, setError] = useState("");

  useEffect(() => {
    // Đã có dữ liệu nhúng sẵn → cập nhật ngầm: không hiện khung chờ, lỗi thì giữ bản đang hiện
    const isBackgroundRefresh = Boolean(initialPage);
    const fetchPosts = async () => {
      try {
        if (!isBackgroundRefresh) {
          setLoading(true);
          setError("");
        }

        const res = await https.get("/client/posts", {
          params: {
            page: 1,
            limit: 10,
            noPaginate: false,
          },
        });

        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
              ? res
              : [];

        setPosts(data.slice(0, MAX_POSTS));
      } catch (err) {
        console.error("Error fetching latest posts:", err);
        if (isBackgroundRefresh) return;
        setError("Không tải được danh sách tin tức. Vui lòng thử lại sau.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    // Chưa có dữ liệu nhúng sẵn → gọi ngay; đã có rồi → làm mới khi trình duyệt rảnh,
    // tránh tranh băng thông với phần hiển thị đầu tiên (LCP)
    if (!isBackgroundRefresh) {
      fetchPosts();
      return;
    }
    return whenIdle(fetchPosts);
  }, []);

  return (
    <section id="news" className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-[22px] font-extrabold uppercase text-primary-dark mb-1">
          Tin tức &amp; sự kiện
        </h2>
        <p className="text-center text-[13px] text-slate-500 mb-5">
          Cập nhật thông tin tuyển sinh, hoạt động ngoại khóa và chương trình
          hợp tác doanh nghiệp mới nhất.
        </p>

        {loading && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-[13px]">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-3 animate-pulse"
              >
                <div className="w-full h-[160px] bg-slate-200 rounded-xl mb-3" />
                <div className="h-3 w-3/4 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-full bg-slate-200 rounded mb-1" />
                <div className="h-3 w-2/3 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-500 text-sm py-4">{error}</div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-4">
            Chưa có tin tức nào.
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-[13px]">
            {posts.map((n) => (
              <Link
                to={`/tin-tuc/${n.slug}`}
                key={n.id || n.slug}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition"
              >
                {n.image && (
                  <img
                    src={n.image}
                    alt={n.title}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="180"
                    className="w-full h-[180px] object-cover"
                  />
                )}
                <div className="px-3 py-2.5">
                  <div className="text-[11px] text-slate-500 mb-1">
                    {formatDateVi(n.createdAt) || "Tin tức"}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-[13px] line-clamp-2">
                    {n.title || "Bài viết"}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length > 7 && (
          <div className="text-center mt-4">
            <Link
              to="/tin-tuc"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 bg-white text-primary-dark text-xs px-4 py-1.5"
            >
              Xem thêm tin tức →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default NewsSection;
