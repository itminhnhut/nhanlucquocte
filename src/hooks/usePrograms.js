import { useEffect, useState } from "react";
import http from "../utils/https";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { useIsHydrated } from "./useIsHydrated";
import { whenIdle } from "../utils/whenIdle";

// Danh sách ngành cho trang chủ, /nganh-dao-tao và /tuyen-sinh. HTML tạo sẵn đã có danh sách
// → hiện ngay, rồi gọi API lúc trình duyệt rảnh để lấy bản mới nhất. `now`: lần render đầu
// dùng thời điểm tạo HTML (nhãn khai giảng khớp khi hydrate), sau đó dùng giờ thật.
/**
 * Một lần gọi dùng chung cho mọi component trên cùng trang.
 *
 * Trang chủ có hai chỗ cần danh sách ngành: khối "Chương trình đào tạo" và ô chọn ngành trong
 * form đăng ký. Mỗi chỗ tự gọi là tải client/programs hai lần — 254 KB nhân đôi. Gộp lại:
 * request đang bay thì dùng chung, vừa xong thì dùng bản vừa lấy trong một phút.
 */
const CACHE_MS = 60_000;
let inFlight = null;
let cached = null;
let cachedAt = 0;

function fetchProgramsOnce() {
  if (cached && Date.now() - cachedAt < CACHE_MS) return Promise.resolve(cached);
  if (!inFlight) {
    inFlight = http
      .get("client/programs")
      .then((res) => {
        // Hợp đồng API: thân phản hồi là { data, meta } và `data` là mảng (API_DOCS mục 1)
        cached = Array.isArray(res.data) ? res.data : [];
        cachedAt = Date.now();
        return cached;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export function usePrograms() {
  const initialPrograms = useInitialData(initialDataKeys.programs);
  const renderedAt = useInitialData(initialDataKeys.renderedAt);
  const isHydrated = useIsHydrated();
  const now = !isHydrated && renderedAt ? new Date(renderedAt) : new Date();
  const [programs, setPrograms] = useState(initialPrograms ?? []);
  const [loading, setLoading] = useState(!initialPrograms?.length);
  const [error, setError] = useState("");

  useEffect(() => {
    // Có dữ liệu nhúng rồi thì vẫn PHẢI gọi API, chỉ là gọi ngầm.
    //
    // HTML tạo sẵn chỉ được dựng lại lúc container khởi động và khi admin gọi /sitemap/refresh
    // sau mỗi lần lưu. Móc refresh đó gửi `mode: "no-cors"` fire-and-forget nên admin KHÔNG
    // biết nó có tới đích hay không: URL trống hay sai key đều thất bại im lặng. Nếu trang
    // không tự gọi API thì đúng lúc đó nhân viên sửa trong admin mà website không bao giờ đổi.
    // Thà tốn băng thông còn hơn hiện sai nội dung.
    //
    // Phải xét ĐỘ DÀI chứ không xét truthy: mảng rỗng cũng là truthy, mà HTML tạo sẵn có thể
    // nhúng programs: [] (API trả rỗng, mọi ngành active=false, hoặc BE đổi tên trường slug
    // làm bộ lọc loại sạch) — lúc đó phải gọi API và hiện khung chờ như lần đầu.
    const isBackgroundRefresh = Boolean(initialPrograms?.length);

    let alive = true;
    const fetchPrograms = async () => {
      try {
        // Cập nhật ngầm: không hiện khung chờ, lỗi thì giữ nguyên bản đang hiện
        if (!isBackgroundRefresh) {
          setLoading(true);
          setError("");
        }

        const items = await fetchProgramsOnce();
        if (!alive) return;

        setPrograms(items);
      } catch (err) {
        console.error("Error fetching client programs:", err);
        if (!alive || isBackgroundRefresh) return;
        setError(
          "Không tải được danh sách ngành đào tạo. Vui lòng thử lại sau."
        );
      } finally {
        if (alive) setLoading(false);
      }
    };

    // Chưa có gì để hiện → gọi ngay. Đã có dữ liệu nhúng → chờ trình duyệt rảnh, để 254 KB
    // này không tranh băng thông với phần hiển thị đầu tiên (LCP).
    if (!isBackgroundRefresh) {
      fetchPrograms();
      return () => {
        alive = false;
      };
    }
    const cancelIdle = whenIdle(fetchPrograms);
    return () => {
      alive = false;
      if (typeof cancelIdle === "function") cancelIdle();
    };
  }, [initialPrograms]);

  return { programs, loading, error, now };
}
