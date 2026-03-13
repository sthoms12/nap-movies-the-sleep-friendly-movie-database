import { z } from 'zod';
import type { Movie } from '@shared/types';

const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number().int(),
  duration: z.number().int().positive().optional(),
  status: z.union([z.literal('active'), z.literal('archived')]),
  napIndex: z.number().int().min(1).max(10),
  tags: z.array(z.string()),
});

const movieListSchema = z.array(movieSchema);

export const MOVIE_DATA_PATH = '/movies.json';

export async function loadMovieData(): Promise<Movie[]> {
  const response = await fetch(MOVIE_DATA_PATH, {
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
