// Đếm số request API đang chờ để thanh tiến trình (TopProgressBar) biết khi nào
// trang đang tải dữ liệu. https.ts gọi start/end qua interceptor.
type Listener = (pendingCount: number) => void;

let pendingCount = 0;
const listeners = new Set<Listener>();

function notify(): void {
  listeners.forEach((listener) => listener(pendingCount));
}

export function trackRequestStart(): void {
  pendingCount += 1;
  notify();
}

export function trackRequestEnd(): void {
  pendingCount = Math.max(0, pendingCount - 1);
  notify();
}

export function getPendingRequestCount(): number {
  return pendingCount;
}

export function subscribePendingRequests(listener: Listener): () => void {
  listeners.add(listener);
  listener(pendingCount);
  return () => {
    listeners.delete(listener);
  };
}
