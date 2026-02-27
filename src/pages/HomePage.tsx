import React, { useState, useEffect, useCallback, useMemo } from 'react';
import staticMoviesData from '@/data/movies.json';
import { Navbar } from '@/components/layout/Navbar';
import { MovieCard } from '@/components/MovieCard';
import { Moon, Star, Award, BarChart3, Tag, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { Movie, VoteType } from '@shared/types';
const PRIOR_VOTES = 15;
const PRIOR_NAP_RATE = 0.8;
const STABILITY_BONUS = 2; // 2% bonus for optimal length
export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const computeNapScore = useCallback((nap: number, engaging: number, duration?: number): number => {
    const total = (nap ?? 0) + (engaging ?? 0);
    const bayesianBase = ((nap ?? 0) + PRIOR_VOTES * PRIOR_NAP_RATE) / (total + PRIOR_VOTES);
    let score = Math.round(bayesianBase * 100);
    // Apply Duration Weighting: Films >= 120m receive a stability bonus
    if (duration && duration >= 120) {
      score += STABILITY_BONUS;
    }
    return Math.min(100, score);
  }, []);
  useEffect(() => {
    document.title = 'NapMovies 🌙 | The Archive';
    const processed = (staticMoviesData as Movie[]).map(m => {
      const userVote = localStorage.getItem(`user_voted_${m.id}`);
      let vNap = m.votesNap ?? 0;
      let vEng = m.votesEngaging ?? 0;
      if (userVote === 'nap') vNap += 1;
      else if (userVote === 'engaging') vEng += 1;
      return {
        ...m,
        votesNap: vNap,
        votesEngaging: vEng,
        napScore: computeNapScore(vNap, vEng, m.duration)
      };
    });
    const sorted = processed.sort((a, b) => (b.napScore || 0) - (a.napScore || 0));
    setMovies(sorted);
  }, [computeNapScore]);
  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    (staticMoviesData as Movie[]).forEach(m => {
      m.tags.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => name);
  }, []);
  const handleLocalVote = (id: string, type: VoteType) => {
    const userVotedKey = `user_voted_${id}`;
    if (localStorage.getItem(userVotedKey)) {
      toast.error("Vocal signature already recorded.");
      return;
    }
    localStorage.setItem(userVotedKey, type);
    toast.success('Signal received. Sleep well.');
    setMovies(prev => {
      const updated = prev.map(m => {
        if (m.id !== id) return m;
        const vNap = type === 'nap' ? (m.votesNap ?? 0) + 1 : (m.votesNap ?? 0);
        const vEng = type === 'engaging' ? (m.votesEngaging ?? 0) + 1 : (m.votesEngaging ?? 0);
        return {
          ...m,
          votesNap: vNap,
          votesEngaging: vEng,
          napScore: computeNapScore(vNap, vEng, m.duration)
        };
      });
      return [...updated].sort((a, b) => (b.napScore || 0) - (a.napScore || 0));
    });
  };
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden flex flex-col font-mono">
      <div className="crt-overlay" />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-16 space-y-10">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 border border-primary/10 bg-primary/5 relative group">
                    <Moon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-widest uppercase text-white leading-none">
                  NAP <span className="text-primary">MOVIES</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto italic font-bold leading-relaxed">
                  "The 10-Point Optimal Index. A permanent documentation of neuro-regulatory cinema."
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border bg-black/20 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-retro-accent tracking-[0.2em] uppercase">
                    <BarChart3 className="w-3.5 h-3.5" /> Bayesian_System_Summary
                  </div>
                  <div className="text-[11px] leading-relaxed text-retro-text/60">
                    Integration of <span className="text-white font-bold">duration weighting (+2%)</span> and
                    <span className="text-white mx-1 font-bold">audio-profile stability</span> into the final rank.
                    Baseline established at 80% consensus.
                  </div>
                </div>
                <div className="border border-border bg-black/20 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-retro-accent tracking-[0.2em] uppercase">
                    <Tag className="w-3.5 h-3.5" /> High_Frequency_Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topTags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-[9px] rounded-none px-2 py-0 h-4 border-white/10 uppercase opacity-60">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </header>
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-[10px] font-black tracking-[0.4em] flex items-center gap-2 text-primary/80 uppercase">
                    <Database className="w-3.5 h-3.5" /> ARCHIVE_INDEX_STABLE
                  </h2>
                  <div className="hidden sm:flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase">
                    <Award className="w-3 h-3" />
                    v1.0.1_ENRICHED
                  </div>
                </div>
              </div>
              <div className="grid gap-8">
                {movies.map((movie, idx) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    rank={idx + 1}
                    onVote={(type) => handleLocalVote(movie.id, type)}
                    isVoting={false}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer className="border-t border-border py-10 mt-16 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">
              © {new Date().getFullYear()} NAP_MOVIES_ARCHIVE // DATA_SET: ENRICHED_50 // FINAL_STATE
            </div>
            <div className="text-[8px] font-mono mt-2 opacity-10 tracking-widest uppercase pointer-events-none">
              BUILD_ID: 1.0.1_STATIC_ARCHIVE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}