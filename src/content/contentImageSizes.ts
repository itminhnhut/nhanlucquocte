// Kích thước thật của ảnh trong bài CMS, đo trực tiếp từ file trên máy chủ của trường ngày
// 09/10/2026. Dùng để điền width/height cho thẻ <img>: trình duyệt biết trước tỉ lệ nên chừa đúng
// chỗ, ảnh tải xong không đẩy chữ xuống (CLS). CSS vẫn co ảnh theo bề ngang, các số này chỉ là tỉ lệ.
//
// Khoá là đường dẫn của ảnh (bỏ tên miền). Ảnh nào không có trong bảng thì để nguyên, không đoán:
// đoán sai tỉ lệ còn làm xê dịch nhiều hơn là không khai.
// Thêm ảnh mới: đo bằng `node -e` hoặc mở ảnh xem kích thước, rồi thêm một dòng vào đây.
export interface ImageSize {
  width: number;
  height: number;
}

export const CONTENT_IMAGE_SIZES: Readonly<Record<string, ImageSize>> = {
  "/img_data/images/1_1.%5B1%5D.png": { width: 1024, height: 768 },
  "/img_data/images/1_1.%5B12%5D.jpg": { width: 321, height: 271 },
  "/img_data/images/2_1.jpg": { width: 1024, height: 598 },
  "/img_data/images/2_1.png": { width: 407, height: 351 },
  "/img_data/images/3-jpg.png": { width: 1024, height: 768 },
  "/img_data/images/3_1.png": { width: 412, height: 340 },
  "/img_data/images/3c.png": { width: 695, height: 908 },
  "/img_data/images/4.png": { width: 825, height: 324 },
  "/img_data/images/bep_banh.jpg": { width: 905, height: 1280 },
  "/img_data/images/hm2.jpg": { width: 2048, height: 1536 },
  "/img_data/images/hm2.png": { width: 2048, height: 1152 },
  "/img_data/images/tieng_han_2.png": { width: 1280, height: 960 },
  "/img_data/images/tieng_han_3.png": { width: 2048, height: 1152 },
  "/img_data/images/vf3.jpg": { width: 1251, height: 762 },
  "/img_data/images/xe_vf_1.jpg": { width: 1437, height: 752 },
};
