import React, { useState } from 'react';
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
      toast.success('Action recorded.');
    }
  });
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-retro-bg text-retro-text flex items-center justify-center font-mono p-4">
        <div className="max-w-sm w-full border border-retro-muted/30 p-8 space-y-6">
          <div className="flex justify-center"><ShieldAlert className="w-12 h-12 text-retro-danger" /></div>
          <h1 className="text-center font-bold uppercase tracking-widest">Restricted Area</h1>
          <input 
            type="password" 
            placeholder="Enter Admin Key" 
            className="w-full bg-retro-card border border-retro-muted/30 p-3 text-center"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <Button 
            className="w-full bg-retro-text text-retro-bg uppercase rounded-none"
            onClick={() => {
              if (pass === 'sleep') setIsAuthorized(true);
              else toast.error('Invalid key');
            }}
          >
            Access Terminal
          </Button>
        </div>
        <Toaster theme="dark" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text font-mono">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-12 border-b border-retro-muted/30 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold uppercase">Submission Queue</h1>
            <p className="text-retro-muted">Review incoming movie proposals.</p>
          </div>
          <div className="text-2xs opacity-50">ADMIN_MODE: ACTIVE</div>
        </header>
        {isLoading ? (
          <p>Loading queue...</p>
        ) : submissions?.filter(s => s.status === 'pending').length === 0 ? (
          <div className="py-20 text-center border border-dashed border-retro-muted/30 opacity-50">
            NO PENDING SUBMISSIONS
          </div>
        ) : (
          <div className="space-y-4">
            {submissions?.filter(s => s.status === 'pending').map((sub) => (
              <div key={sub.id} className="border border-retro-muted/30 p-6 bg-retro-card flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="space-y-1 flex-1">
                  <h3 className="text-xl font-bold uppercase">{sub.title} ({sub.year})</h3>
                  <p className="text-sm italic text-retro-muted">"{sub.reason}"</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-retro-accent text-retro-accent hover:bg-retro-accent hover:text-retro-bg rounded-none"
                    onClick={() => moderateMutation.mutate({ id: sub.id, action: 'approve' })}
                  >
                    <Check className="w-4 h-4 mr-2" /> APPROVE
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-retro-danger text-retro-danger hover:bg-retro-danger hover:text-retro-bg rounded-none"
                    onClick={() => moderateMutation.mutate({ id: sub.id, action: 'reject' })}
                  >
                    <X className="w-4 h-4 mr-2" /> REJECT
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Toaster theme="dark" />
    </div>
  );
}