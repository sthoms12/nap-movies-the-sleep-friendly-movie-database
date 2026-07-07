import React from 'react';
import type { Movie } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Hash, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  rank: number;
}

export function MovieCard({ movie, rank }: MovieCardProps) {
  const score = movie.napIndex;
  const scorePercent = score * 10;
  const isOptimalLength = (movie.duration ?? 0) >= 120;

  return (
    <div className="group relative border border-retro-muted/20 bg-retro-card p-6 md:p-8 transition-all duration-slow hover:border-retro-accent/40 hover:bg-retro-card/90">
      <div className="absolute -top-[14px] -left-2 md:-left-4 bg-retro-muted text-retro-text px-3 py-1.5 text-[11px] font-black flex items-center gap-1 border border-retro-muted/40 z-10 group-hover:bg-retro-accent group-hover:text-retro-bg group-hover:border-retro-accent transition-all shadow-xl">
        <Hash className="w-3.5 h-3.5" /> {rank.toString().padStart(2, '0')}
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-5 flex-1">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white group-hover:text-retro-accent transition-colors leading-none">
                {movie.title}
              </h3>
              {isOptimalLength && (
                <Badge variant="outline" className="rounded-none border-retro-accent/30 text-retro-accent text-[8px] font-black tracking-widest uppercase bg-retro-accent/5 px-2 py-0 h-4">
                  NAP_OPTIMAL_LENGTH
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-retro-text/40 text-[10px] font-black tracking-[0.2em] uppercase">
                RELEASE: {movie.year}
              </p>
              {movie.duration ? (
                <>
                  <div className="h-1 w-1 rounded-full bg-retro-muted/40 hidden sm:block" />
                  <p className="text-retro-text/40 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> RUNTIME: {movie.duration}m
                  </p>
                </>
              ) : null}
              <div className="h-1 w-1 rounded-full bg-retro-muted/40 hidden sm:block" />
              <p className="text-retro-text/40 text-[10px] font-black tracking-[0.2em] uppercase">
                STATUS: PERMANENT_RECORD
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-none border-retro-muted/40 text-[9px] uppercase text-retro-text/60 font-black px-2.5 py-0.5 tracking-wider"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="w-full max-w-sm space-y-3 pt-2">
            <div className="h-1.5 w-full bg-black/40 overflow-hidden relative">
              <div
                className={cn(
                  "h-full transition-all ease-in-out relative z-10",
                  score >= 8 ? "bg-retro-accent shadow-[0_0_8px_rgba(96,165,250,0.5)]" :
                  score >= 6 ? "bg-retro-accent/60" : "bg-retro-danger"
                )}
                style={{ width: `${scorePercent}%`, transitionDuration: "1200ms" }}
              />
            </div>
            <div className="flex justify-end items-center text-[9px] uppercase tracking-[0.3em] font-bold opacity-30">
              <span className="flex items-center gap-1.5"><Info className="w-2.5 h-2.5" /> Manual_10_Point_Index</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 md:border-l border-retro-muted/20 md:pl-10">
          <div className="text-center min-w-[100px]">
            <div className={cn(
              "text-4xl md:text-5xl font-black transition-all tabular-nums",
              score >= 8 ? "text-retro-accent" : "text-retro-danger"
            )}>
              {score}<span className="text-[14px] opacity-40 ml-1 font-bold">/10</span>
            </div>
            <div className="text-[10px] uppercase opacity-40 font-black tracking-[0.4em] mt-2">NAP_INDEX</div>
          </div>
        </div>
      </div>
    </div>
  );
}
