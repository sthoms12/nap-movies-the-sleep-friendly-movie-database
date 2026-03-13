import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const movieSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  year: z.number().int(),
  duration: z.number().int().positive().optional(),
  status: z.union([z.literal('active'), z.literal('archived')]),
  napScore: z.number().int().min(0).max(100),
  tags: z.array(z.string().min(1)).min(1),
});

const movieListSchema = z.array(movieSchema);

const raw = await readFile(new URL('../public/movies.json', import.meta.url), 'utf8');
const parsed = JSON.parse(raw);
const movies = movieListSchema.parse(parsed);

const ids = new Set();
for (const movie of movies) {
  if (ids.has(movie.id)) {
    throw new Error(`Duplicate movie id: ${movie.id}`);
  }
  ids.add(movie.id);
}

console.log(`Validated ${movies.length} movies.`);
