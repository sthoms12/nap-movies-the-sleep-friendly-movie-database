import { Link, useLocation } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

function normalize(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname || '/';
}

const links = [
  { to: '/', label: 'Home', isActive: (path: string) => path === '/' },
  {
    to: '/movies-to-fall-asleep-to/',
    label: 'Guides',
    isActive: (path: string) => path === '/movies-to-fall-asleep-to' || path === '/quiet-movies-for-bedtime' || path === '/comfort-movies-for-sleep',
  },
  { to: '/criteria/', label: 'Criteria', isActive: (path: string) => path === '/criteria' },
];

export function Navbar() {
  const path = normalize(useLocation().pathname);

  return (
    <nav className="sticky top-0 z-40 border-b border-retro-muted/30 bg-retro-bg/90 py-1 backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-1 sm:flex-row">
          <Link to="/" className="tap-target group gap-3">
            <span className="border border-retro-accent/20 p-1 transition-colors group-hover:border-retro-accent/60">
              <Moon className="h-4 w-4 text-retro-accent transition-transform duration-slow group-hover:scale-110" />
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] transition-colors group-hover:text-white">
              Nap<span className="text-retro-accent">Movies</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center justify-center">
            {links.map((link) => {
              const active = link.isActive(path);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'tap-target text-[11px] font-black uppercase tracking-[0.18em] transition-colors hover:text-retro-accent',
                    active ? 'border-b border-retro-accent/50 text-retro-accent' : 'text-retro-text',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
