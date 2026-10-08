// CLI quét SEO: node dist-server/seo-audit.cjs <url> [file-báo-cáo.md]
//   npm run audit:seo -- https://trungcapnhanlucquocte.vn
//   npm run audit:seo -- http://localhost:8088 bao-cao-seo.md
import fs from "fs";
import { crawl, toMarkdown } from "./seo/audit";

const [baseUrl = "https://trungcapnhanlucquocte.vn", output = "seo-audit-report.md"] = process.argv.slice(2);

crawl(baseUrl)
  .then((report) => {
    const markdown = toMarkdown(report);
    fs.writeFileSync(output, markdown);
    const issues = [...report.siteIssues, ...report.pages.flatMap((page) => page.result.issues)];
    const by = (level) => issues.filter((item) => item.level === level).length;
    console.log(`✅ Đã quét ${report.pages.length} trang → ${output}`);
    console.log(`   Lỗi: ${by("error")} · Cảnh báo: ${by("warn")} · Gợi ý: ${by("info")}`);
  })
  .catch((err) => {
    console.error("❌ Quét thất bại:", err.message);
    process.exitCode = 1;
  });
