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
  reason: z.string().min(10, 'Tell us why this helps you sleep (min 10 chars)')
});
type FormValues = z.infer<typeof schema>;
export function SubmitPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { year: 2000 }
  });
  const mutation = useMutation({
    mutationFn: (values: FormValues) => api('/api/submit', {
      method: 'POST',
      body: JSON.stringify(values)
    }),
    onSuccess: () => {
      toast.success('Submitted for review!');
      setTimeout(() => navigate('/'), 2000);
    },
    onError: () => toast.error('Submission failed.')
  });
  return (
    <div className="min-h-screen bg-retro-bg text-retro-text font-mono">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs opacity-50 hover:opacity-100 transition-opacity mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO LIST
        </button>
        <header className="mb-12 border-b border-retro-muted/30 pb-6">
          <h1 className="text-3xl font-bold uppercase tracking-widest">Propose a Movie</h1>
          <p className="text-retro-muted mt-2">All submissions are reviewed by the Sleep Council.</p>
        </header>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title" className="uppercase text-xs tracking-tighter">Movie Title</Label>
            <Input 
              id="title" 
              {...register('title')} 
              placeholder="e.g. My Neighbor Totoro"
              className="bg-retro-card border-retro-muted/30 focus:border-retro-accent rounded-none"
            />
            {errors.title && <p className="text-retro-danger text-xs">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="year" className="uppercase text-xs tracking-tighter">Release Year</Label>
            <Input 
              id="year" 
              type="number"
              {...register('year', { valueAsNumber: true })} 
              className="bg-retro-card border-retro-muted/30 focus:border-retro-accent rounded-none"
            />
            {errors.year && <p className="text-retro-danger text-xs">{errors.year.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason" className="uppercase text-xs tracking-tighter">Why is it nap-friendly?</Label>
            <Textarea 
              id="reason" 
              {...register('reason')} 
              placeholder="Low dialogue, beautiful ambient score, predictable pacing..."
              className="bg-retro-card border-retro-muted/30 focus:border-retro-accent min-h-[120px] rounded-none"
            />
            {errors.reason && <p className="text-retro-danger text-xs">{errors.reason.message}</p>}
          </div>
          <Button 
            disabled={mutation.isPending}
            className="w-full bg-retro-accent text-retro-bg font-bold uppercase py-6 rounded-none hover:bg-white transition-colors"
          >
            {mutation.isPending ? 'TRANSMITTING...' : 'SEND TO COUNCIL'}
            <Send className="ml-2 w-4 h-4" />
          </Button>
        </form>
      </main>
      <Toaster theme="dark" />
    </div>
  );
}