import React, { useState, useEffect, useCallback } from 'react';
import staticMoviesData from '@/data/movies.json';
import { Navbar } from '@/components/layout/Navbar';
import { MovieCard } from '@/components/MovieCard';
import { Moon, Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import type { Movie, VoteType } from '@shared/types';
const PRIOR_VOTES = 15;
const PRIOR_NAP_RATE = 0.8;
export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const computeNapScore = useCallback((nap: number, engaging: number): number => {
    const total = (nap ?? 0) + (engaging ?? 0);
    const bayesianScore = ((nap ?? 0) + PRIOR_VOTES * PRIOR_NAP_RATE) / (total + PRIOR_VOTES);
    return Math.round(bayesianScore * 100);
  }, []);
  useEffect(() => {
    document.title = 'NapMovies �� | The Archive';
    const processed = (staticMoviesData as Movie[]).map(m => {
      const userVote = localStorage.getItem(`user_voted_${m.id}`);
      let vNap = m.votesNap ?? 0;
      let vEng = m.votesEngaging ?? 0;
      if (userVote === 'nap') vNap += 1;
      else if (userVote === 'engaging') vEng += 1;
      return {
        ...m,
        votesNap: vNap,
        votesEngaging: vEng,
        napScore: computeNapScore(vNap, vEng)
      };
    });
    const sorted = processed.sort((a, b) => (b.napScore || 0) - (a.napScore || 0));
    setMovies(sorted);
  }, [computeNapScore]);
  const handleLocalVote = (id: string, type: VoteType) => {
    const userVotedKey = `user_voted_${id}`;
    if (localStorage.getItem(userVotedKey)) {
      toast.error("Vocal signature already recorded.");
      return;
    }
    localStorage.setItem(userVotedKey, type);
    toast.success('Signal received. Sleep well.');
    setMovies(prev => {
      const updated = prev.map(m => {
        if (m.id !== id) return m;
        const vNap = type === 'nap' ? (m.votesNap ?? 0) + 1 : (m.votesNap ?? 0);
        const vEng = type === 'engaging' ? (m.votesEngaging ?? 0) + 1 : (m.votesEngaging ?? 0);
        return {
          ...m,
          votesNap: vNap,
          votesEngaging: vEng,
          napScore: computeNapScore(vNap, vEng)
        };
      });
      return [...updated].sort((a, b) => (b.napScore || 0) - (a.napScore || 0));
    });
  };
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white flex flex-col font-mono">
      <div className="crt-overlay" />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-16 space-y-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-5 border border-primary/10 bg-primary/5 relative group">
                  <Moon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-7xl font-black tracking-widest uppercase text-white leading-none">
                  NAP <span className="text-primary">MOVIES</span>
                </h1>
                <div className="h-0.5 w-24 bg-primary/40 mx-auto" />
              </div>
              <p className="text-muted-foreground text-sm md:text-lg max-w-xl mx-auto italic font-light leading-relaxed">
                "A permanent, immutable archive of low-stress cinema. Preserved for quiet nights and deep rest."
              </p>
            </header>
            <section className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border pb-6 gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-[10px] font-black tracking-[0.4em] flex items-center gap-2 text-primary/80 uppercase">
                    <Star className="w-3.5 h-3.5" /> ARCHIVE_INDEX
                  </h2>
                  <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase">
                    <Award className="w-3 h-3" />
                    v1.0.0_STABLE
                  </div>
                </div>
              </div>
              <div className="grid gap-8">
                {movies.map((movie, idx) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    rank={idx + 1}
                    onVote={(type) => handleLocalVote(movie.id, type)}
                    isVoting={false}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer className="border-t border-border py-10 mt-16 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">
              © {new Date().getFullYear()} NAP_MOVIES_ARCHIVE // DATA_SET: CURATED_50 // NO_CHANGES_EXPECTED
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}