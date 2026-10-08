# Education Landing Frontend

Vite + React marketing site that consumes the backend at `https://daynghevietuc-api.7yfavr.easypanel.host/api/`.

## Setup

```bash
npm install
cp .env.example .env   # or create .env manually
npm run dev
```

`.env` needs:

```
VITE_API_URL=https://daynghevietuc-api.7yfavr.easypanel.host/api/
```

## Build & Preview

```bash
npm run build                # outputs dist/ and refreshes sitemap
npm run preview              # serve dist/ locally (default 4173)
```

## PM2 Deployment (Port 4001)

1. Build the site with the correct API endpoint baked in:
   ```bash
   npm run build
   ```
2. Start it under PM2 (defined in `ecosystem.frontend.config.cjs`):
   ```bash
   npm run start:pm2
   # uses: pm2 start ecosystem.frontend.config.cjs --env production
   ```
3. Common management commands:
   ```bash
   pm2 logs education-frontend
   pm2 restart education-frontend
   pm2 save                      # optional: persist processes
   ```

`ecosystem.frontend.config.cjs` runs `npm run preview -- --host 0.0.0.0 --port 4001`, so browse to `http://<server-ip>:4001` while the API stays on its own host/port.

## SEO: HTML tạo sẵn, sitemap, IndexNow (Docker / EasyPanel)

Khi container khởi động, `docker/env.sh` chạy server nội bộ (`scripts/sitemap-server.js`) để tạo
`sitemap.xml` và HTML render sẵn cho từng trang (có nội dung cho Google/ChatGPT đọc được).
Có bài/ngành mới trong admin → mở `https://vietuchcm.edu.vn/sitemap/refresh?key=<SITEMAP_KEY>`.

Biến môi trường:

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `VITE_API_URL` | có | API backend |
| `SITEMAP_KEY` | nên có | Khoá cho link `/sitemap/refresh` (không có → tắt link refresh) |

IndexNow (báo Bing ngay khi trang mới/đổi nội dung) bật sẵn, không cần cấu hình:

- Key nằm ở `src/configs/appConfig.ts` (`indexNowKey`), file xác minh `public/<key>.txt` có sẵn trong bản build.
  Key IndexNow là công khai theo thiết kế giao thức, không phải bí mật. Đổi key → đổi luôn tên + nội dung file.
- Mỗi lần tạo lại HTML, server chỉ gửi các URL có nội dung thay đổi.
- Kiểm tra sau deploy: `curl https://vietuchcm.edu.vn/<key>.txt` trả đúng key; `docker logs` có dòng
  `✅ IndexNow: đã báo … URL`. Bing Webmaster Tools → IndexNow hiển thị URL đã nhận sau vài giờ.

## Quét SEO

```bash
npm run audit:seo -- https://vietuchcm.edu.vn             # site thật
npm run audit:seo -- http://localhost:8088 bao-cao.md     # bản build chạy qua nginx
```

Quét như Googlebot: robots.txt, sitemap, từng trang (title, description, canonical, H1, từ khoá
trong `src/seo/keywords.ts`, số chữ, ảnh, link nội bộ, schema, Open Graph), trang mồ côi, tranh từ
khoá. Xuất báo cáo Markdown (mặc định `seo-audit-report.md`). Kết quả gần nhất: `docs/seo-audit-2026-09-24.md`.
