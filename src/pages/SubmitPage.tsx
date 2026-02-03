import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast, Toaster } from 'sonner';
import { Send, ArrowLeft } from 'lucide-react';
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  year: z.number().min(1888).max(new Date().getFullYear() + 1),
  reason: z.string().min(10, 'Minimum 10 characters required')
});
type FormValues = z.infer<typeof schema>;
export function SubmitPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'NapMovies 🌙 | Propose';
  }, []);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { year: new Date().getFullYear() }
  });
  const mutation = useMutation({
    mutationFn: (values: FormValues) => api('/api/submit', {
      method: 'POST',
      body: JSON.stringify(values)
    }),
    onSuccess: () => {
      toast.success('Proposal encrypted and sent.');
      setTimeout(() => navigate('/'), 2000);
    },
    onError: () => toast.error('Transmission failure.')
  });
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text relative">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-16">
          <div className="max-w-2xl mx-auto pt-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[10px] font-bold text-retro-accent/60 hover:text-retro-accent transition-all mb-12 tracking-[0.3em] uppercase"
            >
              <ArrowLeft className="w-3 h-3" /> RETURN_TO_ARCHIVE
            </button>
            <header className="mb-16 border-b border-retro-muted/20 pb-10">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] text-white">PROPOSE_ENTRY</h1>
              <p className="text-retro-text/60 text-xs mt-4 tracking-wider leading-relaxed">
                Help curate the quietest database on the internet. Submissions are reviewed for audio dynamic range and visual pacing.
              </p>
            </header>
            <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-12">
              <div className="space-y-4">
                <Label htmlFor="title" className="uppercase text-[11px] font-black tracking-[0.2em] text-retro-accent/80">Film Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="The cinematic title..."
                  className="bg-black/20 border-retro-muted/40 focus:border-retro-accent/60 focus:ring-1 focus:ring-retro-accent/20 rounded-none h-14 text-base placeholder:opacity-30 transition-all"
                />
                {errors.title && <p className="text-retro-danger text-[10px] font-bold tracking-widest uppercase">{errors.title.message}</p>}
              </div>
              <div className="space-y-4">
                <Label htmlFor="year" className="uppercase text-[11px] font-black tracking-[0.2em] text-retro-accent/80">Release Year</Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  className="bg-black/20 border-retro-muted/40 focus:border-retro-accent/60 focus:ring-1 focus:ring-retro-accent/20 rounded-none h-14 text-base transition-all"
                />
                {errors.year && <p className="text-retro-danger text-[10px] font-bold tracking-widest uppercase">{errors.year.message}</p>}
              </div>
              <div className="space-y-4">
                <Label htmlFor="reason" className="uppercase text-[11px] font-black tracking-[0.2em] text-retro-accent/80">Nap Qualities</Label>
                <Textarea
                  id="reason"
                  {...register('reason')}
                  placeholder="Describe the sonic atmosphere, color palette, or lack of jarring transitions..."
                  className="bg-black/20 border-retro-muted/40 focus:border-retro-accent/60 focus:ring-1 focus:ring-retro-accent/20 min-h-[160px] rounded-none text-base placeholder:opacity-30 leading-relaxed transition-all"
                />
                {errors.reason && <p className="text-retro-danger text-[10px] font-bold tracking-widest uppercase">{errors.reason.message}</p>}
              </div>
              <Button
                disabled={mutation.isPending}
                className="w-full bg-retro-accent/10 hover:bg-retro-accent hover:text-retro-bg text-retro-accent border border-retro-accent/40 font-black uppercase tracking-[0.4em] py-10 rounded-none transition-all duration-slow shadow-lg shadow-retro-accent/5"
              >
                {mutation.isPending ? 'UPLOADING_DATA...' : 'TRANSMIT_PROPOSAL'}
                <Send className="ml-4 w-4 h-4 opacity-70" />
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}