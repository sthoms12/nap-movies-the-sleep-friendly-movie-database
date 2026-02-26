import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/layout/Navbar';
import { toast } from 'sonner';
import type { Movie } from '@shared/types';
import { Moon, Star, RefreshCw, Award } from 'lucide-react';
export function HomePage() {
  // Use a lazy initializer for state to prevent Layout Shift during hydration
  const [offsets, setOffsets] = useState<Record<string, { nap: number; engaging: number }>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('nap_votes_offsets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse offsets", e);
        return {};
      }
    }
    return {};
  });
  useEffect(() => {
    document.title = 'NapMovies 🌙 | Index';
  }, []);
  const { data: baseMovies, isLoading, isFetching, error } = useQuery({
    queryKey: ['static-movies'],
    queryFn: async () => {
      const res = await fetch('/movies.json');
      if (!res.ok) throw new Error("Failed to load index");
      return (await res.json()) as Movie[];
    },
    staleTime: Infinity,
  });
  const sortedMovies = useMemo(() => {
    if (!baseMovies) return [];
    return baseMovies
      .map(m => {
        const offset = offsets[m.id] || { nap: 0, engaging: 0 };
        return {
          ...m,
          votesNap: m.votesNap + offset.nap,
          votesEngaging: m.votesEngaging + offset.engaging
        };
      })
      .sort((a, b) => {
        const totalA = a.votesNap + a.votesEngaging;
        const totalB = b.votesNap + b.votesEngaging;
        // Bayesian-lite ranking logic: adjust for small sample sizes with a prior
        const priorVotes = 10;
        const priorNapRate = 0.7;
        const scoreA = (a.votesNap + priorVotes * priorNapRate) / (totalA + priorVotes);
        const scoreB = (b.votesNap + priorVotes * priorNapRate) / (totalB + priorVotes);
        if (Math.abs(scoreB - scoreA) > 0.0001) return scoreB - scoreA;
        // Tie-breaker: pure difference
        return (b.votesNap - b.votesEngaging) - (a.votesNap - a.votesEngaging);
      })
      .slice(0, 50);
  }, [baseMovies, offsets]);
  const handleLocalVote = (id: string, type: 'nap' | 'engaging') => {
    const userVotedKey = `user_voted_${id}`;
    if (localStorage.getItem(userVotedKey)) {
      toast.error("Vocal signature already recorded for this entry.");
      return;
    }
    setOffsets(prev => {
      const current = prev[id] || { nap: 0, engaging: 0 };
      const next = {
        ...prev,
        [id]: {
          nap: type === 'nap' ? current.nap + 1 : current.nap,
          engaging: type === 'engaging' ? current.engaging + 1 : current.engaging
        }
      };
      localStorage.setItem('nap_votes_offsets', JSON.stringify(next));
      localStorage.setItem(userVotedKey, type);
      return next;
    });
    toast.success('Signal received. Sleep well.');
  };
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text relative overflow-x-hidden selection:bg-retro-accent/30 selection:text-white">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-16">
          <div className="max-w-5xl mx-auto">
            <header className="mb-20 space-y-8 text-center pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-6 border border-retro-accent/10 bg-retro-accent/5 relative group">
                  <Moon className="w-12 h-12 text-retro-accent group-hover:scale-110 transition-transform duration-slow" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] uppercase text-white">
                  NAP <span className="text-retro-accent">MOVIES</span>
                </h1>
                <div className="h-px w-24 bg-retro-accent/40 mx-auto" />
              </div>
              <p className="text-retro-text/70 text-base md:text-lg max-w-xl mx-auto italic font-light leading-relaxed">
                "Browse the official Static Top 50 Nap Index — optimized for the drift into sleep."
              </p>
            </header>
            <section className="space-y-10">
              <div className="flex items-center justify-between border-b border-retro-muted/30 pb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xs font-black tracking-[0.4em] flex items-center gap-3 text-retro-accent/80 uppercase">
                    <Star className="w-4 h-4" /> INDEX_RANKINGS
                  </h2>
                  <div className="flex items-center gap-2 bg-retro-accent/10 text-retro-accent border border-retro-accent/20 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                    <Award className="w-3 h-3" />
                    Top 50 Verified
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isFetching && <RefreshCw className="w-3 h-3 text-retro-accent animate-spin opacity-50" />}
                  <span className="text-[9px] opacity-30 uppercase tracking-[0.2em]">Build_5.0_Static_Core</span>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-retro-card/40 border border-retro-muted/10 animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-40 border border-dashed border-retro-muted/20 opacity-40 text-xs tracking-[0.4em] uppercase">
                  INDEX_LOAD_FAILURE_RETRYING
                </div>
              ) : (
                <div className="grid gap-8">
                  {sortedMovies.map((movie, idx) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      rank={idx + 1}
                      onVote={(type) => handleLocalVote(movie.id, type)}
                      isVoting={false}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}