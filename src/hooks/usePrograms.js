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
  const [loading, setLoading] = useState(!initialPrograms?.length);
  const [error, setError] = useState("");

  useEffect(() => {
    // Đã có dữ liệu nhúng trong HTML tạo sẵn → KHÔNG gọi lại API.
    //
    // Trước đây vẫn gọi để "cập nhật ngầm", nhưng client/programs trả kèm cả `content` HTML của
    // 26 ngành: đo thật 254 KB mỗi lần vào trang chủ, /nganh-dao-tao và /tuyen-sinh — trong khi
    // danh sách cần hiển thị đã nằm sẵn trong trang. Ở mạng chậm đó là ~12 giây băng thông đổi
    // lấy dữ liệu mới hơn vài phút. HTML tạo sẵn vốn được dựng lại lúc container khởi động và
    // mỗi lần gọi /sitemap/refresh, nên độ cũ đã có giới hạn.
    // Phải xét ĐỘ DÀI, không xét truthy: mảng rỗng cũng là truthy. HTML tạo sẵn có thể nhúng
    // programs: [] (API trả rỗng, hoặc mọi ngành active=false, hoặc BE đổi tên trường slug làm
    // toPublishableItems lọc sạch) — khi đó bỏ gọi API là trang nằm im với câu "chưa có ngành
    // đào tạo nào", không khung chờ, không báo lỗi, cho tới khi container khởi động lại.
    if (initialPrograms?.length) return undefined;

    let alive = true;
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await http.get("client/programs");
        if (!alive) return;

        // Hợp đồng API: thân phản hồi luôn là { data, meta } và `data` là mảng (API_DOCS mục 1).
        // Nhánh res.data.data là tàn dư thời dùng dữ liệu giả lập — đã kiểm 3 endpoint thật,
        // không cái nào lồng hai lớp.
        const items = Array.isArray(res.data) ? res.data : [];

        setPrograms(items);
      } catch (err) {
        console.error("Error fetching client programs:", err);
        if (!alive) return;
        setError(
          "Không tải được danh sách ngành đào tạo. Vui lòng thử lại sau."
        );
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchPrograms();
    return () => {
      alive = false;
    };
  }, [initialPrograms]);

  return { programs, loading, error, now };
}
