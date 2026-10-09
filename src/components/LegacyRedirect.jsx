import { Navigate, useLocation } from "react-router-dom";
import {
  LEGACY_NEWS_PATHS,
  LEGACY_PATHS,
  LEGACY_PROGRAM_PATHS,
  LEGACY_REMOVED_PATHS,
} from "../configs/legacyPaths";
import { programHref } from "../content/programFields";

// /gioi-thieu.html → /gioi-thieu ; /chuyen-nganh-dieu-duong-he-trung-cap-.html → /nganh-dao-tao/dieu-duong
// (hoặc /nganh-dao-tao khi bài ngành chưa import). Giữ nguyên query và hash.
export function legacyTarget(pathname) {
  const [, first, ...rest] = pathname.split("/");
  const programSlug = LEGACY_PROGRAM_PATHS[first];
  if (programSlug) return programHref(programSlug);
  // Trang rác của template cũ (hồ tiêu, quế, giỏ hàng) → trang chủ
  if (LEGACY_REMOVED_PATHS.includes(first)) return "/";
  const newsSlug = LEGACY_NEWS_PATHS[first];
  if (newsSlug) return `/tin-tuc/${newsSlug}`;
  const mapped = LEGACY_PATHS[first];
  if (mapped !== undefined) return `/${[mapped, ...rest].filter(Boolean).join("/")}`;
  return `/${[first, ...rest].filter(Boolean).join("/")}`;
}

function LegacyRedirect() {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={`${legacyTarget(pathname)}${search}${hash}`} replace />;
}

export default LegacyRedirect;
