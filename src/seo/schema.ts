// JSON-LD (schema.org) cho từng loại trang. Mỗi trang xuất 1 @graph gồm
// Organization + WebSite + node riêng của trang (+ BreadcrumbList), để Google
// liên kết trang với trường qua @id.
import appConfig from "../configs/appConfig";
import { SITE_URL, absoluteUrl, canonicalUrl } from "./url";

type JsonLdNode = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_SIZE = 512;

export interface Crumb {
  name: string;
  path: string;
}

export interface ListedCourse {
  name: string;
  description: string;
  path: string;
}

/** Tham chiếu trường kèm name/url/logo: Google đọc author.name/publisher ngay tại chỗ,
 * không phụ thuộc việc công cụ có tra @id sang node EducationalOrganization hay không */
export function organizationRef(): JsonLdNode {
  return {
    "@type": "EducationalOrganization",
    "@id": ORGANIZATION_ID,
    name: appConfig.legalName,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: absoluteUrl(appConfig.logo), width: LOGO_SIZE, height: LOGO_SIZE },
  };
}

export interface ProgramSchemaInput extends ListedCourse {
  /** "Trung cấp" hoặc "Khóa ngắn hạn" */
  programType: string;
  /** Văn bằng khi hoàn thành: bằng tốt nghiệp trung cấp / chứng chỉ */
  credential: string;
  /** Ngày khai giảng sắp tới (YYYY-MM-DD), chỉ khi còn ở tương lai */
  startDate?: string;
}

/** Trang ngành: vừa là Course vừa là EducationalOccupationalProgram (chương trình đào tạo nghề) */
export function programSchema(program: ProgramSchemaInput, image?: string): JsonLdNode {
  return {
    "@type": ["Course", "EducationalOccupationalProgram"],
    "@id": `${canonicalUrl(program.path)}#program`,
    name: program.name,
    description: program.description,
    url: canonicalUrl(program.path),
    inLanguage: "vi",
    provider: organizationRef(),
    ...(program.programType ? { programType: program.programType } : {}),
    ...(program.credential ? { educationalCredentialAwarded: program.credential } : {}),
    ...(program.startDate ? { startDate: program.startDate } : {}),
    ...(image ? { image } : {}),
  };
}

export function toGraph(nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function organizationSchema(): JsonLdNode {
  const { latitude, longitude } = appConfig.geo;
  return {
    // Kèm LocalBusiness để Google hiểu đây là cơ sở có địa chỉ thật (tìm kiếm theo khu vực)
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ORGANIZATION_ID,
    name: appConfig.legalName,
    // Tên gọi khác người dùng hay tìm — kèm mô tả có địa chỉ, năm và quyết định thành lập
    // để phân biệt với các đơn vị cùng chữ "Nhân Lực Quốc Tế"
    alternateName: [
      ...new Set([
        `${appConfig.legalName} TPHCM`,
        appConfig.name,
        "Trường Trung cấp nghề Nhân Lực Quốc Tế",
        "Trung cấp nghề Nhân Lực Quốc Tế",
        "Trường trung cấp nghề SIM",
        "Trường Nhân Lực Quốc Tế TPHCM",
      ]),
    ],
    description: `Trường trung cấp nghề đào tạo hệ trung cấp và sơ cấp tại ${appConfig.address}, thành lập năm ${appConfig.foundingYear} theo ${appConfig.foundingDecision}.`,
    foundingDate: appConfig.foundingYear,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(appConfig.logo),
      width: LOGO_SIZE,
      height: LOGO_SIZE,
    },
    image: absoluteUrl(appConfig.defaultOgImage),
    telephone: appConfig.phoneE164,
    email: appConfig.email,
    address: { "@type": "PostalAddress", ...appConfig.postalAddress },
    hasMap: appConfig.mapLink,
    ...(latitude && longitude ? { geo: { "@type": "GeoCoordinates", latitude, longitude } } : {}),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: appConfig.openingHours.days,
      opens: appConfig.openingHours.opens,
      closes: appConfig.openingHours.closes,
    },
    sameAs: [appConfig.zalo, ...Object.values(appConfig.officialProfiles)].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "admissions",
      telephone: appConfig.phoneE164,
      email: appConfig.email,
      areaServed: "VN",
      availableLanguage: "vi",
    },
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: appConfig.legalName,
    alternateName: appConfig.name,
    inLanguage: "vi",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Breadcrumb luôn bắt đầu từ Trang chủ */
export function breadcrumbSchema(crumbs: Crumb[]): JsonLdNode {
  const items = [{ name: "Trang chủ", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  };
}

export function webPageSchema(type: string, path: string, name: string, description: string): JsonLdNode {
  return {
    "@type": type,
    "@id": `${canonicalUrl(path)}#webpage`,
    url: canonicalUrl(path),
    name,
    description,
    inLanguage: "vi",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
  };
}

export function courseSchema(course: ListedCourse, image?: string): JsonLdNode {
  return {
    "@type": "Course",
    name: course.name,
    description: course.description,
    url: canonicalUrl(course.path),
    inLanguage: "vi",
    provider: { "@id": ORGANIZATION_ID },
    ...(image ? { image } : {}),
  };
}

/** Danh sách ngành (Google "Course list"): ItemList các Course đầy đủ */
export function courseListSchema(courses: ListedCourse[]): JsonLdNode {
  return {
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: courseSchema(course),
    })),
  };
}

/** Danh sách bài viết trên trang tin: ItemList chỉ gồm URL (Google "summary page" carousel) */
export function linkListSchema(links: { name: string; path: string }[]): JsonLdNode {
  return {
    "@type": "ItemList",
    itemListElement: links.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.name,
      url: canonicalUrl(link.path),
    })),
  };
}

export interface ArticleInput {
  path: string;
  headline: string;
  description: string;
  image: string;
  datePublished?: string;
  dateModified?: string;
}

export function articleSchema(article: ArticleInput): JsonLdNode {
  return {
    "@type": "Article",
    "@id": `${canonicalUrl(article.path)}#article`,
    headline: article.headline,
    description: article.description,
    image: [article.image],
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: "vi",
    mainEntityOfPage: canonicalUrl(article.path),
    author: organizationRef(),
    publisher: organizationRef(),
  };
}

interface StaticPageSchema {
  type: string;
  crumb?: string;
}

// Loại WebPage + tên breadcrumb cho từng trang tĩnh (trang chủ không có breadcrumb)
const STATIC_PAGE_SCHEMA: Record<string, StaticPageSchema> = {
  "/": { type: "WebPage" },
  "/gioi-thieu": { type: "AboutPage", crumb: "Giới thiệu" },
  "/nganh-dao-tao": { type: "CollectionPage", crumb: "Ngành đào tạo" },
  "/du-hoc": { type: "WebPage", crumb: "Du học" },
  "/tuyen-sinh": { type: "WebPage", crumb: "Tuyển sinh" },
  "/hoc-phi": { type: "WebPage", crumb: "Học phí" },
  "/hop-tac-doanh-nghiep": { type: "WebPage", crumb: "Hợp tác doanh nghiệp" },
  "/hoat-dong-hoc-vien": { type: "WebPage", crumb: "Hoạt động học viên" },
  "/hinh-anh": { type: "CollectionPage", crumb: "Hình ảnh" },
  "/tra-cuu-van-bang": { type: "WebPage", crumb: "Tra cứu văn bằng" },
  "/tin-tuc": { type: "CollectionPage", crumb: "Tin tức" },
  "/lien-he": { type: "ContactPage", crumb: "Liên hệ" },
  "/cau-hoi-thuong-gap": { type: "FAQPage", crumb: "Câu hỏi thường gặp" },
  "/cam-nang": { type: "CollectionPage", crumb: "Cẩm nang tuyển sinh" },
  "/cong-khai": { type: "WebPage", crumb: "Công khai thông tin" },
  "/chinh-sach-bao-mat": { type: "WebPage", crumb: "Chính sách bảo vệ dữ liệu cá nhân" },
  "/tim-kiem": { type: "SearchResultsPage", crumb: "Tìm kiếm" },
};

/** pageExtra: thuộc tính thêm vào node trang (vd mainEntity của FAQPage) */
export function staticPageNodes(
  path: string,
  name: string,
  description: string,
  pageExtra: JsonLdNode = {}
): JsonLdNode[] {
  const config = STATIC_PAGE_SCHEMA[path] ?? { type: "WebPage" };
  return [
    organizationSchema(),
    websiteSchema(),
    { ...webPageSchema(config.type, path, name, description), ...pageExtra },
    ...(config.crumb ? [breadcrumbSchema([{ name: config.crumb, path }])] : []),
  ];
}
