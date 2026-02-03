import { Hono } from "hono";
import type { Env } from './core-utils';
import { MovieEntity, SubmissionEntity } from "./entities";
import { ok, bad } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // MOVIES
  app.get('/api/movies', async (c) => {
    await MovieEntity.ensureSeed(c.env);
    const { items } = await MovieEntity.list(c.env, null, 100);
    // Filtering active movies and applying ranking logic
    const sorted = items
      .filter(m => m.status === 'active')
      .sort((a, b) => {
        const totalA = a.votesNap + a.votesEngaging;
        const totalB = b.votesNap + b.votesEngaging;
        // Bayesian-lite scoring to prevent 1/1 votes beating 100/100 votes
        // We add a small "prior" to smooth out low-volume rankings
        const priorVotes = 5;
        const priorNapRate = 0.5;
        const scoreA = (a.votesNap + priorVotes * priorNapRate) / (totalA + priorVotes);
        const scoreB = (b.votesNap + priorVotes * priorNapRate) / (totalB + priorVotes);
        if (scoreB !== scoreA) return scoreB - scoreA;
        if (totalB !== totalA) return totalB - totalA;
        return (b.votesNap - b.votesEngaging) - (a.votesNap - a.votesEngaging);
      });
    return ok(c, sorted);
  });
  app.post('/api/movies/:id/vote', async (c) => {
    const id = c.req.param('id');
    const { type } = (await c.req.json()) as { type: 'nap' | 'engaging' };
    if (type !== 'nap' && type !== 'engaging') return bad(c, 'invalid vote type');
    const movie = new MovieEntity(c.env, id);
    if (!await movie.exists()) return bad(c, 'movie not found');
    const updated = await movie.addVote(type);
    return ok(c, updated);
  });
  // SUBMISSIONS
  app.post('/api/submit', async (c) => {
    const { title, year, reason } = (await c.req.json()) as { title: string; year: number; reason: string };
    if (!title?.trim() || !year || !reason?.trim()) return bad(c, 'title, year, and reason required');
    const submission = await SubmissionEntity.create(c.env, {
      id: crypto.randomUUID(),
      title: title.trim(),
      year,
      reason: reason.trim(),
      status: 'pending',
      createdAt: Date.now()
    });
    return ok(c, submission);
  });
  // ADMIN
  app.get('/api/admin/submissions', async (c) => {
    const { items } = await SubmissionEntity.list(c.env, null, 100);
    return ok(c, items.sort((a, b) => b.createdAt - a.createdAt));
  });
  app.post('/api/admin/submissions/:id/moderate', async (c) => {
    const id = c.req.param('id');
    const { action } = (await c.req.json()) as { action: 'approve' | 'reject' };
    const sub = new SubmissionEntity(c.env, id);
    if (!await sub.exists()) return bad(c, 'submission not found');
    const data = await sub.getState();
    if (action === 'approve') {
      await sub.mutate(s => ({ ...s, status: 'approved' }));
      // Give new entries the same starting baseline as seed data (15-3)
      // This prevents "1 vote = 100%" bias for new entries
      await MovieEntity.create(c.env, {
        id: crypto.randomUUID(),
        title: data.title,
        year: data.year,
        status: 'active',
        votesNap: 15,
        votesEngaging: 3,
        tags: ['Community Selection']
      });
    } else {
      await sub.mutate(s => ({ ...s, status: 'rejected' }));
    }
    return ok(c, { success: true });
  });
  // MAINTENANCE: Deep Clean
  app.post('/api/admin/reset-seeds', async (c) => {
    // 1. Clear Movies
    const { items: movieItems } = await MovieEntity.list(c.env, null, 1000);
    if (movieItems.length > 0) {
      await MovieEntity.deleteMany(c.env, movieItems.map(m => m.id));
    }
    // 2. Clear Submissions
    const { items: subItems } = await SubmissionEntity.list(c.env, null, 1000);
    if (subItems.length > 0) {
      await SubmissionEntity.deleteMany(c.env, subItems.map(s => s.id));
    }
    // 3. Force re-seed
    await MovieEntity.ensureSeed(c.env);
    return ok(c, { message: 'Archive and Queues Purged and Resynchronized' });
  });
}