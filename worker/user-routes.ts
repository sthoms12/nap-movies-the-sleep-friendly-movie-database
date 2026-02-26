import { Hono } from "hono";
import type { Env } from './core-utils';
import { SubmissionEntity, VoteEntity } from "./entities";
import { ok, bad, Index } from './core-utils';
import { INITIAL_MOVIES } from "@shared/mock-data";
import type { Movie, VoteType } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // MOVIES INDEX (HYBRID)
  app.get('/api/movies', async (c) => {
    const { items: allVotes } = await VoteEntity.list(c.env, null, 1000);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    // Aggregate recent votes
    const voteMap: Record<string, { nap: number; engaging: number }> = {};
    for (const v of allVotes) {
      if (v.createdAt < thirtyDaysAgo) continue;
      if (!voteMap[v.movieId]) voteMap[v.movieId] = { nap: 0, engaging: 0 };
      if (v.type === 'nap') voteMap[v.movieId].nap++;
      else voteMap[v.movieId].engaging++;
    }
    // Merge with static baseline
    const mergedMovies: Movie[] = INITIAL_MOVIES.map(m => {
      const recent = voteMap[m.id] || { nap: 0, engaging: 0 };
      return {
        ...m,
        votesNap: m.votesNap + recent.nap,
        votesEngaging: m.votesEngaging + recent.engaging
      };
    });
    // Bayesian-lite sorting (Prior: 10 votes at 70% nap-rate)
    const priorVotes = 10;
    const priorNapRate = 0.7;
    const sorted = mergedMovies.sort((a, b) => {
      const totalA = a.votesNap + a.votesEngaging;
      const totalB = b.votesNap + b.votesEngaging;
      const scoreA = (a.votesNap + priorVotes * priorNapRate) / (totalA + priorVotes);
      const scoreB = (b.votesNap + priorVotes * priorNapRate) / (totalB + priorVotes);
      return scoreB - scoreA;
    });
    return ok(c, sorted.slice(0, 50));
  });
  // VOTING
  app.post('/api/vote', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const { movieId, type } = body as { movieId: string; type: VoteType };
    if (!movieId || !type) return bad(c, 'movieId and type required');
    const vote = await VoteEntity.create(c.env, {
      id: crypto.randomUUID(),
      movieId,
      type,
      createdAt: Date.now()
    });
    return ok(c, vote);
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
    const email = c.req.header('cf-access-authenticated-user-email')?.toLowerCase();
    const allowedEmails = ((c.env as any).ADMIN_EMAILS ?? '').split(',').map((e: string) => e.toLowerCase().trim()).filter(Boolean);
    if (!email && !import.meta.env?.DEV) return bad(c, 'Unauthorized');
    const { items } = await SubmissionEntity.list(c.env, null, 100);
    return ok(c, items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
  });
  app.post('/api/admin/submissions/:id/moderate', async (c) => {
    const id = c.req.param('id');
    const { action } = await c.req.json();
    const sub = new SubmissionEntity(c.env, id);
    if (!await sub.exists()) return bad(c, 'not found');
    await sub.mutate(s => ({ ...s, status: action === 'approve' ? 'approved' : 'rejected' }));
    return ok(c, { success: true });
  });
  app.post('/api/admin/prune-votes', async (c) => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const { items } = await VoteEntity.list(c.env, null, 5000);
    const toDelete = items.filter(v => v.createdAt < thirtyDaysAgo).map(v => v.id);
    if (toDelete.length > 0) {
      await VoteEntity.deleteMany(c.env, toDelete);
    }
    return ok(c, { pruned: toDelete.length });
  });
  app.post('/api/admin/reset-seeds', async (c) => {
    const subIndex = new Index(c.env, SubmissionEntity.indexName);
    const subIds = await subIndex.list();
    for (const id of subIds) await SubmissionEntity.delete(c.env, id);
    return ok(c, { message: 'Cleared' });
  });
}