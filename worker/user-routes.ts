import { Hono } from "hono";
import type { Env } from './core-utils';
/**
 * NapMovies Archive - Permanent Static State
 * All dynamic API endpoints have been decommissioned.
 */
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // No active routes in the permanent archive.
}