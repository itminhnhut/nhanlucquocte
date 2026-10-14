// Kích thước thật của ảnh trong bài, đo trực tiếp từ file trên bucket lưu ảnh của trường
// (truongdaynghe-rustfs…), ngày 14/10/2026. Bảng cũ trỏ /img_data/ đã bỏ: backend chuyển hết ảnh
// sang bucket khi nhập dữ liệu, không trang nào còn trỏ tới đường dẫn cũ.
//
// Dùng để điền width/height cho thẻ <img>: trình duyệt biết trước tỉ lệ nên chừa đúng chỗ, ảnh tải
// xong không đẩy chữ xuống (CLS). CSS vẫn co ảnh theo bề ngang, các số này chỉ là tỉ lệ.
//
// Khoá là đường dẫn của ảnh (bỏ tên miền). Ảnh nào không có trong bảng thì để nguyên, không đoán:
// đoán sai tỉ lệ còn làm xê dịch nhiều hơn là không khai.
// Bảng này chỉ vá cho ảnh ĐÃ nhập. Ảnh đăng mới về sau cần trang quản trị ghi sẵn width/height
// vào thẻ <img> — API đã trả hai số đó trong phản hồi POST /admin/uploads.
export interface ImageSize {
  width: number;
  height: number;
}

export const CONTENT_IMAGE_SIZES: Readonly<Record<string, ImageSize>> = {
  "/cdn/uploads/legacy/14bc7e8d10012427c5bc3a7e.png": { width: 412, height: 340 },
  "/cdn/uploads/legacy/1dc0eff0fef6de21efe9875b.jpg": { width: 2048, height: 1536 },
  "/cdn/uploads/legacy/2241afb3c2b4796814980489.jpg": { width: 2560, height: 1704 },
  "/cdn/uploads/legacy/28b755e825ce6793f238a06c.png": { width: 1024, height: 768 },
  "/cdn/uploads/legacy/29f60216aa99ca2f93a3f27c.jpg": { width: 321, height: 271 },
  "/cdn/uploads/legacy/2e73c8eebc8401b26dee9f5f.jpg": { width: 600, height: 400 },
  "/cdn/uploads/legacy/30bdad714e24c8d239468c8f.jpg": { width: 800, height: 1200 },
  "/cdn/uploads/legacy/31519fc48f0f9b9058a49986.jpg": { width: 275, height: 183 },
  "/cdn/uploads/legacy/361e5a260308e98c4da5a749.jpg": { width: 275, height: 183 },
  "/cdn/uploads/legacy/3b473970fe8c2c5039c744fa.jpg": { width: 1024, height: 598 },
  "/cdn/uploads/legacy/4bcb32b8be087f5663738f45.jpg": { width: 1251, height: 762 },
  "/cdn/uploads/legacy/4e0c04b8b379a8cab73c89e1.jpg": { width: 299, height: 168 },
  "/cdn/uploads/legacy/70ca70892e92e393b8fb400c.jpg": { width: 905, height: 1280 },
  "/cdn/uploads/legacy/73dec2ab2838aa2e79c2648a.png": { width: 464, height: 316 },
  "/cdn/uploads/legacy/74f299697ec07e103750c773.png": { width: 1280, height: 960 },
  "/cdn/uploads/legacy/76e3ee44a8b5bb4991d11679.jpg": { width: 275, height: 183 },
  "/cdn/uploads/legacy/7780547c6905eefe653d9563.webp": { width: 1920, height: 1080 },
  "/cdn/uploads/legacy/7c645e015dcb0094d18a5d83.jpg": { width: 230, height: 219 },
  "/cdn/uploads/legacy/84929b429531cb9ed39e1dc2.jpg": { width: 259, height: 194 },
  "/cdn/uploads/legacy/8f420849b62865441a09116a.jpg": { width: 275, height: 183 },
  "/cdn/uploads/legacy/91d93abeb69a5290b99d2c27.jpg": { width: 208, height: 148 },
  "/cdn/uploads/legacy/a3f17dc7fa15c43a7a2c5fc7.png": { width: 825, height: 324 },
  "/cdn/uploads/legacy/b72af5acaa667570d605ea0d.jpg": { width: 1437, height: 752 },
  "/cdn/uploads/legacy/beb412242c58c42b90fe2ee4.jpg": { width: 311, height: 162 },
  "/cdn/uploads/legacy/c5c73c8844d00ff39aba06da.png": { width: 2048, height: 1152 },
  "/cdn/uploads/legacy/ce2a7c8b4bb93bfa4747a971.png": { width: 407, height: 351 },
  "/cdn/uploads/legacy/d0bb79f4c762340663ad8930.png": { width: 1024, height: 768 },
  "/cdn/uploads/legacy/dc83983f8b2b88c275bee436.png": { width: 650, height: 405 },
  "/cdn/uploads/legacy/dd656158f8e2db3d427e5f72.jpg": { width: 275, height: 183 },
  "/cdn/uploads/legacy/e252f9dd02217dfe07159f67.jpg": { width: 275, height: 183 },
  "/cdn/uploads/legacy/f461d979dcc69d5957d3c508.jpg": { width: 284, height: 177 },
  "/cdn/uploads/legacy/f504e99c75e06e12ee7d4c4a.png": { width: 2048, height: 1152 },
  "/cdn/uploads/legacy/f67bae4f99c0912314ae9fab.webp": { width: 601, height: 396 },
  "/cdn/uploads/legacy/fa6917ed5117a58b453902b2.png": { width: 695, height: 908 },
  "/cdn/uploads/legacy/fc5109077e7da2221f4710b7.jpg": { width: 329, height: 153 },
};
