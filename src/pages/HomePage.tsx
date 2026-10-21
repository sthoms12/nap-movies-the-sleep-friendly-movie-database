import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BarChart3, Database, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MovieCard } from '@/components/MovieCard';
import { readBundledMovies, refreshMovies } from '@/lib/movie-data';
import type { Movie } from '@shared/types';

const homeFaqs: Array<[string, string]> = [
  ['What makes a good nap movie?', 'A useful nap movie is usually a familiar rewatch with steady pacing, predictable sound, and a mood you already know.'],
  ['How does the Nap Index work?', 'The Nap Index weighs familiarity, pacing, sound, visual stillness, atmosphere, runtime, and rewatch comfort.'],
  ['Can community votes change the official ranking?', 'Community votes inform weekly review, but the public ranking changes only after owner approval.'],
  ['What are nap movies?', 'Nap movies are films people rewatch at night because steady pacing, predictable sound, and familiar stories make them easy movies to nap to. NapMovies ranks these titles with the owner-approved Nap Index, which weighs familiarity, pacing, sound, visual stillness, atmosphere, runtime, and rewatch comfort.'],
  ['How many movies are in the NapMovies archive?', 'The archive currently ranks 50 owner-approved movies. Community votes and submissions inform a weekly review, but the public ranking changes only after owner approval.'],
  ['Does NapMovies stream movies?', 'No. NapMovies is a ranked guide for quiet-night viewing; it does not host or stream any films.'],
  ['What range does the Nap Index use?', 'Scores are shown on a 0–10 scale. Every movie currently in the archive scores 8 or 9, reflecting that only vetted comfort rewatches make the cut.'],
];

function QuietNotice({ title, children }: { title: string; children: string }) {
  return (
    <div className="border border-border bg-black/20 p-6">
      <h2 className="text-lg font-black uppercase tracking-tight text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-retro-text">{children}</p>
    </div>
  );
}

export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>(() => readBundledMovies());
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void refreshMovies(movies).then((next) => {
      if (active && next) setMovies(next);
    });
    return () => {
      active = false;
    };
  }, [movies]);

  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    movies.forEach((movie) => {
      movie.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .filter(([, count]) => count < movies.length)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => name);
  }, [movies]);

  const visibleMovies = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return movies.filter((movie) => {
      const matchesTag = !activeTag || movie.tags.includes(activeTag);
      const matchesQuery = !needle
        || movie.title.toLowerCase().includes(needle)
        || String(movie.year).includes(needle)
        || movie.tags.some((tag) => tag.toLowerCase().includes(needle));
      return matchesTag && matchesQuery;
    });
  }, [activeTag, movies, query]);

  const rankById = useMemo(() => new Map(movies.map((movie, index) => [movie.id, index + 1])), [movies]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="mb-16 space-y-10">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative border border-primary/10 bg-primary/5 p-4">
                <Database className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
              <span className="text-white">Nap</span><span className="text-primary">Movies</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm font-bold leading-relaxed text-retro-text md:text-base">
              NapMovies is a ranked archive of nap movies — familiar rewatches, steady pacing, and quiet-night comfort picks.
            </p>
            <p className="mx-auto max-w-2xl text-sm font-bold leading-relaxed text-retro-text/90 md:text-base">
              Nap Movies for a quiet night. This ranked archive of movies to fall asleep to favors familiar rewatches, steady pacing, and predictable comfort.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3 border border-border bg-black/20 p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-retro-accent">
                <BarChart3 className="h-3.5 w-3.5" /> Archive_Scoring
              </div>
              <p className="text-[11px] leading-relaxed text-retro-text">
                Official scores stay owner-approved. This page reads the static catalog shipped with the site.
              </p>
            </div>
            <div className="space-y-3 border border-border bg-black/20 p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-retro-accent">
                <Tag className="h-3.5 w-3.5" /> High_Frequency_Tags
              </div>
              <div className="flex flex-wrap">
                <button
                  type="button"
                  aria-pressed={activeTag === null}
                  onClick={() => setActiveTag(null)}
                  className="tap-target text-[10px] font-black uppercase tracking-widest text-retro-text"
                >
                  All tags
                </button>
                {topTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={activeTag === tag}
                    onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
                    className="tap-target"
                  >
                    <Badge variant="outline" className={`h-6 rounded-none px-2 py-0 text-[10px] uppercase ${activeTag === tag ? 'border-retro-accent text-retro-accent' : 'border-white/20 text-retro-text'}`}>
                      {tag}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="mb-12 border-y border-border py-8">
          <div className="mb-6 max-w-2xl space-y-3">
            <h2 className="text-xl font-black uppercase tracking-tight text-white">How to choose a nap movie</h2>
            <p className="text-sm leading-6 text-retro-text">
              A useful nap movie is usually a familiar rewatch with steady pacing, predictable sound, and a mood you already know. The Nap Index considers familiarity, pacing, sound, visual stillness, atmosphere, runtime, and rewatch comfort. It is an editorial guide, not medical advice or a promise that a movie will make you sleep.
            </p>
            <p className="text-sm leading-6 text-retro-text">
              Start with the official ranking, then use your own familiarity as the deciding factor. Community notes can inform a later review, but published scores change only after owner approval.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Link to="/movies-to-fall-asleep-to/" className="tap-target justify-start border border-retro-accent/30 bg-retro-accent/5 text-[11px] font-black uppercase tracking-widest text-retro-accent hover:bg-retro-accent/10">Nap movie rankings</Link>
            <Link to="/quiet-movies-for-bedtime/" className="tap-target justify-start border border-border bg-black/20 text-[11px] font-black uppercase tracking-widest text-retro-text hover:border-retro-accent/40 hover:text-retro-accent">Quiet bedtime movies</Link>
            <Link to="/comfort-movies-for-sleep/" className="tap-target justify-start border border-border bg-black/20 text-[11px] font-black uppercase tracking-widest text-retro-text hover:border-retro-accent/40 hover:text-retro-accent">Comfort rewatches</Link>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="top-nap-index">
          <h2 id="top-nap-index" className="mb-3 text-xl font-black uppercase tracking-tight text-white">Which movies top the Nap Index right now?</h2>
          <p className="mb-4 text-sm text-retro-text">Top 10 nap movies by owner-approved Nap Index score</p>
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm text-retro-text">
              <caption className="sr-only">Top 10 nap movies by owner-approved Nap Index score</caption>
              <thead className="text-[11px] uppercase tracking-widest text-white">
                <tr>
                  <th scope="col" className="px-3 py-3">Rank</th>
                  <th scope="col" className="px-3 py-3">Title</th>
                  <th scope="col" className="px-3 py-3">Year</th>
                  <th scope="col" className="px-3 py-3">Runtime</th>
                  <th scope="col" className="px-3 py-3">Nap Index</th>
                </tr>
              </thead>
              <tbody>
                {movies.slice(0, 10).map((movie, index) => (
                  <tr key={movie.id} className="border-t border-border">
                    <td className="px-3 py-3">{index + 1}</td>
                    <td className="px-3 py-3 text-white">{movie.title}</td>
                    <td className="px-3 py-3">{movie.year}</td>
                    <td className="px-3 py-3">{movie.duration ? `${movie.duration} min` : '—'}</td>
                    <td className="px-3 py-3">{movie.napIndex}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">
                <Database className="h-3.5 w-3.5" /> Owner-approved nap movie rankings
              </h2>
              <div className="flex items-center gap-2 border border-primary/20 bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-primary">
                <Award className="h-3 w-3" />
                static_catalog
              </div>
            </div>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="catalog-search" className="sr-only">Search the movie archive</label>
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, year, or tag"
                className="h-12 w-full border border-retro-muted/30 bg-retro-bg px-3 text-base text-retro-text outline-none placeholder:text-retro-text/50 focus:border-retro-accent"
              />
            </div>
          </div>
          <div className="grid gap-8">
            {movies.length === 0 ? (
              <QuietNotice title="The archive is quiet">
                The ranked list isn’t in this copy of the site. The viewing guides are still available from the menu.
              </QuietNotice>
            ) : visibleMovies.length === 0 ? (
              <QuietNotice title="No matching titles">
                Nothing in the owner-approved archive matches that search. Clear the filter to see the full ranking.
              </QuietNotice>
            ) : (
              visibleMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} rank={rankById.get(movie.id) ?? 0} />
              ))
            )}
          </div>
          {query || activeTag ? (
            <button type="button" className="tap-target text-[11px] font-black uppercase tracking-widest text-retro-accent underline underline-offset-4" onClick={() => { setQuery(''); setActiveTag(null); }}>
              Clear search
            </button>
          ) : null}
        </section>

        <section className="mt-16" aria-label="Common questions">
          {homeFaqs.map(([question, answer]) => (
            <div key={question} className="border-t border-border py-6">
              <h2 className="mb-2 text-lg font-black text-white">{question}</h2>
              <p className="text-sm leading-6 text-retro-text">{answer}</p>
            </div>
          ))}
        </section>

        <p className="mt-10 text-sm leading-6 text-retro-text">
          NapMovies provides subjective entertainment recommendations for quiet-night viewing. It is not medical or sleep advice.
        </p>
        <Link to="/criteria/" className="tap-target text-sm font-bold text-retro-accent underline underline-offset-4">Read the methodology.</Link>
      </div>
    </main>
  );
}
