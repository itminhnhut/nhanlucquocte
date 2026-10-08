// Cây route dùng chung: trình duyệt (router.jsx) và server tạo HTML sẵn (src/ssr/renderPage.jsx).
import RootLayout from "./layouts/RootLayout";
import LegacyRedirect from "./components/LegacyRedirect";
import { LEGACY_PATHS, LEGACY_PROGRAM_PATHS } from "./configs/legacyPaths";
import App from "./App";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailsPage from "./pages/NewsDetailsPage";
import SearchPage from "./pages/SearchPage";
import DegreesSection from "./pages/Degrees";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import FaqPage from "./pages/FaqPage";
import GuidesPage from "./pages/GuidesPage";
import GuideDetailPage from "./pages/GuideDetailPage";
import PrivacyPage from "./pages/PrivacyPage";
import DisclosurePage from "./pages/DisclosurePage";
import AdmissionsPage from "./pages/AdmissionsPage";
import StudyAbroadPage from "./pages/StudyAbroadPage";
import FeesPage from "./pages/FeesPage";
import PartnershipPage from "./pages/PartnershipPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import GalleryPage from "./pages/GalleryPage";

export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "gioi-thieu", element: <AboutPage /> },
      { path: "nganh-dao-tao", element: <ProgramsPage /> },
      { path: "nganh-dao-tao/:slug", element: <ProgramDetailPage /> },
      { path: "du-hoc", element: <StudyAbroadPage /> },
      { path: "hoc-phi", element: <FeesPage /> },
      { path: "hop-tac-doanh-nghiep", element: <PartnershipPage /> },
      { path: "hoat-dong-hoc-vien", element: <ActivitiesPage /> },
      { path: "hinh-anh", element: <GalleryPage /> },
      { path: "tuyen-sinh", element: <AdmissionsPage /> },
      { path: "tin-tuc", element: <NewsPage /> },
      { path: "tin-tuc/:slug", element: <NewsDetailsPage /> },
      { path: "tim-kiem", element: <SearchPage /> },
      { path: "tra-cuu-van-bang", element: <DegreesSection /> },
      { path: "lien-he", element: <ContactPage /> },
      { path: "cau-hoi-thuong-gap", element: <FaqPage /> },
      { path: "cam-nang", element: <GuidesPage /> },
      { path: "cam-nang/:slug", element: <GuideDetailPage /> },
      { path: "chinh-sach-bao-mat", element: <PrivacyPage /> },
      { path: "cong-khai", element: <DisclosurePage /> },
      // URL cũ tiếng Anh → URL tiếng Việt (src/configs/legacyPaths.ts)
      ...[...Object.keys(LEGACY_PATHS), ...Object.keys(LEGACY_PROGRAM_PATHS)].flatMap((path) => [
        { path, element: <LegacyRedirect /> },
        { path: `${path}/*`, element: <LegacyRedirect /> },
      ]),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
