import { useEffect, useState } from "react";
import http from "../utils/https";
import { initialDataKeys, useInitialData } from "../data/initialData";
import { useIsHydrated } from "./useIsHydrated";

// Danh sách ngành cho /nganh-dao-tao và /tuyen-sinh. HTML tạo sẵn đã có danh sách → hiện ngay,
// rồi gọi API ngầm lấy bản mới nhất. `now`: lần render đầu dùng thời điểm tạo HTML (nhãn khai
// giảng khớp khi hydrate), sau đó dùng giờ thật.
export function usePrograms() {
  const initialPrograms = useInitialData(initialDataKeys.programs);
  const renderedAt = useInitialData(initialDataKeys.renderedAt);
  const isHydrated = useIsHydrated();
  const now = !isHydrated && renderedAt ? new Date(renderedAt) : new Date();
  const [programs, setPrograms] = useState(initialPrograms ?? []);
  const [loading, setLoading] = useState(!initialPrograms);
  const [error, setError] = useState("");

  useEffect(() => {
    // Đã có dữ liệu nhúng sẵn → cập nhật ngầm: không hiện khung chờ, lỗi thì giữ bản đang hiện
    const isBackgroundRefresh = Boolean(initialPrograms);
    const fetchPrograms = async () => {
      try {
        if (!isBackgroundRefresh) {
          setLoading(true);
          setError("");
        }

        const res = await http.get("client/programs");

        const items = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setPrograms(items);
      } catch (err) {
        console.error("Error fetching client programs:", err);
        if (isBackgroundRefresh) return;
        setError(
          "Không tải được danh sách ngành đào tạo. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return { programs, loading, error, now };
}
