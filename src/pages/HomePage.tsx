import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/layout/Navbar';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Movie, VoteType } from '@shared/types';
import { Moon, Star, RefreshCw, Award } from 'lucide-react';
export function HomePage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    document.title = 'NapMovies �� | Index';
  }, []);
  const { data: movies, isLoading, isFetching, error } = useQuery({
    queryKey: ['movies-index'],
    queryFn: () => api<Movie[]>('/api/movies'),
    staleTime: 60000,
  });
  const voteMutation = useMutation({
    mutationFn: (vars: { movieId: string; type: VoteType }) =>
      api('/api/vote', { method: 'POST', body: JSON.stringify(vars) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies-index'] });
      toast.success('Signal received. Sleep well.');
    },
    onError: () => {
      toast.error('Transmission failure.');
    }
  });
  const handleLocalVote = (id: string, type: VoteType) => {
    const userVotedKey = `user_voted_${id}`;
    if (localStorage.getItem(userVotedKey)) {
      toast.error("Vocal signature already recorded.");
      return;
    }
    localStorage.setItem(userVotedKey, type);
    voteMutation.mutate({ movieId: id, type });
  };
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text relative overflow-x-hidden selection:bg-retro-accent/30 selection:text-white">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 lg:py-24">
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
                "Synchronized with Bayesian-weighted community signals. A rolling 30-day index of films optimized for deep rest."
              </p>
            </header>
            <section className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-retro-muted/30 pb-8 gap-4">
                <div className="flex items-center gap-5">
                  <h2 className="text-xs font-black tracking-[0.4em] flex items-center gap-3 text-retro-accent/80 uppercase">
                    <Star className="w-4 h-4" /> INDEX_RANKINGS
                  </h2>
                  <div className="flex items-center gap-2 bg-retro-accent/10 text-retro-accent border border-retro-accent/20 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                    <Award className="w-3 h-3" />
                    Consensus Verified
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {(isFetching || voteMutation.isPending) && <RefreshCw className="w-3.5 h-3.5 text-retro-accent animate-spin opacity-50" />}
                  <span className="text-[10px] opacity-30 uppercase tracking-[0.3em] font-bold">Protocol_v7.2_Stable</span>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-10">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-56 bg-retro-card/40 border border-retro-muted/10 animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-48 border border-dashed border-retro-muted/20 bg-retro-card/10 opacity-40 text-xs tracking-[0.5em] uppercase font-black">
                  INDEX_LOAD_FAILURE_RETRYING
                </div>
              ) : (
                <div className="grid gap-10">
                  {movies?.map((movie, idx) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      rank={idx + 1}
                      onVote={(type) => handleLocalVote(movie.id, type)}
                      isVoting={voteMutation.isPending}
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