import type { Movie } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Hash, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  rank: number;
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

export function MovieCard({ movie, rank }: MovieCardProps) {
  const score = movie.napIndex;
  const isOptimalLength = (movie.duration ?? 0) >= 120;

  return (
    <div className="group relative border border-retro-muted/20 bg-retro-card p-6 transition-colors duration-slow hover:border-retro-accent/40 hover:bg-retro-card/90 md:p-8">
      <div className="absolute -left-2 -top-[14px] z-10 flex items-center gap-1 border border-retro-muted/40 bg-retro-muted px-3 py-1.5 text-[11px] font-black text-retro-text shadow-xl transition-colors group-hover:border-retro-accent group-hover:bg-retro-accent group-hover:text-retro-bg md:-left-4">
        <Hash className="h-3.5 w-3.5" /> {rank.toString().padStart(2, '0')}
      </div>
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div className="flex-1 space-y-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-black uppercase leading-none tracking-tight text-white transition-colors group-hover:text-retro-accent md:text-3xl">
                {movie.title}
              </h3>
              {isOptimalLength && (
                <Badge variant="outline" className="h-4 rounded-none border-retro-accent/30 bg-retro-accent/5 px-2 py-0 text-[8px] font-black uppercase tracking-widest text-retro-accent">
                  NAP_OPTIMAL_LENGTH
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-retro-text/70">
                RELEASE: {movie.year}
              </p>
              {movie.duration ? (
                <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-retro-text/70">
                  <Clock className="h-3 w-3" /> RUNTIME: {movie.duration}m
                </p>
              ) : null}
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-retro-text/70">
                STATUS: PERMANENT_RECORD
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-none border-retro-muted/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-retro-text/80"
              >
                {tag}
              </Badge>
            ))}
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
            <div className="flex items-center justify-end text-[9px] font-bold uppercase tracking-[0.3em] text-retro-text/70">
              <span className="flex items-center gap-1.5"><Info className="h-2.5 w-2.5" /> Manual_10_Point_Index</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 md:border-l md:border-retro-muted/20 md:pl-10">
          <div className="min-w-[100px] text-center">
            <div className={cn('text-4xl font-black tabular-nums md:text-5xl', score >= 8 ? 'text-retro-accent' : 'text-retro-danger')}>
              {score}<span className="ml-1 text-[14px] font-bold text-retro-text">/10</span>
            </div>
            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-retro-text/70">NAP_INDEX</div>
          </div>
        </div>
      </div>
    </div>
  );
}
