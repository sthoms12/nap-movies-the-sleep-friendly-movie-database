import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Award, BarChart3, Database, Tag, X } from 'lucide-react';
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

const SLEEP_INTENT_QUICK_TAGS = [
  'Quiet',
  'Familiar',
  'Low Stress',
  'Dark',
  'Slow',
  'Slow Burn',
  'Rain',
  'Nature',
  'Ambient',
  'Dialogue',
  'Comforting',
  'Space',
  'No Dialogue',
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [activeTag, setActiveTag] = useState<string | null>(() => searchParams.get('tag'));
  const catalogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let active = true;
    void refreshMovies(movies).then((next) => {
      if (active && next) setMovies(next);
    });
    return () => {
      active = false;
    };
  }, [movies]);

  useEffect(() => {
    const nextQ = searchParams.get('q') ?? '';
    const nextTag = searchParams.get('tag');
    setQuery((prev) => (prev === nextQ ? prev : nextQ));
    setActiveTag((prev) => (prev === nextTag ? prev : nextTag));
  }, [searchParams]);

  const updateFilters = useCallback(
    (nextQuery: string, nextTag: string | null, shouldScrollToCatalog = false) => {
      setQuery(nextQuery);
      setActiveTag(nextTag);
      const nextParams = new URLSearchParams();
      if (nextQuery.trim()) nextParams.set('q', nextQuery.trim());
      if (nextTag) nextParams.set('tag', nextTag);
      setSearchParams(nextParams, { replace: true });
      if (shouldScrollToCatalog && catalogRef.current) {
        catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [setSearchParams],
  );

  const handleTagToggle = useCallback(
    (tag: string, shouldScrollToCatalog = false) => {
      const nextTag = activeTag === tag ? null : tag;
      updateFilters(query, nextTag, shouldScrollToCatalog);
    },
    [activeTag, query, updateFilters],
  );

  const handleClearFilters = useCallback(() => {
    updateFilters('', null, false);
  }, [updateFilters]);

  const quickPickTags = useMemo(() => {
    const available = new Set<string>();
    movies.forEach((movie) => {
      movie.tags.forEach((t) => available.add(t));
    });
    const curated = SLEEP_INTENT_QUICK_TAGS.filter((t) => available.has(t));
    if (activeTag && !curated.includes(activeTag)) {
      return [activeTag, ...curated];
    }
    return curated;
  }, [activeTag, movies]);

  const visibleMovies = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return movies.filter((movie) => {
      const matchesTag =
        !activeTag ||
        movie.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());
      const matchesQuery =
        !needle ||
        movie.title.toLowerCase().includes(needle) ||
        String(movie.year).includes(needle) ||
        movie.tags.some((tag) => tag.toLowerCase().includes(needle));
      return matchesTag && matchesQuery;
    });
  }, [activeTag, movies, query]);

  const rankById = useMemo(() => new Map(movies.map((movie, index) => [movie.id, index + 1])), [movies]);
  const hasActiveFilters = Boolean(query.trim() || activeTag);

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
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3 border border-border bg-black/20 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-retro-accent">
                <BarChart3 className="h-3.5 w-3.5" /> Quick Archive Search
              </div>
              <p className="text-xs leading-relaxed text-retro-text">
                Search by movie title, release year, or sleep mood and jump straight to matching picks.
              </p>
              <form
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (catalogRef.current) {
                    catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="flex gap-2 pt-1"
              >
                <label htmlFor="hero-search" className="sr-only">Search movies by title, year, or sleep vibe</label>
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(event) => updateFilters(event.target.value, activeTag, false)}
                  placeholder="Search title, year, or vibe (e.g. Quiet, Rain)..."
                  className="h-11 flex-1 border border-retro-muted/40 bg-retro-bg px-3 text-sm text-retro-text outline-none placeholder:text-retro-text/60 focus:border-retro-accent focus-visible:ring-2 focus-visible:ring-retro-accent"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center border border-retro-accent/40 bg-retro-accent/10 px-3 text-xs font-black uppercase tracking-wider text-retro-accent hover:bg-retro-accent/20"
                >
                  View ({visibleMovies.length})
                </button>
              </form>
            </div>
            <div className="space-y-3 border border-border bg-black/20 p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-retro-accent">
                  <Tag className="h-3.5 w-3.5" /> Sleep Mood Quick-Picks
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-retro-accent underline underline-offset-4"
                  >
                    <X className="h-3 w-3" /> Clear filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  aria-pressed={activeTag === null}
                  onClick={() => updateFilters(query, null, true)}
                  className={`inline-flex min-h-[36px] items-center border px-2.5 py-1 text-xs font-black uppercase tracking-wider transition-colors ${
                    activeTag === null
                      ? 'border-retro-accent bg-retro-accent/15 text-retro-accent'
                      : 'border-white/20 text-retro-text hover:border-retro-accent/50'
                  }`}
                >
                  All moods
                </button>
                {quickPickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={activeTag === tag}
                    onClick={() => handleTagToggle(tag, true)}
                    className="inline-flex min-h-[36px] items-center"
                  >
                    <Badge
                      variant="outline"
                      className={`h-8 rounded-none px-2.5 py-0 text-xs uppercase transition-colors ${
                        activeTag === tag
                          ? 'border-retro-accent bg-retro-accent/20 text-retro-accent'
                          : 'border-white/20 text-retro-text hover:border-retro-accent/60'
                      }`}
                    >
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/movies-to-fall-asleep-to/" className="tap-target justify-start border border-retro-accent/30 bg-retro-accent/5 text-xs font-black uppercase tracking-widest text-retro-accent hover:bg-retro-accent/10">Nap movie rankings</Link>
            <Link to="/quiet-movies-for-bedtime/" className="tap-target justify-start border border-border bg-black/20 text-xs font-black uppercase tracking-widest text-retro-text hover:border-retro-accent/40 hover:text-retro-accent">Quiet bedtime movies</Link>
            <Link to="/comfort-movies-for-sleep/" className="tap-target justify-start border border-border bg-black/20 text-xs font-black uppercase tracking-widest text-retro-text hover:border-retro-accent/40 hover:text-retro-accent">Comfort rewatches</Link>
            <Link to="/visually-dark-movies-to-fall-asleep-to/" className="tap-target justify-start border border-border bg-black/20 text-xs font-black uppercase tracking-widest text-retro-text hover:border-retro-accent/40 hover:text-retro-accent">Visually dark movies</Link>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="top-nap-index">
          <h2 id="top-nap-index" className="mb-3 text-xl font-black uppercase tracking-tight text-white">Which movies top the Nap Index right now?</h2>
          <p className="mb-4 text-sm text-retro-text">Top 10 nap movies by owner-approved Nap Index score</p>
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm text-retro-text">
              <caption className="sr-only">Top 10 nap movies by owner-approved Nap Index score</caption>
              <thead className="text-xs uppercase tracking-widest text-white">
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

        <section id="catalog" ref={catalogRef} className="scroll-mt-24 space-y-6">
          <div className="space-y-4 border border-border bg-black/20 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white">
                  <Database className="h-4 w-4 text-primary" /> Owner-approved nap movie rankings
                </h2>
                <div className="flex items-center gap-1.5 border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Award className="h-3.5 w-3.5" />
                  Curated Catalog
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p role="status" aria-live="polite" className="text-xs font-bold uppercase tracking-wider text-retro-text">
                  {`Showing ${visibleMovies.length} of ${movies.length} movies`}
                  {activeTag ? ` · Tag: ${activeTag}` : ''}
                  {query.trim() ? ` · Search: "${query.trim()}"` : ''}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex min-h-[36px] items-center gap-1.5 border border-retro-accent/50 bg-retro-accent/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-retro-accent hover:bg-retro-accent/20"
                  >
                    <X className="h-3.5 w-3.5" /> Clear filters
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:max-w-sm">
                <label htmlFor="catalog-search" className="sr-only">Search the movie archive</label>
                <input
                  id="catalog-search"
                  type="search"
                  value={query}
                  onChange={(event) => updateFilters(event.target.value, activeTag, false)}
                  placeholder="Search title, year, or tag (e.g. Quiet, Rain, 2011)"
                  className="h-12 w-full border border-retro-muted/40 bg-retro-bg px-3 text-base text-retro-text outline-none placeholder:text-retro-text/60 focus:border-retro-accent focus-visible:ring-2 focus-visible:ring-retro-accent"
                />
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-1.5" aria-label="Filter movies by sleep mood tag">
                <button
                  type="button"
                  aria-pressed={activeTag === null}
                  onClick={() => updateFilters(query, null, false)}
                  className={`inline-flex min-h-[36px] items-center border px-2.5 py-1 text-xs font-black uppercase tracking-wider transition-colors ${
                    activeTag === null
                      ? 'border-retro-accent bg-retro-accent/20 text-retro-accent'
                      : 'border-white/20 text-retro-text hover:border-retro-accent/50'
                  }`}
                >
                  All ({movies.length})
                </button>
                {quickPickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={activeTag === tag}
                    onClick={() => handleTagToggle(tag, false)}
                    className={`inline-flex min-h-[36px] items-center border px-2.5 py-1 text-xs font-black uppercase tracking-wider transition-colors ${
                      activeTag === tag
                        ? 'border-retro-accent bg-retro-accent/20 text-retro-accent'
                        : 'border-white/20 text-retro-text hover:border-retro-accent/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {movies.length === 0 ? (
              <QuietNotice title="The archive is quiet">
                The ranked list isn’t in this copy of the site. The viewing guides are still available from the menu.
              </QuietNotice>
            ) : visibleMovies.length === 0 ? (
              <div className="space-y-4 border border-border bg-black/20 p-6">
                <h3 className="text-lg font-black uppercase tracking-tight text-white">No matching titles</h3>
                <p className="text-sm leading-6 text-retro-text">
                  Nothing in the owner-approved archive matches {query.trim() ? `"${query.trim()}"` : ''}{query.trim() && activeTag ? ' with tag ' : ''}{activeTag ? `"${activeTag}"` : 'that filter'}.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex min-h-[44px] items-center gap-2 border border-retro-accent bg-retro-accent/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-retro-accent hover:bg-retro-accent/25"
                >
                  <X className="h-4 w-4" /> Clear filters &amp; show all {movies.length} movies
                </button>
              </div>
            ) : (
              visibleMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  rank={rankById.get(movie.id) ?? 0}
                  activeTag={activeTag}
                  onTagSelect={(tag) => handleTagToggle(tag, false)}
                />
              ))
            )}
          </div>
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
