import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Moon } from 'lucide-react';
export function Navbar() {
  const location = useLocation();
  const links = [
    { href: '/', label: 'LEADERBOARD' },
    { href: '/submit', label: 'SUBMIT MOVIE' },
  ];
  return (
    <nav className="border-b border-retro-muted/20 py-6 sticky top-0 bg-retro-bg/80 backdrop-blur-md z-40">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Moon className="w-5 h-5 text-retro-accent group-hover:rotate-12 transition-transform" />
          <span className="font-bold tracking-tighter uppercase text-xl">
            Nap<span className="text-retro-accent">Movies</span>
          </span>
        </Link>
        <div className="flex gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-xs font-bold tracking-widest transition-colors uppercase",
                location.pathname === link.href 
                  ? "text-retro-accent" 
                  : "text-retro-text/60 hover:text-retro-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/admin" 
            className="text-[10px] opacity-20 hover:opacity-100 transition-opacity uppercase tracking-widest"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}