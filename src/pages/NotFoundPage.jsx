import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { notFoundPageMeta } from "../seo/pageMeta";

// Nginx trả HTTP 404 kèm 404.html (noindex) cho URL lạ; trang này hiển thị nội dung
function NotFoundPage() {
  return (
    <>
      <Seo meta={notFoundPageMeta()} />

      <main className="max-w-3xl mx-auto px-4 py-16 lg:py-24 text-center">
        <p className="text-[48px] sm:text-[64px] font-extrabold text-primary leading-none">404</p>
        <h1 className="mt-4 text-[22px] sm:text-[26px] font-bold text-primary-dark">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-[14px] text-slate-600">
          Trang bạn tìm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-[14px] font-semibold">
          <Link to="/" className="px-5 py-2.5 rounded-full bg-primary text-white hover:opacity-90">
            Về trang chủ
          </Link>
          <Link
            to="/nganh-dao-tao"
            className="px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary/5"
          >
            Xem ngành đào tạo
          </Link>
        </div>
      </main>
    </>
  );
}

export default NotFoundPage;
