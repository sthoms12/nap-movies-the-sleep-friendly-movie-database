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
      toast.success('Operation successful.');
    }
  });
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-retro-bg text-retro-text flex items-center justify-center font-mono p-4">
        <div className="max-w-sm w-full border border-retro-muted/20 bg-retro-card p-10 space-y-8">
          <div className="flex justify-center opacity-40"><ShieldAlert className="w-10 h-10" /></div>
          <div className="space-y-2">
            <h1 className="text-center font-bold uppercase tracking-[0.3em] text-xs opacity-80">Access Terminal</h1>
            <p className="text-center text-[9px] opacity-30 tracking-widest">ENCRYPTED_SESSION</p>
          </div>
          <input
            type="password"
            placeholder="ACCESS_KEY"
            className="w-full bg-retro-bg/50 border border-retro-muted/20 p-4 text-center text-sm rounded-none focus:border-retro-accent/40 outline-none transition-colors"
            value={pass}
            onKeyDown={(e) => e.key === 'Enter' && pass === 'sleep' && setIsAuthorized(true)}
            onChange={(e) => setPass(e.target.value)}
          />
          <Button
            className="w-full bg-retro-muted/20 text-retro-text border border-retro-muted/30 uppercase text-[10px] tracking-widest rounded-none hover:bg-retro-accent hover:text-retro-bg transition-all"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="min-h-screen bg-retro-bg text-retro-text font-mono">
          <div className="crt-overlay" />
          <Navbar />
          <div className="max-w-4xl mx-auto pt-8">
            <header className="mb-14 border-b border-retro-muted/10 pb-8 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-[0.2em]">Queue</h1>
                <p className="text-retro-muted text-xs mt-2 opacity-50">Awaiting moderation.</p>
              </div>
              <div className="text-[9px] opacity-20 tracking-widest font-bold">ADMIN_AUTH_ACTIVE</div>
            </header>
            {isLoading ? (
              <p className="text-xs opacity-30 animate-pulse tracking-widest uppercase text-center py-20">Syncing with server...</p>
            ) : submissions?.filter(s => s.status === 'pending').length === 0 ? (
              <div className="py-32 text-center border border-dashed border-retro-muted/10 opacity-30 text-[10px] tracking-[0.4em] uppercase">
                No pending proposals.
              </div>
            ) : (
              <div className="space-y-6">
                {submissions?.filter(s => s.status === 'pending').map((sub) => (
                  <div key={sub.id} className="border border-retro-muted/10 p-8 bg-retro-card/40 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center hover:bg-retro-card/60 transition-colors">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-lg font-bold uppercase tracking-widest opacity-90">{sub.title} ({sub.year})</h3>
                      <p className="text-xs italic text-retro-muted/80 leading-relaxed border-l border-retro-muted/20 pl-4">"{sub.reason}"</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <Button
                        variant="outline"
                        className="flex-1 md:flex-none border-retro-accent/20 text-retro-accent/60 hover:bg-retro-accent/10 hover:text-retro-accent rounded-none text-[10px] tracking-widest"
                        onClick={() => moderateMutation.mutate({ id: sub.id, action: 'approve' })}
                      >
                        <Check className="w-3 h-3 mr-2" /> APPROVE
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 md:flex-none border-retro-danger/20 text-retro-danger/60 hover:bg-retro-danger/10 hover:text-retro-danger rounded-none text-[10px] tracking-widest"
                        onClick={() => moderateMutation.mutate({ id: sub.id, action: 'reject' })}
                      >
                        <X className="w-3 h-3 mr-2" /> REJECT
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Toaster theme="dark" position="bottom-center" />
        </div>
      </div>
    </div>
  );
}