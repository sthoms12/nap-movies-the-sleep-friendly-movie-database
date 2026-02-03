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
  const score = movie.votesNap - movie.votesEngaging;
  return (
    <div className="group relative border border-retro-muted/30 bg-retro-card p-6 transition-all hover:border-retro-accent/50 hover:bg-retro-card/80">
      <div className="absolute -top-3 -left-3 bg-retro-accent text-retro-bg px-2 py-1 text-xs font-bold flex items-center gap-1">
        <Hash className="w-3 h-3" /> {rank}
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-tight">{movie.title}</h3>
            <p className="text-retro-muted text-sm">{movie.year}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="rounded-none border-retro-muted/40 text-[10px] uppercase text-retro-muted"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-8 md:border-l border-retro-muted/20 md:pl-8">
          <div className="text-center min-w-[80px]">
            <div className={cn(
              "text-3xl font-black",
              score >= 0 ? "text-retro-accent" : "text-retro-danger"
            )}>
              {score > 0 ? `+${score}` : score}
            </div>
            <div className="text-[10px] uppercase opacity-40 font-bold">Nap Score</div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              disabled={isVoting}
              onClick={() => onVote('nap')}
              className="bg-retro-accent/10 text-retro-accent hover:bg-retro-accent hover:text-retro-bg rounded-none border border-retro-accent/30 text-xs font-bold uppercase"
            >
              <ThumbsUp className="w-3 h-3 mr-2" /> Nap-Approved
            </Button>
            <Button
              size="sm"
              disabled={isVoting}
              onClick={() => onVote('engaging')}
              className="bg-retro-danger/10 text-retro-danger hover:bg-retro-danger hover:text-retro-bg rounded-none border border-retro-danger/30 text-xs font-bold uppercase"
            >
              <ThumbsDown className="w-3 h-3 mr-2" /> Too Engaging
            </Button>
          </div>
        </div>
      </div>
      {/* CRT Scanline Effect Overlay (Internal) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
}