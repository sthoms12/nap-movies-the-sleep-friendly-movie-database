import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/layout/Navbar';
import { toast } from 'sonner';
import type { Movie } from '@shared/types';
import { Moon, Star, RefreshCw, Award } from 'lucide-react';
export function HomePage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    document.title = 'NapMovies 🌙 | Index';
  }, []);
  const { data: movies, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['movies'],
    queryFn: () => api<Movie[]>('/api/movies'),
    staleTime: 30000,
    refetchInterval: 60000,
  });
  const voteMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'nap' | 'engaging' }) =>
      api<{ success: boolean }>(`/api/movies/${id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ type })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Signal received. Sleep well.');
    },
    onError: () => toast.error('Transmission error.')
  });
  const topFifty = movies?.slice(0, 50) ?? [];
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
                  <div className="absolute inset-0 bg-retro-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                  NAP <span className="text-retro-accent">MOVIES</span>
                </h1>
                <div className="h-px w-24 bg-retro-accent/40 mx-auto" />
              </div>
              <p className="text-retro-text/70 text-base md:text-lg max-w-xl mx-auto italic font-light leading-relaxed">
                "Browse the official Top 50 Nap Index — an opinionated collection optimized for the drift into sleep."
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
                    Top 50 Curated
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isFetching && <RefreshCw className="w-3 h-3 text-retro-accent animate-spin opacity-50" />}
                  <span className="text-[9px] opacity-30 uppercase tracking-[0.2em] hidden sm:inline">Build_4.1_Stable</span>
                </div>
              </div>
              {error && (
                <div className="flex items-center justify-center py-4 bg-retro-danger/10 border border-retro-danger/20 rounded-md mb-6">
                  <p className="text-xs text-retro-danger/80 uppercase tracking-wider mr-4">Uplink Sync Failed: Cached Index Active</p>
                  <button 
                    onClick={() => { 
                      refetch(); 
                      toast.success('Re-syncing...'); 
                    }} 
                    className="text-xs font-bold text-retro-accent hover:text-white underline px-2 py-1 border border-retro-accent/30 rounded hover:bg-retro-accent/20 transition-all"
                  >
                    Retry Uplink
                  </button>
                </div>
              )}
              {isLoading ? (
                <div className="space-y-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 bg-retro-card/40 border border-retro-muted/10 animate-pulse relative">
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer-effect" />
                    </div>
                  ))}
                </div>
              ) : error && !movies?.length ? (
                <div className="text-center py-40 border border-dashed border-retro-muted/20 opacity-40 text-xs tracking-[0.4em] uppercase">
                  Connection_Lost
                </div>
              ) : topFifty.length === 0 ? (
                <div className="text-center py-40 border border-dashed border-retro-muted/20 opacity-40 text-xs tracking-[0.4em] uppercase">
                  INDEX_EMPTY_WAITING_FOR_UPLINK
                </div>
              ) : (
                <div className="grid gap-8">
                  {topFifty.map((movie, idx) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      rank={idx + 1}
                      onVote={(type) => voteMutation.mutate({ id: movie.id, type })}
                      isVoting={voteMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
          <footer className="py-32 text-center border-t border-retro-muted/10 mt-24">
            <div className="opacity-40 text-[10px] tracking-[0.5em] uppercase space-y-4">
              <p className="font-bold">Minimalist_Sleep_Foundation // Index_Terminal_004</p>
              <div className="flex justify-center gap-8 text-[8px] opacity-50">
                <span>LATENCY: LOW</span>
                <span>STATUS: SECURE</span>
                <span>UPLINK: ACTIVE</span>
              </div>
              <p>© {new Date().getFullYear()} NAP_MOVIES_INTERNATIONAL</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}