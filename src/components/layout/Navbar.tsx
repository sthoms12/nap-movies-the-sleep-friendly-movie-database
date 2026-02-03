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
    <nav className="border-b border-retro-muted/30 py-6 sticky top-0 bg-retro-bg/90 backdrop-blur-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 border border-retro-accent/20 group-hover:border-retro-accent/60 transition-colors">
              <Moon className="w-4 h-4 text-retro-accent group-hover:scale-110 transition-transform duration-slow" />
            </div>
            <span className="font-bold tracking-[0.15em] uppercase text-sm group-hover:text-white transition-colors">
              Nap<span className="text-retro-accent">Movies</span>
            </span>
          </Link>
          <div className="flex gap-10 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-[10px] font-bold tracking-[0.25em] transition-all uppercase relative py-1",
                  location.pathname === link.href
                    ? "text-retro-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-retro-accent"
                    : "text-retro-text/60 hover:text-retro-accent/90"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-[9px] opacity-20 hover:opacity-100 hover:text-retro-accent transition-all uppercase tracking-widest ml-4 px-2 py-1 border border-transparent hover:border-retro-accent/20"
            >
              /ADMIN
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}