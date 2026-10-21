import { Link } from 'react-router-dom';

const siteLinks = [
  { to: '/', label: 'Archive' },
  { to: '/movies-to-fall-asleep-to/', label: 'Nap movies' },
  { to: '/quiet-movies-for-bedtime/', label: 'Quiet movies' },
  { to: '/comfort-movies-for-sleep/', label: 'Comfort movies' },
  { to: '/criteria/', label: 'Methodology' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-card/30">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
        <nav aria-label="Site" className="flex flex-wrap items-center justify-center">
          {siteLinks.map((link) => (
            <Link key={link.to} to={link.to} className="tap-target text-[11px] font-black uppercase tracking-[0.16em] text-retro-accent underline decoration-retro-accent/40 underline-offset-4 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Creator profiles" className="flex flex-wrap items-center justify-center">
          <a className="tap-target text-[11px] font-bold uppercase tracking-[0.16em] text-retro-text underline decoration-retro-text/40 underline-offset-4 hover:text-white" href="https://www.linkedin.com/in/steve-thoms-81381990" rel="me">
            Steve Thoms
          </a>
          <a className="tap-target text-[11px] font-bold uppercase tracking-[0.16em] text-retro-text underline decoration-retro-text/40 underline-offset-4 hover:text-white" href="https://x.com/thomstech12" rel="me">
            @thomstech12
          </a>
        </nav>
        <p suppressHydrationWarning className="px-3 pb-3 text-center text-[11px] font-bold uppercase leading-5 tracking-[0.16em] text-retro-text">
          Copyright {year} NapMovies archive. Owner-approved rankings. Not medical or sleep advice.
        </p>
      </div>
    </footer>
  );
}
