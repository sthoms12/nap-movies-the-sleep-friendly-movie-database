import { z } from 'zod';
import type { Movie } from '@shared/types';

const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number().int(),
  duration: z.number().int().positive().nullable().optional().transform((value) => value ?? undefined),
  status: z.union([z.literal('active'), z.literal('archived')]),
  napIndex: z.number().int().min(1).max(10),
  tags: z.array(z.string()),
  community: z.object({
    communityScore: z.number(),
    comfortPicks: z.number(),
    voteCount: z.number(),
  }).optional(),
});

const movieListSchema = z.array(movieSchema);
const apiMovieListSchema = z.object({ movies: movieListSchema });
const voteSchema = z.object({ ok: z.boolean() });
const submissionSchema = z.object({ ok: z.boolean() });

export const MOVIE_DATA_PATH = '/movies.json';
export const API_BASE_URL = (
  import.meta.env.VITE_NAP_MOVIES_API_URL || 'https://nap-movies-api-thomstech.zocomputer.io'
).replace(/\/$/, '');

async function loadStaticMovieData(): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/api/votes`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load movie catalog (${response.status})`);
  }

  const json = await response.json();
  return movieListSchema.parse(json) as Movie[];
}

export async function loadMovieData(): Promise<Movie[]> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        return apiMovieListSchema.parse(json).movies as Movie[];
      }
    } catch {
      // Fall through to the static catalog so Cloudflare Pages remains resilient.
    }
  }

  return loadStaticMovieData();
}

export function isCommunityEnabled() {
  return Boolean(API_BASE_URL);
}

export async function submitVote(movieId: string, voteType: 'sleepier' | 'less_sleepy' | 'comfort_pick') {
  if (!API_BASE_URL) {
    throw new Error('Community voting is not configured.');
  }

  const response = await fetch(MOVIE_DATA_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ movieId, voteType }),
  });

  if (!response.ok) {
    throw new Error(`Vote failed (${response.status})`);
  }

  const json = await response.json();
  return voteSchema.parse(json);
}

export async function submitMovie(input: { title: string; year?: number; reason: string; tags: string[] }) {
  if (!API_BASE_URL) {
    throw new Error('Movie submissions are not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Submission failed (${response.status})`);
  }

  const json = await response.json();
  return submissionSchema.parse(json);
}
