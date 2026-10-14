// Khai báo kiểu cho những thứ chạy ngoài React: biến toàn cục do script bên thứ ba hay
// docker/env.sh đặt vào `window`, và thuộc tính HTML mà @types/react chưa biết.
// Có file này thì `tsc --noEmit` mới soi được cả file .js/.jsx (checkJs trong tsconfig.json).

declare global {
  interface Window {
    /** Env chèn lúc container khởi động (docker/env.sh) — xem src/configs/env.ts */
    __ENV__?: Record<string, string>;
    /** Google Analytics 4, chỉ có sau khi người dùng bấm "Đồng ý" ở banner cookie */
    gtag?: (...args: unknown[]) => void;
    /** Microsoft Clarity, cũng chỉ nạp sau khi đồng ý; bị chặn ở /tra-cuu-van-bang */
    clarity?: (...args: unknown[]) => void;
    /** Hàm nạp analytics, khai inline trong index.html để không chạy trước khi đồng ý */
    __nlqtLoadAnalytics?: (options?: { sessionRecording?: boolean }) => void;
  }
}

declare module "react" {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    /**
     * Viết thường chủ ý. React 18 không biết `fetchPriority` (camelCase) nên sẽ cảnh báo
     * "React does not recognize the prop"; còn thuộc tính toàn chữ thường thì React cho đi
     * thẳng ra DOM đúng như trình duyệt cần. @types/react ở đây là bản 19 nên nó chỉ biết
     * camelCase — khai lại ở đây để giữ hành vi đúng cho React 18.
     */
    fetchpriority?: "high" | "low" | "auto";
  }
}

export {};
