import { Hono } from "hono";
import type { Env } from './core-utils';
import { MovieEntity, SubmissionEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // MOVIES
  app.get('/api/movies', async (c) => {
    await MovieEntity.ensureSeed(c.env);
    const { items } = await MovieEntity.list(c.env, null, 100);
    // Sort by net nap score descending
    const sorted = items
      .filter(m => m.status === 'active')
      .sort((a, b) => (b.votesNap - b.votesEngaging) - (a.votesNap - a.votesEngaging));
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
      await MovieEntity.create(c.env, {
        id: crypto.randomUUID(),
        title: data.title,
        year: data.year,
        status: 'active',
        votesNap: 1, // Submitter gets first vote
        votesEngaging: 0,
        tags: ['User Submitted']
      });
    } else {
      await sub.mutate(s => ({ ...s, status: 'rejected' }));
    }
    return ok(c, { success: true });
  });
}