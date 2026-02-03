import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Moon } from 'lucide-react';
export function Navbar() {
  const location = useLocation();
  const links = [
    { href: '/', label: 'ARCHIVE' },
    { href: '/submit', label: 'PROPOSE' },
  ];
  return (
    <nav className="border-b border-retro-muted/10 py-5 sticky top-0 bg-retro-bg/60 backdrop-blur-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <Moon className="w-4 h-4 text-retro-accent group-hover:scale-110 transition-transform duration-slow" />
            <span className="font-bold tracking-widest uppercase text-sm opacity-90 group-hover:opacity-100">
              Nap<span className="text-retro-accent/70">Movies</span>
            </span>
          </Link>
          <div className="flex gap-10 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-[10px] font-bold tracking-[0.2em] transition-all uppercase",
                  location.pathname === link.href
                    ? "text-retro-accent"
                    : "text-retro-text/40 hover:text-retro-accent/60"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-[9px] opacity-10 hover:opacity-40 transition-opacity uppercase tracking-widest ml-4"
            >
              /ADMIN
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}