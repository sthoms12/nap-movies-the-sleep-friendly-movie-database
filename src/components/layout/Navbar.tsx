import React from 'react';
import { Link } from 'react-router-dom';
import { Moon } from 'lucide-react';
export function Navbar() {
  return (
    <nav className="border-b border-retro-muted/30 py-6 sticky top-0 bg-retro-bg/90 backdrop-blur-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 border border-retro-accent/20 group-hover:border-retro-accent/60 transition-colors">
              <Moon className="w-4 h-4 text-retro-accent group-hover:scale-110 transition-transform duration-slow" />
            </div>
            <span className="font-bold tracking-[0.25em] uppercase text-sm group-hover:text-white transition-colors">
              Nap<span className="text-retro-accent">Movies</span>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}