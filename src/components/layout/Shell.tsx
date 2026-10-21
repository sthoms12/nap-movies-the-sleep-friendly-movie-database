import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { SiteFooter } from '@/components/layout/SiteFooter';

export function Shell() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background font-mono text-foreground">
      <div className="crt-overlay" />
      <Navbar />
      <Suspense fallback={<p className="flex-1 px-4 py-16 text-center text-sm text-retro-text">Loading this page.</p>}>
        <Outlet />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
