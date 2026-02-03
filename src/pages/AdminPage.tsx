import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import type { Submission } from '@shared/types';
import { Check, X, ShieldAlert } from 'lucide-react';
export function AdminPage() {
  const queryClient = useQueryClient();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState('');
  useEffect(() => {
    document.title = 'NapMovies 🌙 | Terminal';
  }, []);
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: () => api<Submission[]>('/api/admin/submissions'),
    enabled: isAuthorized
  });
  const moderateMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      api(`/api/admin/submissions/${id}/moderate`, {
        method: 'POST',
        body: JSON.stringify({ action })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Archive updated.');
    }
  });
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-retro-bg text-retro-text flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-retro-muted/40 bg-retro-card p-12 space-y-10 shadow-2xl shadow-black/50">
          <div className="flex justify-center text-retro-accent animate-pulse"><ShieldAlert className="w-12 h-12" /></div>
          <div className="space-y-3">
            <h1 className="text-center font-black uppercase tracking-[0.4em] text-sm text-white">SECURE_TERMINAL_V4</h1>
            <p className="text-center text-[10px] opacity-40 tracking-[0.2em]">IDENTIFICATION_REQUIRED</p>
          </div>
          <input
            type="password"
            placeholder="ACCESS_KEY"
            className="w-full bg-black/40 border border-retro-muted/40 p-5 text-center text-lg rounded-none focus:border-retro-accent focus:ring-1 focus:ring-retro-accent/20 outline-none transition-all placeholder:opacity-20 text-retro-accent"
            value={pass}
            onKeyDown={(e) => e.key === 'Enter' && pass === 'sleep' && setIsAuthorized(true)}
            onChange={(e) => setPass(e.target.value)}
          />
          <Button
            className="w-full bg-retro-accent/10 text-retro-accent border border-retro-accent/30 uppercase text-[11px] font-black tracking-[0.3em] rounded-none h-14 hover:bg-retro-accent hover:text-retro-bg transition-all"
            onClick={() => {
              if (pass === 'sleep') setIsAuthorized(true);
              else toast.error('Key rejected.');
            }}
          >
            Authenticate
          </Button>
        </div>
        <Toaster theme="dark" position="bottom-center" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text relative">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-16">
          <div className="max-w-4xl mx-auto pt-8">
            <header className="mb-16 border-b border-retro-muted/30 pb-10 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-[0.3em] text-white">MODERATION_QUEUE</h1>
                <p className="text-retro-text/60 text-xs mt-3 tracking-widest">Pending entries awaiting council verification.</p>
              </div>
              <div className="text-[10px] text-retro-accent font-black tracking-[0.2em] border border-retro-accent/20 px-3 py-1 bg-retro-accent/5">
                ROOT_ACCESS_LEVEL_A
              </div>
            </header>
            {isLoading ? (
              <div className="text-center py-24 space-y-4">
                <div className="w-10 h-10 border-2 border-retro-accent border-t-transparent animate-spin mx-auto" />
                <p className="text-[10px] opacity-40 tracking-[0.5em] uppercase">Syncing_with_primary_node...</p>
              </div>
            ) : submissions?.filter(s => s.status === 'pending').length === 0 ? (
              <div className="py-40 text-center border border-dashed border-retro-muted/20 opacity-30 text-[11px] tracking-[0.5em] uppercase">
                NO_PENDING_PROPOSALS_IDLE_STATE
              </div>
            ) : (
              <div className="space-y-8">
                {submissions?.filter(s => s.status === 'pending').map((sub) => (
                  <div key={sub.id} className="border border-retro-muted/30 p-10 bg-retro-card/60 flex flex-col md:flex-row gap-10 justify-between items-start md:items-center hover:bg-retro-card transition-all hover:border-retro-accent/30 shadow-lg hover:shadow-retro-accent/5">
                    <div className="space-y-5 flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-black uppercase tracking-widest text-white">{sub.title}</h3>
                        <span className="text-retro-accent/60 font-bold text-sm">({sub.year})</span>
                      </div>
                      <div className="relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-retro-accent/30" />
                        <p className="text-sm italic text-retro-text/80 leading-relaxed pl-6 max-w-xl font-light">
                          "{sub.reason}"
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <Button
                        variant="outline"
                        className="flex-1 md:flex-none border-retro-accent/40 text-retro-accent font-black hover:bg-retro-accent hover:text-retro-bg rounded-none text-[11px] tracking-widest h-12 px-8 transition-all"
                        onClick={() => moderateMutation.mutate({ id: sub.id, action: 'approve' })}
                      >
                        <Check className="w-4 h-4 mr-2" /> APPROVE
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 md:flex-none border-retro-danger/40 text-retro-danger font-black hover:bg-retro-danger hover:text-retro-bg rounded-none text-[11px] tracking-widest h-12 px-8 transition-all"
                        onClick={() => moderateMutation.mutate({ id: sub.id, action: 'reject' })}
                      >
                        <X className="w-4 h-4 mr-2" /> REJECT
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}