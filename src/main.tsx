import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { CriteriaPage } from '@/pages/CriteriaPage'
import { Toaster } from 'sonner';
/**
 * DEPLOYMENT GUARD: ARCHIVE_SYNC_1.0.1
 * Forces a hard reload if the user is visiting from a legacy bundle state.
 */
const CURRENT_ARCHIVE_VERSION = '1.0.1';
const storedVersion = localStorage.getItem('nap_archive_version');
if (storedVersion !== CURRENT_ARCHIVE_VERSION) {
  localStorage.setItem('nap_archive_version', CURRENT_ARCHIVE_VERSION);
  // Perform hard refresh to clear potential stale bundle fragments
  window.location.reload();
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/criteria",
    element: <CriteriaPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
        <Toaster theme="dark" position="bottom-center" />
    </QueryClientProvider>
  </StrictMode>,
)