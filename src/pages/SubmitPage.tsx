import React from 'react';
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
export default function SubmitPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { year: 2024 }
  });
  const mutation = useMutation({
    mutationFn: (values: FormValues) => api('/api/submit', {
      method: 'POST',
      body: JSON.stringify(values)
    }),
    onSuccess: () => {
      toast.success('Proposal received.');
      setTimeout(() => navigate('/'), 2000);
    },
    onError: () => toast.error('Transmission failed.')
  });
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text font-mono">
      <div className="crt-overlay" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12 lg:py-16 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[10px] opacity-30 hover:opacity-60 transition-opacity mb-10 tracking-widest"
          >
            <ArrowLeft className="w-3 h-3" /> ESCAPE_TO_LIST
          </button>
          <header className="mb-14 border-b border-retro-muted/10 pb-8">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.3em] opacity-90">Propose Entry</h1>
            <p className="text-retro-muted text-xs mt-3 opacity-60">Pending review by the Sleep Council.</p>
          </header>
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-10">
            <div className="space-y-3">
              <Label htmlFor="title" className="uppercase text-[10px] tracking-widest opacity-40">Film Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Title..."
                className="bg-retro-card/50 border-retro-muted/20 focus:border-retro-accent/40 rounded-none h-12 text-sm placeholder:opacity-20"
              />
              {errors.title && <p className="text-retro-danger text-[10px] tracking-tight">{errors.title.message}</p>}
            </div>
            <div className="space-y-3">
              <Label htmlFor="year" className="uppercase text-[10px] tracking-widest opacity-40">Release Year</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
                className="bg-retro-card/50 border-retro-muted/20 focus:border-retro-accent/40 rounded-none h-12 text-sm"
              />
              {errors.year && <p className="text-retro-danger text-[10px] tracking-tight">{errors.year.message}</p>}
            </div>
            <div className="space-y-3">
              <Label htmlFor="reason" className="uppercase text-[10px] tracking-widest opacity-40">Nap Qualities</Label>
              <Textarea
                id="reason"
                {...register('reason')}
                placeholder="Atmospheric qualities, audio profile, pacing..."
                className="bg-retro-card/50 border-retro-muted/20 focus:border-retro-accent/40 min-h-[140px] rounded-none text-sm placeholder:opacity-20 leading-relaxed"
              />
              {errors.reason && <p className="text-retro-danger text-[10px] tracking-tight">{errors.reason.message}</p>}
            </div>
            <Button
              disabled={mutation.isPending}
              className="w-full bg-retro-muted/20 hover:bg-retro-accent hover:text-retro-bg text-retro-text border border-retro-muted/30 font-bold uppercase tracking-[0.2em] py-8 rounded-none transition-all duration-slow"
            >
              {mutation.isPending ? 'UPLOADING...' : 'SUBMIT_TO_COUNCIL'}
              <Send className="ml-3 w-3 h-3 opacity-50" />
            </Button>
          </form>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}