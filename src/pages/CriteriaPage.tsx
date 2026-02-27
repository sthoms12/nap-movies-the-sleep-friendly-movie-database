import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Info, Calculator, Eye, ShieldCheck, Zap } from 'lucide-react';
export function CriteriaPage() {
  useEffect(() => {
    document.title = 'NapMovies 🌙 | Methodology';
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden flex flex-col font-mono">
      <div className="crt-overlay" />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-12 space-y-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">
                THE <span className="text-primary">METHODOLOGY</span>
              </h1>
              <p className="text-muted-foreground text-sm border-l-2 border-primary/30 pl-4 py-1">
                System Documentation // Revision 1.0.0_STABLE
              </p>
            </header>
            <section className="space-y-12">
              <div className="border border-border bg-card/50 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <Calculator className="w-6 h-6" />
                  <h2 className="text-xl font-bold uppercase tracking-widest">Bayesian Scoring</h2>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-retro-text/80">
                  <p>
                    Unlike simple averages which can be volatile with low vote counts, NapMovies uses a 
                    <span className="text-white mx-1">Bayesian Average</span> to provide stability to the rankings.
                  </p>
                  <div className="bg-black/40 p-4 border border-border font-mono text-[11px] space-y-2">
                    <div className="text-primary opacity-70">// CALCULATION_LOGIC</div>
                    <div>PRIOR_VOTES (C) = 15</div>
                    <div>PRIOR_NAP_RATE (m) = 0.80 (80%)</div>
                    <div className="pt-2 text-white italic">
                      Score = (Votes_Nap + C * m) / (Total_Votes + C)
                    </div>
                  </div>
                  <p>
                    Every movie starts with a "virtual" 15 votes at an 80% nap approval rating. This 
                    results in a starting baseline of <span className="text-retro-accent">~82%</span>. 
                    As the community votes, the score shifts toward the real consensus.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-border p-6 space-y-4">
                  <div className="flex items-center gap-2 text-retro-accent">
                    <Eye className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-xs tracking-widest">Visual Stillness</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Movies with static camera work, long takes, and limited rapid-fire editing are preferred. 
                    High-contrast flashing and strobe effects are grounds for immediate "Too Engaging" status.
                  </p>
                </div>
                <div className="border border-border p-6 space-y-4">
                  <div className="flex items-center gap-2 text-retro-accent">
                    <Zap className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-xs tracking-widest">Audio Dynamics</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We value "flat" audio profiles. Sudden explosions or high-frequency screamers disrupt the 
                    rest cycle. Ambient scores and low-decibel dialogue are the gold standard.
                  </p>
                </div>
                <div className="border border-border p-6 space-y-4">
                  <div className="flex items-center gap-2 text-retro-accent">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-xs tracking-widest">Plot Predictability</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tension is the enemy of sleep. The archive favors "Familiar" films where the outcome 
                    is already known, allowing the brain to disengage from active processing.
                  </p>
                </div>
                <div className="border border-border p-6 space-y-4">
                  <div className="flex items-center gap-2 text-retro-accent">
                    <Info className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-xs tracking-widest">Atmospheric Mood</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Rain, snow, space, and low-light cinematography provide a cocoon-like viewing experience. 
                    Films set in daylight or high-energy environments are penalised.
                  </p>
                </div>
              </div>
              <footer className="pt-8 border-t border-border opacity-40 text-[10px] uppercase text-center tracking-[0.2em]">
                End of Document // Secure Archive Node 04 // No Unauthorized Edits
              </footer>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}