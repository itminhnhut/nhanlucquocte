// Cây route của trình duyệt: giống src/routes.jsx nhưng mỗi trang là 1 chunk
// JS riêng, tải khi mở trang đó (Swiper chỉ tải ở trang cần) → bundle chung nhỏ hơn. Server vẫn dùng src/routes.jsx
// (import tĩnh) để render đồng bộ. Test routes.test.js giữ 2 cây cùng danh sách path.
import RootLayout from "./layouts/RootLayout";
import LegacyRedirect from "./components/LegacyRedirect";
import {
  LEGACY_NEWS_PATHS,
  LEGACY_PATHS,
  LEGACY_PROGRAM_PATHS,
  LEGACY_REMOVED_PATHS,
} from "./configs/legacyPaths";

const page = (load) => async () => ({ Component: (await load()).default });

export const clientRoutes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, lazy: page(() => import("./App")) },
      { path: "gioi-thieu", lazy: page(() => import("./pages/AboutPage")) },
      { path: "nganh-dao-tao", lazy: page(() => import("./pages/ProgramsPage")) },
      { path: "nganh-dao-tao/:slug", lazy: page(() => import("./pages/ProgramDetailPage")) },
      { path: "du-hoc", lazy: page(() => import("./pages/StudyAbroadPage")) },
      { path: "hoc-phi", lazy: page(() => import("./pages/FeesPage")) },
      { path: "hop-tac-doanh-nghiep", lazy: page(() => import("./pages/PartnershipPage")) },
      { path: "hoat-dong-hoc-vien", lazy: page(() => import("./pages/ActivitiesPage")) },
      { path: "hinh-anh", lazy: page(() => import("./pages/GalleryPage")) },
      { path: "tuyen-sinh", lazy: page(() => import("./pages/AdmissionsPage")) },
      { path: "tin-tuc", lazy: page(() => import("./pages/NewsPage")) },
      { path: "tin-tuc/:slug", lazy: page(() => import("./pages/NewsDetailsPage")) },
      { path: "tim-kiem", lazy: page(() => import("./pages/SearchPage")) },
      { path: "tra-cuu-van-bang", lazy: page(() => import("./pages/Degrees")) },
      { path: "lien-he", lazy: page(() => import("./pages/ContactPage")) },
      { path: "cau-hoi-thuong-gap", lazy: page(() => import("./pages/FaqPage")) },
      { path: "cam-nang", lazy: page(() => import("./pages/GuidesPage")) },
      { path: "cam-nang/:slug", lazy: page(() => import("./pages/GuideDetailPage")) },
      { path: "chinh-sach-bao-mat", lazy: page(() => import("./pages/PrivacyPage")) },
      { path: "cong-khai", lazy: page(() => import("./pages/DisclosurePage")) },
      // URL cũ tiếng Anh → URL tiếng Việt (src/configs/legacyPaths.ts)
      ...[
        ...Object.keys(LEGACY_PATHS),
        ...Object.keys(LEGACY_PROGRAM_PATHS),
        ...Object.keys(LEGACY_NEWS_PATHS),
        ...LEGACY_REMOVED_PATHS,
      ].flatMap((path) => [
        { path, element: <LegacyRedirect /> },
        { path: `${path}/*`, element: <LegacyRedirect /> },
      ]),
      { path: "*", lazy: page(() => import("./pages/NotFoundPage")) },
    ],
  },
];
