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

## Privacy

NapMovies uses Cloudflare Web Analytics. It is cookieless and records aggregate page views.

## Cloudflare deployment

Production is a Cloudflare Worker that serves this static build. There is no custom Worker script. `npm run build` writes the site to `dist` and generates `dist/_headers`. Workers static assets apply that file to every response, which is where Content-Security-Policy, `X-Content-Type-Options`, and `Referrer-Policy` are set. `frame-ancestors` has to be an HTTP header.

The policy allows this site, Cloudflare Web Analytics (`https://static.cloudflareinsights.com` for the beacon script and `https://cloudflareinsights.com` for its collection calls), and same-origin catalog requests. Inline JSON-LD and the small critical style block are allowed by hash, so script `unsafe-inline` is not used. The build fails if a removed third-party analytics host shows up in `dist`, or if a `_headers` line exceeds the 2,000-character Workers limit.

Production has Cloudflare Bot Fight Mode on. It injects a per-request inline JavaScript Detections script, `/cdn-cgi/challenge-platform/scripts/jsd/main.js`. The strict `script-src` blocks that script on purpose, so expect one Content-Security-Policy error in the console per page view. Bot Fight Mode still works; Cloudflare just loses that detection signal. This is intentional.

`npm run deploy` publishes with Wrangler. Pushes to `main` deploy through GitHub Actions.

- Build command: `npm run build`
- Output directory: `dist`

## Catalog hosting

The ranked catalog is the static file `public/movies.json`. The production build imports that file and also publishes it at `/movies.json` on Cloudflare. The site does not request Zo Computer for movie content.

If `/movies.json` cannot be refreshed in the browser, the page keeps the copy bundled at build time and shows the archive instead of an error. A quiet notice appears only when that bundled copy is empty.

Voting and title submissions used to post to the Zo API. That API is not part of this site anymore. Official rankings still change only when `public/movies.json` is edited and the site is rebuilt.

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
scripts/             Validation, SEO pages, and security headers
shared/types.ts      Shared movie types
src/pages/           App routes
src/components/      UI and error boundaries
```
