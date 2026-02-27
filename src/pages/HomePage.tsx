import React, { useState, useEffect, useCallback } from 'react';
import staticMoviesData from '@/data/movies.json';
import { Navbar } from '@/components/layout/Navbar';
import { MovieCard } from '@/components/MovieCard';
import { Moon, Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import type { Movie, VoteType } from '@shared/types';
export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  // Bayesian Parameters (Prior: 10 votes at 70% nap-rate)
  const PRIOR_VOTES = 10;
  const PRIOR_NAP_RATE = 0.7;
  const computeNapScore = useCallback((nap: number, engaging: number): number => {
    const total = nap + engaging;
    const bayesianScore = (nap + PRIOR_VOTES * PRIOR_NAP_RATE) / (total + PRIOR_VOTES);
    return Math.round(bayesianScore * 100);
  }, []);
  useEffect(() => {
    document.title = 'NapMovies 🌙 | Index';
    // Process movies with local signals - Direct from static JSON
    const processed = (staticMoviesData as Movie[]).map(m => {
      const userVote = localStorage.getItem(`user_voted_${m.id}`);
      let vNap = m.votesNap;
      let vEng = m.votesEngaging;
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
        const vNap = type === 'nap' ? m.votesNap + 1 : m.votesNap;
        const vEng = type === 'engaging' ? m.votesEngaging + 1 : m.votesEngaging;
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
    <div className="min-h-screen bg-retro-bg text-retro-text relative overflow-x-hidden selection:bg-retro-accent/30 selection:text-white">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-10 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <header className="mb-24 space-y-10 text-center">
              <div className="flex justify-center mb-8">
                <div className="p-6 border border-retro-accent/10 bg-retro-accent/5 relative group">
                  <Moon className="w-14 h-14 text-retro-accent group-hover:scale-110 transition-transform duration-slow" />
                </div>
              </div>
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-[0.25em] uppercase text-white leading-none">
                  NAP <span className="text-retro-accent">MOVIES</span>
                </h1>
                <div className="h-px w-32 bg-retro-accent/40 mx-auto" />
              </div>
              <p className="text-retro-text/70 text-base md:text-xl max-w-2xl mx-auto italic font-light leading-relaxed">
                "The world's most reliable rest-optimized index. A permanent static archive preserved for low-stress viewing."
              </p>
            </header>
            <section className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-retro-muted/30 pb-8 gap-4">
                <div className="flex items-center gap-5">
                  <h2 className="text-xs font-black tracking-[0.4em] flex items-center gap-3 text-retro-accent/80 uppercase">
                    <Star className="w-4 h-4" /> PERMANENT_INDEX
                  </h2>
                  <div className="flex items-center gap-2 bg-retro-accent/10 text-retro-accent border border-retro-accent/20 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                    <Award className="w-3 h-3" />
                    Static_Core_v1
                  </div>
                </div>
              </div>
              <div className="grid gap-10">
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
      </div>
    </div>
  );
}