import React, { useMemo, useState, useEffect } from 'react';
import type { Movie } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Hash, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
interface MovieCardProps {
  movie: Movie;
  rank: number;
  onVote: (type: 'nap' | 'engaging') => void;
  isVoting: boolean;
}
export function MovieCard({ movie, rank, onVote, isVoting }: MovieCardProps) {
  const [userVote, setUserVote] = useState<string | null>(null);
  useEffect(() => {
    setUserVote(localStorage.getItem(`user_voted_${movie.id}`));
  }, [movie.id]);
  const score = useMemo(() => {
    return movie.napScore ?? 50;
  }, [movie.napScore]);
  const handleVote = (type: 'nap' | 'engaging') => {
    onVote(type);
    setUserVote(type);
  };
  return (
    <div className="group relative border border-retro-muted/20 bg-retro-card p-6 md:p-8 transition-all duration-slow hover:border-retro-accent/40 hover:bg-retro-card/90">
      <div className="absolute -top-3 -left-2 md:-left-4 bg-retro-muted text-retro-text px-3 py-1.5 text-[11px] font-black flex items-center gap-1 border border-retro-muted/40 z-10 group-hover:bg-retro-accent group-hover:text-retro-bg transition-all shadow-lg">
        <Hash className="w-3.5 h-3.5" /> {rank.toString().padStart(2, '0')}
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-5 flex-1">
          <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white group-hover:text-retro-accent transition-colors leading-none mb-2">
              {movie.title}
            </h3>
            <p className="text-retro-text/40 text-xs font-bold tracking-[0.1em]">
              RELEASE_DATELINE: {movie.year}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.tags.map(tag => (
              <Badge key={tag} variant="outline" className="rounded-none border-retro-muted/40 text-[9px] uppercase text-retro-text/60 font-black px-2.5">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="w-full max-w-sm space-y-3 pt-2">
            <div className="h-1 w-full bg-black/40 overflow-hidden relative">
              <div
                className={cn(
                  "h-full transition-all duration-[1000ms] ease-out relative z-10",
                  score >= 70 ? "bg-retro-accent shadow-[0_0_10px_rgba(96,165,250,0.5)]" :
                  score >= 50 ? "bg-retro-accent/60" : "bg-retro-danger"
                )}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-bold opacity-30">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-2.5 h-2.5" /> {movie.votesNap}
                <span className="mx-1">|</span>
                <ThumbsDown className="w-2.5 h-2.5" /> {movie.votesEngaging}
              </div>
              <span className="flex items-center gap-1"><Zap className="w-2 h-2" /> Local_Signals_Applied</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 md:border-l border-retro-muted/20 md:pl-10">
          <div className="text-center min-w-[100px]">
            <div className={cn(
              "text-4xl md:text-5xl font-black transition-all",
              score >= 70 ? "text-retro-accent" : "text-retro-danger"
            )}>
              {score}<span className="text-[14px] opacity-40 ml-1 font-bold">%</span>
            </div>
            <div className="text-[10px] uppercase opacity-40 font-black tracking-widest mt-1">NAP_INDEX</div>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <Button
              size="sm"
              disabled={!!userVote || isVoting}
              onClick={() => handleVote('nap')}
              className={cn(
                "rounded-none border text-[10px] font-black uppercase transition-all h-10 px-6 tracking-widest",
                userVote === 'nap'
                  ? "bg-retro-accent text-retro-bg border-retro-accent"
                  : "bg-retro-accent/10 text-retro-accent border-retro-accent/30 hover:bg-retro-accent hover:text-retro-bg"
              )}
            >
              {userVote === 'nap' ? <Check className="w-3.5 h-3.5 mr-2" /> : <ThumbsUp className="w-3.5 h-3.5 mr-2" />}
              Nap-Approved
            </Button>
            <Button
              size="sm"
              disabled={!!userVote || isVoting}
              onClick={() => handleVote('engaging')}
              className={cn(
                "rounded-none border text-[10px] font-black uppercase transition-all h-10 px-6 tracking-widest",
                userVote === 'engaging'
                  ? "bg-retro-danger text-retro-bg border-retro-danger"
                  : "bg-retro-danger/10 text-retro-danger border-retro-danger/30 hover:bg-retro-danger hover:text-retro-bg"
              )}
            >
              {userVote === 'engaging' ? <Check className="w-3.5 h-3.5 mr-2" /> : <ThumbsDown className="w-3.5 h-3.5 mr-2" />}
              Too Engaging
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}