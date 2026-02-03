import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import type { Submission } from '@shared/types';
import { Check, X, ShieldAlert, Database, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function AdminPage() {
  const queryClient = useQueryClient();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState('');
  const [errorCount, setErrorCount] = useState(0);
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
      toast.success('Index updated successfully.');
    },
    onError: () => toast.error('Moderation signal lost.')
  });
  const resetMutation = useMutation({
    mutationFn: () => api('/api/admin/reset-seeds', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      toast.success('System Index and Queues Purged and Resynchronized');
    },
    onError: () => toast.error('Resync failure.')
  });
  const handleLogin = () => {
    if (pass === 'sleep') {
      setIsAuthorized(true);
      toast.success('Access granted.');
    } else {
      setErrorCount(prev => prev + 1);
      toast.error('INVALID_ACCESS_KEY');
      setPass('');
    }
  };
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-retro-bg text-retro-text flex items-center justify-center p-4 relative">
        <div className="crt-overlay" />
        <motion.div
          key={errorCount}
          initial={errorCount > 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full border border-retro-muted/40 bg-retro-card p-12 space-y-10 shadow-2xl shadow-black/80 relative z-10"
        >
          <div className="flex justify-center text-retro-accent">
            <ShieldAlert className="w-16 h-16 animate-pulse" />
          </div>
          <div className="space-y-3">
            <h1 className="text-center font-black uppercase tracking-[0.5em] text-sm text-white">SECURE_TERMINAL_V5</h1>
            <p className="text-center text-[10px] opacity-40 tracking-[0.3em] uppercase">Identification_Required_For_Root_Access</p>
          </div>
          <input
            type="password"
            placeholder="ACCESS_KEY"
            className="w-full bg-black/40 border border-retro-muted/40 p-6 text-center text-xl rounded-none focus:border-retro-accent focus:ring-1 focus:ring-retro-accent/20 outline-none transition-all placeholder:opacity-10 text-retro-accent tracking-[0.5em]"
            value={pass}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            onChange={(e) => setPass(e.target.value)}
            autoFocus
          />
          <Button
            className="w-full bg-retro-accent/10 text-retro-accent border border-retro-accent/30 uppercase text-[11px] font-black tracking-[0.4em] rounded-none h-16 hover:bg-retro-accent hover:text-retro-bg transition-all duration-slow"
            onClick={handleLogin}
          >
            Authenticate
          </Button>
          {errorCount > 0 && (
            <p className="text-center text-retro-danger text-[9px] font-bold tracking-widest uppercase animate-bounce">
              Failed_Attempts: {errorCount}
            </p>
          )}
        </motion.div>
        <Toaster theme="dark" position="bottom-center" />
      </div>
    );
  }
  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') ?? [];
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text relative">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-16">
          <div className="max-w-4xl mx-auto pt-8">
            <header className="mb-16 border-b border-retro-muted/30 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-[0.3em] text-white">MODERATION_QUEUE</h1>
                <p className="text-retro-text/60 text-xs mt-4 tracking-[0.2em] font-medium">Pending Council Verification for Index Entry.</p>
              </div>
              <div className="flex gap-4 items-center">
                <Button
                  onClick={() => {
                    if (window.confirm('WARNING: THIS WILL PURGE ALL SUBMISSIONS AND RESET THE INDEX. PROCEED?')) {
                      resetMutation.mutate();
                    }
                  }}
                  disabled={resetMutation.isPending}
                  variant="outline"
                  className="border-retro-danger/40 text-retro-danger hover:bg-retro-danger hover:text-retro-bg rounded-none text-[10px] tracking-[0.2em] h-11 px-5 transition-all font-black uppercase"
                >
                  <Database className="w-4 h-4 mr-2" /> PURGE_SYSTEM
                </Button>
                <div className="hidden sm:block text-[10px] text-retro-accent font-black tracking-[0.2em] border border-retro-accent/30 px-4 py-2 bg-retro-accent/5">
                  ROOT_ACCESS: LVL_A
                </div>
              </div>
            </header>
            {isLoading ? (
              <div className="text-center py-32 space-y-6">
                <div className="w-12 h-12 border-4 border-retro-accent border-t-transparent animate-spin mx-auto" />
                <p className="text-[11px] opacity-40 tracking-[0.5em] uppercase font-bold">Synchronizing_With_Global_Durable_Object...</p>
              </div>
            ) : pendingSubmissions.length === 0 ? (
              <div className="py-48 text-center border border-dashed border-retro-muted/20 bg-retro-card/20 group">
                <AlertCircle className="w-12 h-12 text-retro-muted/40 mx-auto mb-6 group-hover:text-retro-accent/30 transition-colors" />
                <p className="text-[11px] tracking-[0.5em] uppercase font-black opacity-30">NO_PENDING_PROPOSALS_IDLE_STATE</p>
              </div>
            ) : (
              <div className="space-y-10">
                <AnimatePresence mode="popLayout">
                  {pendingSubmissions.map((sub) => (
                    <motion.div
                      key={sub.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border border-retro-muted/30 p-10 bg-retro-card/80 flex flex-col md:flex-row gap-10 justify-between items-start md:items-center hover:border-retro-accent/50 transition-all shadow-xl"
                    >
                      <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                          <h3 className="text-2xl font-black uppercase tracking-widest text-white">{sub.title}</h3>
                          <span className="text-retro-accent/50 font-black text-sm tracking-tighter">[{sub.year}]</span>
                        </div>
                        <div className="relative">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-retro-accent/20" />
                          <p className="text-base italic text-retro-text/90 leading-relaxed pl-8 max-w-2xl font-light">
                            "{sub.reason}"
                          </p>
                        </div>
                        <div className="text-[9px] opacity-30 uppercase tracking-widest font-bold">
                          Received_At: {new Date(sub.createdAt).toISOString()}
                        </div>
                      </div>
                      <div className="flex gap-4 w-full md:w-auto">
                        <Button
                          variant="outline"
                          disabled={moderateMutation.isPending}
                          className="flex-1 md:flex-none border-retro-accent/40 text-retro-accent font-black hover:bg-retro-accent hover:text-retro-bg rounded-none text-[11px] tracking-widest h-14 px-10 transition-all"
                          onClick={() => moderateMutation.mutate({ id: sub.id, action: 'approve' })}
                        >
                          <Check className="w-5 h-5 mr-2" /> APPROVE
                        </Button>
                        <Button
                          variant="outline"
                          disabled={moderateMutation.isPending}
                          className="flex-1 md:flex-none border-retro-danger/40 text-retro-danger font-black hover:bg-retro-danger hover:text-retro-bg rounded-none text-[11px] tracking-widest h-14 px-10 transition-all"
                          onClick={() => moderateMutation.mutate({ id: sub.id, action: 'reject' })}
                        >
                          <X className="w-5 h-5 mr-2" /> REJECT
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}