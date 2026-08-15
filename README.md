# NapMovies

NapMovies is a static Vite + React site for a curated database of sleep-friendly movies. The site renders a ranked catalog from a single JSON data file and is intended to deploy as a plain static build on Cloudflare Pages.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Static data in `public/movies.json`

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run validate-movies
npm run lint
npm run typecheck
npm run build
```

## Cloudflare deployment

This repo does not require a custom Worker entrypoint. Cloudflare Pages can deploy the generated static assets directly.

- Build command: `npm run build`
- Output directory: `dist`
- Optional environment variable: `VITE_NAP_MOVIES_API_URL`

If you are using the GitHub-connected Cloudflare Pages flow, that is enough. If you are deploying with Wrangler, point the project at the same `dist` directory after building.

## Community backend

Voting and submissions are powered by a Zo-hosted API. The app defaults to:

```bash
VITE_NAP_MOVIES_API_URL=https://nap-movies-api-thomstech.zocomputer.io
```

Set `VITE_NAP_MOVIES_API_URL` in Cloudflare Pages only if the API moves. If the API is unavailable, the app falls back to the static catalog in `public/movies.json`.

The public app shows community signals, but official rankings only change after the weekly snapshot receives owner approval.

## Updating the movie catalog

Edit `public/movies.json`.

Each movie entry uses this shape:

```json
{
  "id": "01",
  "title": "Harry Potter (Complete Film Series)",
  "year": 2001,
  "duration": 152,
  "status": "active",
  "napIndex": 9,
  "tags": ["Familiar", "Comfort Rewatch", "Low Stress", "Magic"]
}
```

Rules:

- `id`, `title`, `year`, `status`, `napIndex`, and `tags` are required
- `duration` is optional
- `napIndex` must be an integer from `1` to `10`
- `tags` must contain at least one value
- Titles are sorted by `napIndex` descending on the homepage

After editing the catalog:

```bash
npm run validate-movies
```

## Project structure

```text
public/movies.json   Source catalog
scripts/             Data validation script
shared/types.ts      Shared movie types
src/pages/           App routes
src/components/      UI and error boundaries
```
