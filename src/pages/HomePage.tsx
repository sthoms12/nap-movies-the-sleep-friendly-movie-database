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
    document.title = 'NapMovies ����';
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
      toast.success('Vote registered. Rest well.');
    },
    onError: () => toast.error('Transmission error.')
  });
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text relative">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <header className="mb-20 space-y-6 text-center pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 border border-retro-muted/20 opacity-40">
                  <Moon className="w-10 h-10 text-retro-accent" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase opacity-90">
                Nap <span className="text-retro-accent/80">Movies</span>
              </h1>
              <p className="text-retro-muted text-sm md:text-base max-w-lg mx-auto border-l border-retro-muted/30 pl-4 italic opacity-80 leading-relaxed">
                "A quiet collection of low-stress cinema for late-night drifting."
              </p>
            </header>
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-retro-muted/10 pb-4">
                <h2 className="text-sm font-bold tracking-widest flex items-center gap-3 opacity-60">
                  <Star className="w-4 h-4" /> CURRENT RANKINGS
                </h2>
                <span className="text-[10px] opacity-40 uppercase">System.Index.v3.0</span>
              </div>
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-retro-card/30 border border-retro-muted/5 animate-pulse" />
                  ))}
                </div>
              ) : movies?.length === 0 ? (
                <div className="text-center py-24 border border-dashed border-retro-muted/10 opacity-40 text-xs tracking-widest uppercase">
                  Zero entries in database.
                </div>
              ) : (
                <div className="grid gap-6">
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
          <footer className="py-16 text-center opacity-20 text-[10px] tracking-[0.3em] uppercase">
            <p>System.Nap_Movies_Archive_v3.0</p>
            <p className="mt-2">© {new Date().getFullYear()} Minimalist Sleep Foundation</p>
          </footer>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}