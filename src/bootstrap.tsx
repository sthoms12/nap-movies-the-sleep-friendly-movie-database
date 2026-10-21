import { StrictMode, type ComponentType } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppRoutes, type AppPages } from '@/AppRoutes';
import { NotFoundPage } from '@/pages/NotFoundPage';
import '@/index.css';

export function mount(pages: Omit<AppPages, 'NotFound'> & { NotFound?: ComponentType }) {
  const root = document.getElementById('root');
  if (!root) return;

  const tree = (
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes pages={{ NotFound: NotFoundPage, ...pages }} />
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  );

  if (root.dataset.ssr === 'true') hydrateRoot(root, tree);
  else createRoot(root).render(tree);
}
