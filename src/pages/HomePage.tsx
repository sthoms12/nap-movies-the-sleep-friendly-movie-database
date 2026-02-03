import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster, toast } from 'sonner';
import type { Movie } from '@shared/types';
import { Moon, Star } from 'lucide-react';
export function HomePage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    document.title = 'NapMovies 🌙';
  }, []);
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => api<Movie[]>('/api/movies'),
  });
  const voteMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'nap' | 'engaging' }) =>
      api(`/api/movies/${id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ type })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Signal received. Sleep well.');
    },
    onError: () => toast.error('Transmission error.')
  });
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text relative">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-16">
          <div className="max-w-5xl mx-auto">
            <header className="mb-24 space-y-8 text-center pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-5 border border-retro-accent/10 bg-retro-accent/5 animate-pulse">
                  <Moon className="w-12 h-12 text-retro-accent" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black tracking-[0.25em] uppercase text-white">
                  NAP <span className="text-retro-accent">MOVIES</span>
                </h1>
                <div className="h-px w-24 bg-retro-accent/40 mx-auto" />
              </div>
              <p className="text-retro-text/80 text-base md:text-lg max-w-xl mx-auto italic font-light leading-relaxed">
                "An opinionated index of low-stress cinema optimized for the drift into sleep."
              </p>
            </header>
            <section className="space-y-10">
              <div className="flex items-center justify-between border-b border-retro-muted/30 pb-6">
                <h2 className="text-xs font-black tracking-[0.4em] flex items-center gap-3 text-retro-accent/80">
                  <Star className="w-4 h-4" /> RECENT_ARCHIVE_RANKINGS
                </h2>
                <span className="text-[10px] opacity-30 uppercase tracking-[0.2em]">v3.5.refined</span>
              </div>
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-retro-card/40 border border-retro-muted/10 animate-pulse" />
                  ))}
                </div>
              ) : movies?.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-retro-muted/20 opacity-40 text-xs tracking-[0.4em] uppercase">
                  ARCHIVE_EMPTY_WAITING_FOR_INPUT
                </div>
              ) : (
                <div className="grid gap-8">
                  {movies?.map((movie, idx) => (
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
          <footer className="py-24 text-center border-t border-retro-muted/10 mt-20">
            <div className="opacity-40 text-[10px] tracking-[0.5em] uppercase space-y-3">
              <p>Minimalist_Sleep_Foundation // Terminal_Access_004</p>
              <p>© {new Date().getFullYear()} NAP_MOVIES_INTERNATIONAL</p>
            </div>
          </footer>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}