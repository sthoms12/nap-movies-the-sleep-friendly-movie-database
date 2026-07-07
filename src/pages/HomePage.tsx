import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { MovieCard } from '@/components/MovieCard';
import { Moon, Award, BarChart3, Tag, Database, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Movie } from '@shared/types';
import { isCommunityEnabled, loadMovieData, submitMovie, submitVote } from '@/lib/movie-data';

type VoteState = 'idle' | 'saving' | 'saved' | 'error';

export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [voteStates, setVoteStates] = useState<Record<string, VoteState>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [submission, setSubmission] = useState({
    title: '',
    year: '',
    reason: '',
    tags: '',
  });
  const communityEnabled = isCommunityEnabled();

  const refreshMovies = async () => {
    const movieData = await loadMovieData();
    const sorted = [...movieData].sort((a, b) => b.napIndex - a.napIndex || a.title.localeCompare(b.title));
    setMovies(sorted);
    setLoadError(null);
  };

  useEffect(() => {
    let isMounted = true;

    document.title = 'NapMovies | The Archive';

    const initialize = async () => {
      try {
        const movieData = await loadMovieData();
        if (!isMounted) return;

        const sorted = [...movieData].sort((a, b) => b.napIndex - a.napIndex || a.title.localeCompare(b.title));
        setMovies(sorted);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : 'Unable to load the movie catalog.';
        setMovies([]);
        setLoadError(message);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleVote = async (movieId: string, voteType: 'sleepier' | 'less_sleepy' | 'comfort_pick') => {
    setVoteStates((current) => ({ ...current, [movieId]: 'saving' }));
    try {
      await submitVote(movieId, voteType);
      await refreshMovies();
      setVoteStates((current) => ({ ...current, [movieId]: 'saved' }));
    } catch {
      setVoteStates((current) => ({ ...current, [movieId]: 'error' }));
    }
  };

  const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionStatus('saving');
    try {
      await submitMovie({
        title: submission.title,
        year: submission.year ? Number(submission.year) : undefined,
        reason: submission.reason,
        tags: submission.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setSubmission({ title: '', year: '', reason: '', tags: '' });
      setSubmissionStatus('saved');
    } catch {
      setSubmissionStatus('error');
    }
  };

  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    movies.forEach((movie) => {
      movie.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => name);
  }, [movies]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden flex flex-col font-mono">
      <div className="crt-overlay" />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="py-8 md:py-10 lg:py-12">
          {isReady ? (
            <div className="w-full">
              <header className="mb-16 space-y-10">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 border border-primary/10 bg-primary/5 relative group">
                      <Moon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-7xl font-black tracking-widest uppercase text-white leading-none">
                    NAP <span className="text-primary">MOVIES</span>
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto italic font-bold leading-relaxed">
                    "A permanent catalog of sleep-friendly movie picks."
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-border bg-black/20 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-retro-accent tracking-[0.2em] uppercase">
                      <BarChart3 className="w-3.5 h-3.5" /> Archive_Scoring
                    </div>
                    <div className="text-[11px] leading-relaxed text-retro-text/80">
                      Official scores stay Steve-approved. Community votes feed the weekly review queue.
                    </div>
                  </div>
                  <div className="border border-border bg-black/20 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-retro-accent tracking-[0.2em] uppercase">
                      <Tag className="w-3.5 h-3.5" /> High_Frequency_Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[9px] rounded-none px-2 py-0 h-4 border-white/10 uppercase opacity-60">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </header>
              {communityEnabled && (
                <section className="mb-12 border border-border bg-black/20 p-5 md:p-6">
                  <div className="mb-5 flex items-center gap-2 text-[10px] font-bold text-retro-accent tracking-[0.2em] uppercase">
                    <Send className="h-3.5 w-3.5" /> Submit_A_Title
                  </div>
                  <form onSubmit={handleSubmission} className="grid gap-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px]">
                      <input
                        value={submission.title}
                        onChange={(event) => setSubmission((current) => ({ ...current, title: event.target.value }))}
                        className="h-10 border border-retro-muted/30 bg-retro-bg px-3 text-sm text-retro-text outline-none transition-colors placeholder:text-retro-text/30 focus:border-retro-accent"
                        placeholder="Movie title"
                        required
                        maxLength={160}
                      />
                      <input
                        value={submission.year}
                        onChange={(event) => setSubmission((current) => ({ ...current, year: event.target.value }))}
                        className="h-10 border border-retro-muted/30 bg-retro-bg px-3 text-sm text-retro-text outline-none transition-colors placeholder:text-retro-text/30 focus:border-retro-accent"
                        placeholder="Year"
                        inputMode="numeric"
                      />
                    </div>
                    <textarea
                      value={submission.reason}
                      onChange={(event) => setSubmission((current) => ({ ...current, reason: event.target.value }))}
                      className="min-h-24 resize-y border border-retro-muted/30 bg-retro-bg p-3 text-sm text-retro-text outline-none transition-colors placeholder:text-retro-text/30 focus:border-retro-accent"
                      placeholder="Why is this sleep-friendly?"
                      required
                      maxLength={1000}
                    />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                      <input
                        value={submission.tags}
                        onChange={(event) => setSubmission((current) => ({ ...current, tags: event.target.value }))}
                        className="h-10 border border-retro-muted/30 bg-retro-bg px-3 text-sm text-retro-text outline-none transition-colors placeholder:text-retro-text/30 focus:border-retro-accent"
                        placeholder="Tags, comma separated"
                      />
                      <button
                        type="submit"
                        disabled={submissionStatus === 'saving'}
                        className="inline-flex h-10 items-center justify-center gap-2 border border-retro-accent/40 bg-retro-accent/10 px-4 text-[10px] font-black uppercase tracking-widest text-retro-accent transition-colors hover:bg-retro-accent/20 disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" /> Submit
                      </button>
                    </div>
                    {submissionStatus === 'saved' && (
                      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-retro-accent/70">
                        Submission queued for weekly review.
                      </div>
                    )}
                    {submissionStatus === 'error' && (
                      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-retro-danger">
                        Submission failed.
                      </div>
                    )}
                  </form>
                </section>
              )}
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black tracking-[0.4em] flex items-center gap-2 text-primary/80 uppercase">
                      <Database className="w-3.5 h-3.5" /> ARCHIVE_INDEX_STABLE
                    </h2>
                    <div className="hidden sm:flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase">
                      <Award className="w-3 h-3" />
                      static_catalog
                    </div>
                  </div>
                </div>
                <div className="grid gap-8">
                  {loadError ? (
                    <div className="border border-retro-danger/40 bg-retro-danger/10 p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-retro-danger">
                      Catalog load failure: {loadError}
                    </div>
                  ) : (
                    movies.map((movie, idx) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        rank={idx + 1}
                        communityEnabled={communityEnabled}
                        voteState={voteStates[movie.id] ?? 'idle'}
                        onVote={handleVote}
                      />
                    ))
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 opacity-20">
              <div className="animate-pulse flex items-center gap-2 text-xs font-black uppercase tracking-[0.5em]">
                <Database className="w-4 h-4" /> Synchronizing_Archive...
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t border-border py-10 mt-16 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">
              Copyright {new Date().getFullYear()} NAP_MOVIES_ARCHIVE // DATA_SET: STATIC_50 // FINAL_STATE
            </div>
            <div className="text-[8px] font-mono mt-2 opacity-10 tracking-widest uppercase pointer-events-none">
              BUILD_ID: static_archive
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
