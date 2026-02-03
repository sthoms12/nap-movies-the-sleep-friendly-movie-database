import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster, toast } from 'sonner';
import type { Movie } from '@shared/types';
import { Moon, Star } from 'lucide-react';
export function HomePage() {
  const queryClient = useQueryClient();
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
      toast.success('Vote registered. Sleep tight.');
    },
    onError: () => toast.error('Failed to vote.')
  });
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text selection:bg-retro-accent selection:text-retro-bg font-mono">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-16 space-y-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 border-2 border-retro-accent/30 animate-pulse">
              <Moon className="w-12 h-12 text-retro-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">
            Nap <span className="text-retro-accent">Movies</span>
          </h1>
          <p className="text-retro-muted text-lg max-w-xl mx-auto border-l-2 border-retro-muted pl-4 italic">
            "The definitive, community-ranked collection of low-stress cinema perfect for drifting off to sleep."
          </p>
        </header>
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-retro-muted/30 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5" /> LEADERBOARD
            </h2>
            <span className="text-2xs opacity-50 uppercase">Sorted by Nap Score</span>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-retro-card/50 animate-pulse border border-retro-muted/20" />
              ))}
            </div>
          ) : movies?.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-retro-muted/30">
              NO MOVIES FOUND. SUBMIT ONE?
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
      </main>
      <footer className="py-20 text-center opacity-30 text-xs">
        <p>SYSTEM.NAP_MOVIES_v1.0.0</p>
        <p>© {new Date().getFullYear()} NO RIGHTS RESERVED. JUST SLEEP.</p>
      </footer>
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}