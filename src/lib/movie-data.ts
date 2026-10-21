import type { Movie, MovieStatus } from '@shared/types';
import bundledMovies from '../../public/movies.json';

export const MOVIE_DATA_PATH = '/movies.json';

function isStatus(value: unknown): value is MovieStatus {
  return value === 'active' || value === 'archived';
}

function isMovie(value: unknown): value is Movie {
  if (!value || typeof value !== 'object') return false;
  const movie = value as Partial<Movie>;
  return typeof movie.id === 'string'
    && movie.id.length > 0
    && typeof movie.title === 'string'
    && movie.title.length > 0
    && Number.isInteger(movie.year)
    && (movie.duration === undefined || movie.duration === null || (Number.isInteger(movie.duration) && movie.duration > 0))
    && isStatus(movie.status)
    && Number.isInteger(movie.napIndex)
    && movie.napIndex >= 1
    && movie.napIndex <= 10
    && Array.isArray(movie.tags)
    && movie.tags.length > 0
    && movie.tags.every((tag) => typeof tag === 'string' && tag.length > 0);
}

export function sortMovies(movies: Movie[]) {
  return [...movies].sort((a, b) => b.napIndex - a.napIndex || (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
}

export function readBundledMovies(): Movie[] {
  const values: unknown = bundledMovies;
  if (!Array.isArray(values)) return [];
  return sortMovies(values.filter(isMovie));
}

function sameCatalog(left: Movie[], right: Movie[]) {
  if (left.length !== right.length) return false;
  return left.every((movie, index) => {
    const other = right[index];
    return other?.id === movie.id && other.napIndex === movie.napIndex && other.title === movie.title;
  });
}

/**
 * The catalog ships with the site as static JSON. A same-origin refresh can
 * pick up a newer `movies.json`, and any failure keeps the bundled copy.
 * There is no Zo Computer request.
 */
export async function refreshMovies(current: Movie[]): Promise<Movie[] | null> {
  try {
    const response = await fetch(MOVIE_DATA_PATH, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const json: unknown = await response.json();
    if (!Array.isArray(json)) return null;
    const movies = sortMovies(json.filter(isMovie));
    if (movies.length === 0 || sameCatalog(current, movies)) return null;
    return movies;
  } catch {
    return null;
  }
}
