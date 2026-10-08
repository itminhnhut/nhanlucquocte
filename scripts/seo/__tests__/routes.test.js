import test from "node:test";
import assert from "node:assert/strict";
import { routes } from "../../../src/routes";
import { clientRoutes } from "../../../src/routes.client";

const childKeys = (tree) => tree[0].children.map((route) => (route.index ? "(index)" : route.path));

test("should keep server and client route trees on the same paths", () => {
  assert.deepEqual(childKeys(clientRoutes), childKeys(routes));
});

test("should lazy-load every client page", () => {
  // Route chuyển hướng URL cũ (element LegacyRedirect nhỏ) không cần tách chunk
  clientRoutes[0].children.filter((route) => !route.element).forEach((route) => {
    assert.equal(typeof route.lazy, "function", `${route.path ?? "(index)"} should be lazy`);
  });
});

test("should redirect every legacy .html URL of the old website", async () => {
  const { LEGACY_PATHS, LEGACY_PROGRAM_PATHS } = await import("../../../src/configs/legacyPaths");
  const { legacyTarget } = await import("../../../src/components/LegacyRedirect");
  const { PROGRAM_NAMES } = await import("../../../src/content/programFields");
  const paths = childKeys(clientRoutes);

  Object.entries(LEGACY_PATHS).forEach(([legacy, current]) => {
    assert.ok(paths.includes(legacy), legacy);
    assert.ok(current === "" || paths.some((p) => p === current || p.startsWith(`${current}/`)), current);
    assert.equal(legacyTarget(`/${legacy}`), `/${current}`);
  });

  // Mỗi bài ngành cũ phải trỏ tới 1 ngành có trong danh mục
  Object.entries(LEGACY_PROGRAM_PATHS).forEach(([legacy, slug]) => {
    assert.ok(paths.includes(legacy), legacy);
    assert.ok(PROGRAM_NAMES[slug], `${legacy} → ${slug}`);
    assert.match(legacyTarget(`/${legacy}`), /^\/nganh-dao-tao/);
  });
});

test("should mirror every legacy redirect in the nginx config", async () => {
  const fs = await import("fs");
  const { LEGACY_PATHS, LEGACY_PROGRAM_PATHS } = await import("../../../src/configs/legacyPaths");
  const conf = fs.readFileSync("docker/nginx.conf", "utf8");

  [...Object.keys(LEGACY_PATHS), ...Object.keys(LEGACY_PROGRAM_PATHS)].forEach((legacy) => {
    assert.ok(conf.includes(`^/${legacy.replace(".html", "\\.html")}$`), legacy);
  });
});
