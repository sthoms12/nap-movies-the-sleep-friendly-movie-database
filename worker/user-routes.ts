import { Hono } from "hono";
import type { Env } from './core-utils';
import { SubmissionEntity } from "./entities";
import { ok, bad, Index } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PROPOSAL SUBMISSION
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
  // ADMIN TERMINAL ROUTES
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
  app.post('/api/admin/reset-seeds', async (c) => {
    const subIndex = new Index(c.env, SubmissionEntity.indexName);
    const subIds = await subIndex.list();
    for (const id of subIds) await SubmissionEntity.delete(c.env, id);
    return ok(c, { message: 'Submission queue cleared' });
  });
}