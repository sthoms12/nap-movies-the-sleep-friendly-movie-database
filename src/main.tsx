import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { CriteriaPage } from '@/pages/CriteriaPage'
import { GuidePage } from '@/pages/GuidePage'
import { guideBySlug } from '@/content/guides'

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
  {
    path: "/movies-to-fall-asleep-to",
    element: <GuidePage guide={guideBySlug['movies-to-fall-asleep-to']} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/quiet-movies-for-bedtime",
    element: <GuidePage guide={guideBySlug['quiet-movies-for-bedtime']} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/comfort-movies-for-sleep",
    element: <GuidePage guide={guideBySlug['comfort-movies-for-sleep']} />,
    errorElement: <RouteErrorBoundary />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
