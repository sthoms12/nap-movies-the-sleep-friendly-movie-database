import { Hono } from "hono";
import type { Env } from './core-utils';
import { MovieEntity, SubmissionEntity } from "./entities";
import { ok, bad, Index } from './core-utils';
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
        // Bayesian-lite scoring to penalize low-sample size items
        const priorVotes = 10;
        const priorNapRate = 0.7; // We expect nap movies to be mostly good
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
    const body = await c.req.json().catch(() => ({}));
    const { type } = body as { type: 'nap' | 'engaging' };
    if (type !== 'nap' && type !== 'engaging') return bad(c, 'invalid vote type');
    const movie = new MovieEntity(c.env, id);
    if (!await movie.exists()) return bad(c, 'movie not found');
    const updated = await movie.addVote(type);
    return ok(c, updated);
  });
  // SUBMISSIONS
  app.post('/api/submit', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const { title, year, reason } = body as { title: string; year: number; reason: string };
    if (!title?.trim() || !year || !reason?.trim()) {
      return bad(c, 'title, year, and reason required');
    }
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
    const body = await c.req.json().catch(() => ({}));
    const { action } = body as { action: 'approve' | 'reject' };
    const sub = new SubmissionEntity(c.env, id);
    if (!await sub.exists()) return bad(c, 'submission not found');
    const data = await sub.getState();
    if (action === 'approve') {
      await sub.mutate(s => ({ ...s, status: 'approved' }));
      // Create active movie from approved submission
      await MovieEntity.create(c.env, {
        id: crypto.randomUUID(),
        title: data.title,
        year: data.year,
        status: 'active',
        votesNap: 1, // Start with 1 vote
        votesEngaging: 0,
        tags: ['Community Selection']
      });
    } else {
      await sub.mutate(s => ({ ...s, status: 'rejected' }));
    }
    return ok(c, { success: true });
  });
  // MAINTENANCE: System Reset (Fixed to use public Index methods)
  app.post('/api/admin/reset-seeds', async (c) => {
    // 1. Clear Movies Index & Entities
    const movieIndex = new Index(c.env, MovieEntity.indexName);
    const movieIds = await movieIndex.list();
    for (const id of movieIds) {
      await MovieEntity.delete(c.env, id);
    }
    // 2. Clear Submissions Index & Entities
    const subIndex = new Index(c.env, SubmissionEntity.indexName);
    const subIds = await subIndex.list();
    for (const id of subIds) {
      await SubmissionEntity.delete(c.env, id);
    }
    // 3. Force re-seed from shared/mock-data.ts
    await MovieEntity.ensureSeed(c.env);
    return ok(c, { message: 'System Index and Queues Purged and Resynchronized' });
  });
}