import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import ContactCard from "../components/ContactCard";
import { staticPageMeta } from "../seo/pageMeta";
import { GALLERY_ALBUMS, GALLERY_PATH, GALLERY_PHOTO_COUNT } from "../content/gallery";

const SRC = (name, thumb) => `/images/gallery/${name}${thumb ? "-thumb" : ""}.webp`;

/** Xem ảnh lớn: bấm ảnh để mở, Esc hoặc bấm nền để đóng */
function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 p-4"
      onClick={onClose}
    >
      <figure className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
        <img src={SRC(photo.name)} alt={photo.alt} className="max-h-[80vh] w-auto rounded-xl object-contain" />
        <figcaption className="mt-3 text-center text-[13px] text-white/90">{photo.alt}</figcaption>
      </figure>
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng ảnh"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[18px] text-slate-700 hover:bg-white"
      >
        ×
      </button>
    </div>
  );
}

function GalleryPage() {
  const [active, setActive] = useState(null);

  return (
    <>
      <Seo meta={staticPageMeta(GALLERY_PATH)} />
      <main className="bg-slate-50 min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 text-[14px] md:text-[15px] text-slate-700 leading-relaxed">
          <header>
            <nav aria-label="Breadcrumb" className="text-[12px] text-slate-500 mb-3">
              <Link to="/" className="hover:text-primary">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-slate-700">Hình ảnh</span>
            </nav>
            <h1 className="text-[26px] md:text-[32px] font-extrabold leading-tight text-slate-900">
              Hình ảnh hoạt động của Trường Trung cấp nghề Nhân Lực Quốc Tế
            </h1>
            <p className="mt-3 max-w-4xl">
              {GALLERY_PHOTO_COUNT} ảnh ghi lại lễ khai giảng, lễ trao bằng tốt nghiệp, giờ học và giờ thực hành,
              các buổi đào tạo kỹ năng mềm và hoạt động cộng đồng của học viên tại{" "}
              <Link to="/gioi-thieu" className="font-medium text-primary underline underline-offset-2">
                Trường Trung cấp nghề Nhân Lực Quốc Tế
              </Link>
              , số 6 Phan Đình Giót, Tân Bình, TP. Hồ Chí Minh.
            </p>
            <nav aria-label="Nhóm ảnh" className="mt-4 flex flex-wrap gap-2">
              {GALLERY_ALBUMS.map((album) => (
                <a
                  key={album.id}
                  href={`#${album.id}`}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 hover:border-primary hover:text-primary-dark"
                >
                  {album.title}
                </a>
              ))}
            </nav>
          </header>

          {GALLERY_ALBUMS.map((album) => (
            <section key={album.id} id={album.id} className="mt-10 scroll-mt-24">
              <h2 className="text-[19px] md:text-[21px] font-bold text-primary-dark">{album.title}</h2>
              <p className="mt-1 max-w-4xl text-slate-600">
                {album.description}
                {album.postSlug && (
                  <>
                    {" "}
                    <Link
                      to={`/tin-tuc/${album.postSlug}`}
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      Đọc bài viết
                    </Link>
                    .
                  </>
                )}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {album.photos.map((photo) => (
                  <li key={photo.name}>
                    <button
                      type="button"
                      onClick={() => setActive(photo)}
                      className="group block w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
                      aria-label={`Xem ảnh lớn: ${photo.alt}`}
                    >
                      <img
                        src={SRC(photo.name, true)}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="mt-10 text-slate-600">
            Xem thêm{" "}
            <Link to="/hoat-dong-hoc-vien" className="font-medium text-primary underline underline-offset-2">
              hoạt động của học viên
            </Link>{" "}
            và{" "}
            <Link to="/tin-tuc" className="font-medium text-primary underline underline-offset-2">
              tin tức nhà trường
            </Link>
            .
          </p>

          <ContactCard />
        </div>
      </main>

      {active && <Lightbox photo={active} onClose={() => setActive(null)} />}
    </>
  );
}

export default GalleryPage;
