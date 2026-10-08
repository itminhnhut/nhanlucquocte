import path from "path";
import { loadContent, resolveApiUrl } from "./content";
import { writeFileAtomic, writePages } from "./pages";
import { buildSitemap } from "./sitemap";
import { notifyIndexNow } from "./indexNow";

function logResult(label, result) {
  console.log(
    `✅ ${label}: ${result.programCount} chương trình, ${result.newsCount} tin tức` +
      (result.pageCount !== undefined ? `, ${result.pageCount} trang HTML` : "") +
      (result.isComplete ? "" : " (⚠️  API lỗi — dữ liệu thiếu)")
  );
}

/** Build time: chỉ tạo sitemap (HTML tạo lúc container start vì cần window.__ENV__ do docker/env.sh chèn) */
export async function generateSitemapFile(outputPath, env) {
  const content = await loadContent(resolveApiUrl(env));
  writeFileAtomic(outputPath, buildSitemap(content));
  const result = {
    programCount: content.programs.length,
    newsCount: content.news.length,
    isComplete: content.isComplete,
  };
  logResult(`Sitemap → ${outputPath}`, result);
  return result;
}

/**
 * Runtime: sitemap.xml + HTML từng trang trong thư mục web.
 * API lỗi → giữ sitemap cũ, chỉ ghi lại trang tĩnh.
 */
export async function generateSeoFiles(rootDir, env) {
  const content = await loadContent(resolveApiUrl(env));
  if (content.isComplete) {
    writeFileAtomic(path.join(rootDir, "sitemap.xml"), buildSitemap(content));
  }
  const { pageCount, changedPaths } = writePages(rootDir, content);
  // Chỉ báo IndexNow khi dữ liệu API đầy đủ (API lỗi → trang cũ được giữ, không có gì mới)
  if (content.isComplete) await notifyIndexNow(changedPaths);
  const result = {
    programCount: content.programs.length,
    newsCount: content.news.length,
    pageCount,
    isComplete: content.isComplete,
  };
  logResult(`SEO files → ${rootDir}`, result);
  return result;
}
