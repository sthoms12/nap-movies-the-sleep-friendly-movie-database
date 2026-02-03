import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
export function Navbar() {
  return (
    <nav className="border-b border-retro-muted/30 py-4 sticky top-0 bg-retro-bg/90 backdrop-blur-md z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1 border border-retro-accent/20 group-hover:border-retro-accent/60 transition-colors">
              <Moon className="w-4 h-4 text-retro-accent group-hover:scale-110 transition-transform duration-slow" />
            </div>
            <span className="font-bold tracking-[0.2em] uppercase text-sm group-hover:text-white transition-colors">
              Nap<span className="text-retro-accent">Movies</span>
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "text-[10px] font-black uppercase tracking-[0.25em] transition-colors hover:text-retro-accent",
                isActive ? "text-retro-accent border-b border-retro-accent/50 pb-0.5" : "text-retro-text/60"
              )}
            >
              HOME
            </NavLink>
            <NavLink
              to="/criteria"
              className={({ isActive }) => cn(
                "text-[10px] font-black uppercase tracking-[0.25em] transition-colors hover:text-retro-accent",
                isActive ? "text-retro-accent border-b border-retro-accent/50 pb-0.5" : "text-retro-text/60"
              )}
            >
              CRITERIA
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}