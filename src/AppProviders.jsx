import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

// Provider chung cho trình duyệt (main.jsx) và server tạo HTML sẵn (ssr/renderPage.jsx):
// cây component 2 bên phải giống nhau thì React mới hydrate được.
function AppProviders({ queryClient, helmetContext, children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider context={helmetContext}>{children}</HelmetProvider>
    </QueryClientProvider>
  );
}

export function createQueryClient() {
  return new QueryClient();
}

export default AppProviders;
