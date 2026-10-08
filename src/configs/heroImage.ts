// Ảnh nền banner trang chủ (KHÔNG có chữ — chữ là HTML đè lên, xem HeroSection).
// Dùng chung cho <picture> và thẻ preload trong HTML tạo sẵn: srcset/sizes phải khớp nhau,
// nếu không trình duyệt tải 2 lần.
const HERO_DIR = "/images/sections/hero/banner-nen";
const HERO_DIR_MOBILE = "/images/sections/hero/banner-nen-mobile";

/** Bản ngang cho máy tính/tablet */
export const HERO_IMAGE = {
  src: `${HERO_DIR}_1200.webp`,
  srcSet: [800, 1200, 2000].map((width) => `${HERO_DIR}_${width}.webp ${width}w`).join(", "),
  sizes: "(max-width: 1280px) 100vw, 1280px",
};

/** Bản dọc hơn cho điện thoại: ảnh ít bị cắt, chữ dễ đọc */
export const HERO_IMAGE_MOBILE = {
  src: `${HERO_DIR_MOBILE}_800.webp`,
  srcSet: [400, 800].map((width) => `${HERO_DIR_MOBILE}_${width}.webp ${width}w`).join(", "),
  sizes: "100vw",
};
