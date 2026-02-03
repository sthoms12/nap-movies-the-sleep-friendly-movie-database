import React from 'react';
import type { Movie } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
interface MovieCardProps {
  movie: Movie;
  rank: number;
  onVote: (type: 'nap' | 'engaging') => void;
  isVoting: boolean;
}
export function MovieCard({ movie, rank, onVote, isVoting }: MovieCardProps) {
  const totalVotes = movie.votesNap + movie.votesEngaging;
  const score = totalVotes > 0
    ? Math.round((movie.votesNap / totalVotes) * 100)
    : 50;
  return (
    <div className="group relative border border-retro-muted/20 bg-retro-card p-6 transition-all duration-slow hover:border-retro-accent/40 hover:bg-retro-card/80">
      <div className="absolute -top-3 -left-3 bg-retro-muted text-retro-text px-2 py-1 text-[10px] font-bold flex items-center gap-1 border border-retro-muted/40 opacity-90 group-hover:opacity-100 group-hover:bg-retro-accent group-hover:text-retro-bg transition-all">
        <Hash className="w-3 h-3" /> {rank}
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-retro-text group-hover:text-white transition-colors">
              {movie.title}
            </h3>
            <p className="text-muted-foreground text-xs mt-1 group-hover:text-retro-text/80 transition-colors">{movie.year}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.tags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-none border-retro-muted/40 text-[9px] uppercase text-retro-text/60 font-normal px-2 py-0 group-hover:border-retro-accent/30 group-hover:text-retro-accent/90"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="w-full max-w-xs space-y-2 pt-2">
            <div className="h-[3px] w-full bg-black/20 overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  score >= 50 ? "bg-retro-accent" : "bg-retro-danger"
                )}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70 transition-opacity">
              <span>Low-Stress</span>
              <span>Metric</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 md:border-l border-retro-muted/20 md:pl-8">
          <div className="text-center min-w-[80px]">
            <div className={cn(
              "text-3xl font-black transition-colors",
              score >= 50 ? "text-retro-accent" : "text-retro-danger"
            )}>
              {score}<span className="text-xs opacity-50 ml-0.5">/100</span>
            </div>
            <div className="text-[10px] uppercase opacity-50 font-bold tracking-tighter">Nap Index</div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              disabled={isVoting}
              onClick={() => onVote('nap')}
              className="bg-retro-accent/10 text-retro-accent hover:bg-retro-accent hover:text-retro-bg rounded-none border border-retro-accent/30 text-[10px] font-bold uppercase transition-all h-9"
            >
              <ThumbsUp className="w-3 h-3 mr-2" /> Nap-Approved
            </Button>
            <Button
              size="sm"
              disabled={isVoting}
              onClick={() => onVote('engaging')}
              className="bg-retro-danger/10 text-retro-danger hover:bg-retro-danger hover:text-retro-bg rounded-none border border-retro-danger/30 text-[10px] font-bold uppercase transition-all h-9"
            >
              <ThumbsDown className="w-3 h-3 mr-2" /> Too Engaging
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}