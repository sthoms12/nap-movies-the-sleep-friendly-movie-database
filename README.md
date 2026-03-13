# NapMovies

A simple static Vite site for a curated list of sleep-friendly movies.

## Local development

```bash
npm install
npm run dev
```

Build the site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Updating the movie list

Edit [public/movies.json](./public/movies.json).

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

Notes:

- `id`, `title`, `year`, `status`, `napIndex`, and `tags` are required.
- `duration` is optional.
- `napIndex` must be an integer from `1` to `10`.
- Titles are sorted by `napIndex` descending on the homepage.

Validate the JSON after edits:

```bash
npm run validate-movies
```
