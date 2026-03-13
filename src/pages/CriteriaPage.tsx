import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import {
  Calculator, Eye, ShieldCheck, Zap,
  Clock, Volume2, UserCheck, Wind, LayoutPanelLeft,
  Search, BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CriteriaPage() {
  useEffect(() => {
    document.title = 'NapMovies | Methodology';
    window.scrollTo(0, 0);
  }, []);

  const criteria = [
    {
      title: "Familiar Rewatch",
      icon: <UserCheck className="w-5 h-5" />,
      desc: "Priority given to films where the narrative is already internalized, allowing the brain to disengage from active plot tracking.",
      case: "Harry Potter Series",
      tag: "Neuro-Disengagement"
    },
    {
      title: "Calm Audio Profiles",
      icon: <Volume2 className="w-5 h-5" />,
      desc: "Strict penalization for sharp audio transients (explosions, screams). We favor 'flat' wave patterns and sustained decibel levels.",
      case: "Arrival",
      tag: "Transient-Suppression"
    },
    {
      title: "Low Dialogue Density",
      icon: <BookOpen className="w-5 h-5" />,
      desc: "Movies that rely on visual storytelling or ambient vocalizing rather than rapid-fire exposition minimize cognitive load.",
      case: "WALL-E",
      tag: "Low-Cognitive-Load"
    },
    {
      title: "Rhythmic Pacing",
      icon: <LayoutPanelLeft className="w-5 h-5" />,
      desc: "Consistency in scene length and transition speed creates a predictable temporal pulse that aids sleep cycles.",
      case: "Moneyball",
      tag: "Temporal-Pulse"
    },
    {
      title: "Atmospheric Mood",
      icon: <Wind className="w-5 h-5" />,
      desc: "Preference for rain, snow, deep space, or night-time settings which act as a visual 'white noise' for the viewer.",
      case: "Blade Runner 2049",
      tag: "Visual-Cocoon"
    },
    {
      title: "Visual Stillness",
      icon: <Eye className="w-5 h-5" />,
      desc: "Static camera work and long takes (no shaky cam) reduce eye-tracking fatigue and sensory stimulation.",
      case: "Columbus",
      tag: "Minimal-Motion"
    },
    {
      title: "Cortisol-Free Plot",
      icon: <ShieldCheck className="w-5 h-5" />,
      desc: "Absence of high-stakes jumpscares or acute existential dread. Narrative comfort is the baseline requirement.",
      case: "The Shawshank Redemption",
      tag: "Cortisol-Control"
    },
    {
      title: "Taxonomic Comfort",
      icon: <Search className="w-5 h-5" />,
      desc: "High density of approved tags (e.g., 'Snow', 'Synth', 'Quiet') indicates a strong statistical match for sleep-suitability.",
      case: "Wind River",
      tag: "Data-Signature"
    },
    {
      title: "Ambient Scoring",
      icon: <Zap className="w-5 h-5" />,
      desc: "Films featuring drone-based or synthesizer-heavy soundtracks provide a continuous sonic texture that masks external noise.",
      case: "Tron: Legacy",
      tag: "Sonic-Texture"
    },
    {
      title: "Extended Runtime",
      icon: <Clock className="w-5 h-5" />,
      desc: "Optimal index rewards films over 120 minutes, ensuring the user is fully in deep sleep before the credits (and credits-silence) roll.",
      case: "Lord of the Rings",
      tag: "2h+_Optimal"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden flex flex-col font-mono">
      <div className="crt-overlay" />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-12 space-y-6">
            <div className="inline-block bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-black tracking-widest text-primary uppercase">
              Methodology_v1.0.1_REVISED
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-tight">
              THE <span className="text-primary">TEN-POINT</span> FRAMEWORK
            </h1>
            <div className="border-l-2 border-retro-accent/40 pl-6 py-4 space-y-3">
              <p className="text-retro-text/90 text-sm md:text-base leading-relaxed max-w-2xl font-bold">
                "Low-Stress Cinema as a Neuro-Regulatory Tool."
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-xl italic">
                The Nap Index is not a measure of cinematic quality, but of physiological compatibility with the transition to REM sleep.
              </p>
            </div>
          </header>
          <section className="mb-16">
            <div className="bg-card/30 border border-border p-8 mb-12">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Calculator className="w-6 h-6" />
                <h2 className="text-xl font-black uppercase tracking-[0.2em]">The Catalog Protocol</h2>
              </div>
              <p className="text-sm text-retro-text/70 leading-relaxed mb-6">
                Each movie is assigned a <span className="text-white font-bold">static nap score</span> and curated tags directly in the site data file. That keeps the archive easy to maintain while preserving a consistent ranked list.
              </p>
              <div className="bg-black/60 p-5 border border-white/5 font-mono text-[10px] flex flex-col md:flex-row gap-6 opacity-80">
                <div className="flex-1 space-y-1">
                  <div className="text-retro-accent uppercase font-black tracking-widest mb-2">// CURATION_SIGNALS</div>
                  <div>- Soft audio profile</div>
                  <div>- Low visual intensity</div>
                  <div>- Familiar or steady pacing</div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-retro-accent uppercase font-black tracking-widest mb-2">// DATA_FIELDS</div>
                  <div>- napScore: 0-100</div>
                  <div>- status: active | archived</div>
                  <div className="text-white mt-2 font-black italic">SOURCE = public/movies.json</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criteria.map((item, i) => (
                <Card key={i} className="bg-card/20 border-border/50 rounded-none hover:border-retro-accent/40 transition-colors group">
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 border border-border group-hover:bg-retro-accent/10 group-hover:text-retro-accent transition-colors">
                        {item.icon}
                      </div>
                      <Badge variant="outline" className="text-[8px] border-white/10 uppercase tracking-widest opacity-50 px-1.5 py-0 h-4">
                        {item.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-white group-hover:text-retro-accent transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                    <div className="pt-2 border-t border-border/30">
                      <div className="text-[9px] font-black uppercase tracking-widest text-retro-accent/60 mb-1">Archetype_Study:</div>
                      <div className="text-[10px] text-white font-bold uppercase tracking-tight">{item.case}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <footer className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
            <div className="text-[9px] uppercase tracking-[0.3em] font-black">
              SECURE_ARCHIVE_NODE_04 // REVISION_1.0.1_FINAL
            </div>
            <div className="flex gap-8 text-[9px] uppercase font-bold tracking-widest">
              <span>EST. 2024</span>
              <span>IMMUTABLE_DATA_SET</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
