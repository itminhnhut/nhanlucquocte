// Menu chính — một nguồn dùng cho header, menu mobile và footer.
// Menu đúng như trường đang dùng, bổ sung "Du học": Trang chủ, Giới thiệu, Chương trình đào tạo,
// Du học, Tuyển sinh, Tra cứu văn bằng, Tin tức, Liên hệ.
// Cẩm nang vẫn là trang chạy (có trong sitemap, link từ footer) nhưng không hiện ở menu trên.
// "Chương trình đào tạo" và "Tin tức" lấy dữ liệu từ database của trường (đang import);
// trang nào chưa có dữ liệu thì đặt enabled: false để ẩn khỏi menu và sitemap.
export interface NavItem {
  to: string;
  label: string;
  /** Mặc định hiện; false = chưa mở, không hiện trong menu và không đưa vào sitemap */
  enabled?: boolean;
  /** true = trang vẫn chạy và vẫn được index, chỉ không hiện ở menu trên (vd Cẩm nang) */
  hiddenInMenu?: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: "/", label: "Trang chủ" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/nganh-dao-tao", label: "Chương trình đào tạo" },
  { to: "/du-hoc", label: "Du học" },
  { to: "/tuyen-sinh", label: "Tuyển sinh" },
  { to: "/tra-cuu-van-bang", label: "Tra cứu văn bằng" },
  { to: "/cam-nang", label: "Cẩm nang", hiddenInMenu: true },
  { to: "/tin-tuc", label: "Tin tức" },
  { to: "/lien-he", label: "Liên hệ" },
];

export const MAIN_NAV = NAV_ITEMS.filter((item) => item.enabled !== false && !item.hiddenInMenu);

/** Trang chưa mở → không đưa vào sitemap, không cho index */
export const DISABLED_PATHS: readonly string[] = NAV_ITEMS.filter((item) => item.enabled === false).map(
  (item) => item.to
);

/** Slug trùng đường dẫn của một mục trên site (dữ liệu CMS gõ nhầm) → không tạo link trang ngành */
const RESERVED_SLUGS = new Set(NAV_ITEMS.map((item) => item.to.replace(/^\//, "")).filter(Boolean));

export function isReservedSlug(slug: string | undefined): boolean {
  return Boolean(slug && RESERVED_SLUGS.has(slug));
}
