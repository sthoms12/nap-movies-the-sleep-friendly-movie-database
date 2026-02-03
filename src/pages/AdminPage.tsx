import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Submission } from '@shared/types';
import { Check, X, Database, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function AdminPage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    document.title = 'NapMovies 🌙 | Terminal';
  }, []);
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: () => api<Submission[]>('/api/admin/submissions'),
  });
  const moderateMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      api(`/api/admin/submissions/${id}/moderate`, {
        method: 'POST',
        body: JSON.stringify({ action })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      toast.success('Staging queue updated successfully.');
    },
    onError: (err: any) => toast.error(err.message || 'Moderation signal lost.')
  });
  const purgeMutation = useMutation({
    mutationFn: () => api<{ message: string }>('/api/admin/reset-seeds', { method: 'POST' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      toast.success(data.message || 'Queue purged.');
    },
    onError: (err: any) => toast.error(err.message || 'Purge protocol failed.')
  });
  const handlePurge = () => {
    if (window.confirm('CRITICAL: PURGE ALL PENDING SUBMISSIONS? THIS ACTION IS IRREVERSIBLE.')) {
      purgeMutation.mutate();
    }
  };
  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') ?? [];
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text relative">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-10 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <header className="mb-16 border-b border-retro-muted/30 pb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-[0.3em] text-white">ADMIN_TERMINAL</h1>
                  <p className="text-retro-text/60 text-xs mt-4 tracking-[0.2em] font-medium">Staging Control & Submission Moderation.</p>
                </div>
                <div className="flex gap-4 items-center">
                  <Button
                    onClick={handlePurge}
                    disabled={purgeMutation.isPending}
                    variant="outline"
                    className="border-retro-danger/40 text-retro-danger hover:bg-retro-danger hover:text-retro-bg rounded-none text-[10px] tracking-[0.2em] font-black uppercase h-10 px-6"
                  >
                    <Database className="w-4 h-4 mr-2" /> 
                    {purgeMutation.isPending ? 'PURGING...' : 'PURGE_QUEUE'}
                  </Button>
                </div>
              </div>
              <div className="bg-retro-accent/5 border border-retro-accent/20 p-6 flex gap-4 items-start">
                <Info className="w-6 h-6 text-retro-accent shrink-0 mt-1" />
                <div className="space-y-3">
                  <p className="text-[11px] tracking-widest font-bold uppercase text-retro-accent leading-relaxed">
                    SYSTEM NOTICE: ARCHIVE_MODE_ACTIVE
                  </p>
                  <p className="text-[10px] tracking-wider text-retro-text/80 leading-relaxed">
                    This terminal manages the <strong>Dynamic Staging Queue</strong>. The public facing Index is currently an <strong>Immutable Static Bundle</strong>. 
                    Approving a proposal here stages it for the next system deployment. To permanently update the archive, you must modify the <code className="bg-black/40 px-1 font-mono text-retro-accent">src/data/movies.json</code> source file.
                  </p>
                </div>
              </div>
            </header>
            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black tracking-[0.4em] text-white uppercase">Staging_Proposals ({pendingSubmissions.length})</h2>
                {pendingSubmissions.length > 0 && <span className="animate-pulse h-2 w-2 rounded-full bg-retro-accent" />}
              </div>
              {isLoading ? (
                <div className="text-center py-32 space-y-6">
                  <div className="w-12 h-12 border-4 border-retro-accent border-t-transparent animate-spin mx-auto" />
                  <p className="text-[11px] opacity-40 tracking-[0.5em] uppercase font-bold">Connecting_Terminal...</p>
                </div>
              ) : pendingSubmissions.length === 0 ? (
                <div className="py-48 text-center border border-dashed border-retro-muted/20 bg-retro-card/20">
                  <AlertCircle className="w-12 h-12 text-retro-muted/40 mx-auto mb-6" />
                  <p className="text-[11px] tracking-[0.5em] uppercase font-black opacity-30">TERMINAL_IDLE_STAGING_EMPTY</p>
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
                        className="border border-retro-muted/30 p-10 bg-retro-card/80 flex flex-col md:flex-row gap-10 justify-between items-start md:items-center hover:border-retro-accent/50 transition-all group"
                      >
                        <div className="space-y-6 flex-1">
                          <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-black uppercase tracking-widest text-white group-hover:text-retro-accent transition-colors">{sub.title}</h3>
                            <span className="text-retro-accent/50 font-black text-sm">[{sub.year}]</span>
                          </div>
                          <p className="text-base italic text-retro-text/90 leading-relaxed font-light">"{sub.reason}"</p>
                          <div className="text-[9px] uppercase tracking-widest text-retro-text/30 font-bold">
                            Submission_ID: {sub.id.slice(0, 8)}... | Received: {new Date(sub.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                          <Button
                            variant="outline"
                            disabled={moderateMutation.isPending}
                            className="flex-1 md:flex-none border-retro-accent/40 text-retro-accent font-black hover:bg-retro-accent hover:text-retro-bg rounded-none text-[11px] h-14 px-10 transition-all"
                            onClick={() => moderateMutation.mutate({ id: sub.id, action: 'approve' })}
                          >
                            <Check className="w-5 h-5 mr-2" /> STAGE
                          </Button>
                          <Button
                            variant="outline"
                            disabled={moderateMutation.isPending}
                            className="flex-1 md:flex-none border-retro-danger/40 text-retro-danger font-black hover:bg-retro-danger hover:text-retro-bg rounded-none text-[11px] h-14 px-10 transition-all"
                            onClick={() => moderateMutation.mutate({ id: sub.id, action: 'reject' })}
                          >
                            <X className="w-5 h-5 mr-2" /> DROP
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}