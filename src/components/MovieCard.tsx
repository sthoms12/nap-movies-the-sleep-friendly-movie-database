import type { Movie } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Hash, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  rank: number;
  activeTag?: string | null;
  onTagSelect?: (tag: string) => void;
}

const SCORE_BAR_WIDTH: Record<number, string> = {
  1: 'w-[10%]',
  2: 'w-[20%]',
  3: 'w-[30%]',
  4: 'w-[40%]',
  5: 'w-[50%]',
  6: 'w-[60%]',
  7: 'w-[70%]',
  8: 'w-[80%]',
  9: 'w-[90%]',
  10: 'w-full',
};

function scoreBarWidth(score: number) {
  return SCORE_BAR_WIDTH[score] ?? 'w-0';
}

export function MovieCard({ movie, rank, activeTag, onTagSelect }: MovieCardProps) {
  const score = movie.napIndex;
  const isOptimalLength = (movie.duration ?? 0) >= 120;

  return (
    <article className="relative border border-retro-muted/20 bg-retro-card p-6 md:p-8">
      <div className="absolute -left-2 -top-[14px] z-10 flex items-center gap-1 border border-retro-muted/40 bg-retro-muted px-3 py-1.5 text-xs font-black text-retro-text shadow-xl md:-left-4">
        <Hash className="h-3.5 w-3.5" /> {rank.toString().padStart(2, '0')}
      </div>
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div className="flex-1 space-y-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-black uppercase leading-none tracking-tight text-white md:text-3xl">
                {movie.title}
              </h3>
              {isOptimalLength && (
                <Badge variant="outline" className="h-5 rounded-none border-retro-accent/30 bg-retro-accent/5 px-2 py-0 text-[10px] font-black uppercase tracking-widest text-retro-accent">
                  2h+ Nap Runtime
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-retro-text/80">
                Release: {movie.year}
              </p>
              {movie.duration ? (
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-retro-text/80">
                  <Clock className="h-3 w-3" /> Runtime: {movie.duration}m
                </p>
              ) : null}
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-retro-text/80">
                Owner-Approved Archive
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.tags.map((tag) => {
              const isSelected = activeTag === tag;
              if (onTagSelect) {
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onTagSelect(tag)}
                    className={cn(
                      'inline-flex min-h-[36px] items-center border px-3 py-1 text-xs font-black uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-retro-accent',
                      isSelected
                        ? 'border-retro-accent bg-retro-accent/20 text-retro-accent'
                        : 'border-retro-muted/40 bg-black/20 text-retro-text/90 hover:border-retro-accent/60 hover:text-retro-accent',
                    )}
                  >
                    {tag}
                  </button>
                );
              }
              return (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-none border-retro-muted/40 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-retro-text/80"
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
          <div className="w-full max-w-sm space-y-3 pt-2">
            <div className="relative h-1.5 w-full overflow-hidden bg-black/40">
              <div
                className={cn(
                  'relative z-10 h-full',
                  scoreBarWidth(score),
                  score >= 8 ? 'bg-retro-accent shadow-[0_0_8px_rgba(96,165,250,0.5)]' : score >= 6 ? 'bg-retro-accent/60' : 'bg-retro-danger',
                )}
              />
            </div>
            <div className="flex items-center justify-end text-[10px] font-bold uppercase tracking-[0.2em] text-retro-text/80">
              <span className="flex items-center gap-1.5"><Info className="h-2.5 w-2.5" /> 10-Point Nap Index</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 md:border-l md:border-retro-muted/20 md:pl-10">
          <div className="min-w-[100px] text-center">
            <div className={cn('text-4xl font-black tabular-nums md:text-5xl', score >= 8 ? 'text-retro-accent' : 'text-retro-danger')}>
              {score}<span className="ml-1 text-[14px] font-bold text-retro-text">/10</span>
            </div>
            <div className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-retro-text/80">Nap Index</div>
          </div>
        </div>
      </div>
    </article>
  );
}
