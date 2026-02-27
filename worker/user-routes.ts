import { Hono } from "hono";
import type { Env } from './core-utils';
import { SubmissionEntity } from "./entities";
import { ok, bad, Index, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // MIDDLEWARE: Administrative Auth Check
  const checkAdmin = (c: any) => {
    const email = c.req.header('cf-access-authenticated-user-email')?.toLowerCase();
    const allowedEmailsStr = (c.env as any).ADMIN_EMAILS || '';
    const allowedEmails = allowedEmailsStr.split(',').map((e: string) => e.toLowerCase().trim()).filter(Boolean);
    // In production, require email presence in allowed list
    if (!import.meta.env?.DEV) {
      if (!email || !allowedEmails.includes(email)) {
        return false;
      }
    }
    return true;
  };
  // PROPOSAL SUBMISSION (Public)
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
  // ADMIN: List Submissions
  app.get('/api/admin/submissions', async (c) => {
    if (!checkAdmin(c)) return bad(c, 'Unauthorized Access Restricted');
    const { items } = await SubmissionEntity.list(c.env, null, 100);
    return ok(c, items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
  });
  // ADMIN: Moderate Submission
  app.post('/api/admin/submissions/:id/moderate', async (c) => {
    if (!checkAdmin(c)) return bad(c, 'Unauthorized Access Restricted');
    const id = c.req.param('id');
    const { action } = await c.req.json().catch(() => ({}));
    if (!['approve', 'reject'].includes(action)) {
      return bad(c, 'Invalid moderation action');
    }
    const sub = new SubmissionEntity(c.env, id);
    if (!await sub.exists()) return notFound(c, 'Submission record not found');
    await sub.mutate(s => ({ 
      ...s, 
      status: action === 'approve' ? 'approved' : 'rejected' 
    }));
    return ok(c, { success: true, id, status: action === 'approve' ? 'approved' : 'rejected' });
  });
  // ADMIN: Purge Submission Queue
  app.post('/api/admin/reset-seeds', async (c) => {
    if (!checkAdmin(c)) return bad(c, 'Unauthorized Access Restricted');
    const subIndex = new Index(c.env, SubmissionEntity.indexName);
    const subIds = await subIndex.list();
    let count = 0;
    for (const id of subIds) {
      const deleted = await SubmissionEntity.delete(c.env, id);
      if (deleted) count++;
    }
    return ok(c, { 
      message: `System purge complete. ${count} records scrubbed from staging queue.`,
      purgedCount: count
    });
  });
}