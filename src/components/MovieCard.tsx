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
    <div className="group relative border border-retro-muted/10 bg-retro-card p-6 transition-all duration-slow hover:border-retro-accent/20 hover:bg-retro-card/60">
      <div className="absolute -top-3 -left-3 bg-retro-muted text-retro-text px-2 py-1 text-[10px] font-bold flex items-center gap-1 border border-retro-muted/20 opacity-80 group-hover:opacity-100 group-hover:bg-retro-accent group-hover:text-retro-bg transition-colors">
        <Hash className="w-3 h-3" /> {rank}
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-retro-text/90 group-hover:text-retro-text transition-colors">
              {movie.title}
            </h3>
            <p className="text-retro-muted text-xs mt-1">{movie.year}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.tags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-none border-retro-muted/20 text-[9px] uppercase text-retro-muted/70 font-normal px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
          {/* Scoring Progress Bar */}
          <div className="w-full max-w-xs space-y-1 pt-2">
            <div className="h-[2px] w-full bg-retro-muted/10 overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  score >= 50 ? "bg-retro-accent/50 group-hover:bg-retro-accent" : "bg-retro-danger/50 group-hover:bg-retro-danger"
                )}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[8px] uppercase tracking-widest opacity-30 group-hover:opacity-50 transition-opacity">
              <span>Silence</span>
              <span>Metric</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 md:border-l border-retro-muted/10 md:pl-8">
          <div className="text-center min-w-[80px]">
            <div className={cn(
              "text-2xl font-black transition-colors",
              score >= 50 ? "text-retro-accent/60 group-hover:text-retro-accent" : "text-retro-danger/60 group-hover:text-retro-danger"
            )}>
              {score}<span className="text-xs opacity-40 ml-0.5">/100</span>
            </div>
            <div className="text-[9px] uppercase opacity-30 font-bold tracking-tighter">Nap Index</div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              disabled={isVoting}
              onClick={() => onVote('nap')}
              className="bg-retro-accent/5 text-retro-accent/70 hover:bg-retro-accent/20 hover:text-retro-accent rounded-none border border-retro-accent/10 text-[10px] font-bold uppercase transition-all"
            >
              <ThumbsUp className="w-3 h-3 mr-2" /> Nap-Approved
            </Button>
            <Button
              size="sm"
              disabled={isVoting}
              onClick={() => onVote('engaging')}
              className="bg-retro-danger/5 text-retro-danger/70 hover:bg-retro-danger/20 hover:text-retro-danger rounded-none border border-retro-danger/10 text-[10px] font-bold uppercase transition-all"
            >
              <ThumbsDown className="w-3 h-3 mr-2" /> Too Engaging
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}