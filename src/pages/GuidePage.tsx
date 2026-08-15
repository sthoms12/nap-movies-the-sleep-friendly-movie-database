import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Moon, ShieldCheck } from 'lucide-react';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/layout/Navbar';
import type { GuideDefinition } from '@/content/guides';
import { loadMovieData } from '@/lib/movie-data';
import type { Movie } from '@shared/types';

export function GuidePage({ guide }: { guide: GuideDefinition }) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    document.title = `${guide.title} | NapMovies`;
    window.scrollTo(0, 0);
    void loadMovieData().then(setMovies);
  }, [guide]);

  const selectedMovies = useMemo(() => {
    const byId = new Map(movies.map((movie) => [movie.id, movie]));
    return guide.movieIds.map((id) => byId.get(id)).filter((movie): movie is Movie => Boolean(movie));
  }, [guide.movieIds, movies]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden flex flex-col font-mono">
      <div className="crt-overlay" />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-retro-text/40">
          <Link to="/" className="hover:text-retro-accent">Archive</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{guide.title}</span>
        </nav>
        <header className="mb-14 space-y-6">
          <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <Moon className="h-3.5 w-3.5" /> {guide.eyebrow}
          </div>
          <h1 className="max-w-4xl text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-5xl">{guide.title}</h1>
          <p className="max-w-3xl border-l-2 border-retro-accent/50 pl-5 text-base font-bold leading-relaxed text-retro-text/90 md:text-lg">{guide.answer}</p>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{guide.introduction}</p>
        </header>
        <aside className="mb-14 border border-retro-accent/20 bg-retro-accent/5 p-5">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-retro-accent"><ShieldCheck className="h-4 w-4" /> Selection note</div>
          <p className="text-xs leading-6 text-retro-text/70">{guide.selectionNote}</p>
        </aside>
        <section aria-labelledby="ranked-picks" className="mb-16 space-y-8">
          <h2 id="ranked-picks" className="flex items-center gap-3 border-b border-border pb-4 text-xs font-black uppercase tracking-[0.3em] text-primary/80"><BookOpen className="h-4 w-4" /> Official catalog picks</h2>
          {selectedMovies.map((movie, index) => <MovieCard key={movie.id} movie={movie} rank={index + 1} />)}
        </section>
        <section aria-labelledby="questions" className="mb-16">
          <h2 id="questions" className="mb-6 text-2xl font-black uppercase tracking-tight text-white">Common questions</h2>
          <div className="divide-y divide-border border-y border-border">
            {guide.faq.map((item) => (
              <div key={item.question} className="py-6">
                <h3 className="mb-2 text-sm font-black text-white">{item.question}</h3>
                <p className="text-xs leading-6 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-4 border-t border-border pt-10 md:grid-cols-2">
          <Link to="/" className="border border-border bg-black/20 p-5 text-xs font-black uppercase tracking-widest hover:border-retro-accent/40 hover:text-retro-accent">View the full ranked archive</Link>
          <Link to="/criteria" className="border border-border bg-black/20 p-5 text-xs font-black uppercase tracking-widest hover:border-retro-accent/40 hover:text-retro-accent">How the Nap Index works</Link>
        </section>
        <p className="mt-10 text-[10px] leading-5 text-retro-text/40">NapMovies provides subjective entertainment recommendations for quiet-night viewing. It is not medical or sleep advice.</p>
      </main>
    </div>
  );
}
