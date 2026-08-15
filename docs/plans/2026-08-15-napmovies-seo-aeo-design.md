# NapMovies SEO and AEO Design

**Date:** 2026-08-15  
**Status:** Approved  
**Primary search position:** Movies to fall asleep to

## Objective

Improve NapMovies' non-branded Google and answer-engine visibility while preserving the official owner-approved ranking workflow. Position the Nap Index as a distinctive editorial system without making medical, physiological, or scientific sleep claims.

## Protected behavior

- Official rankings remain owner-approved.
- Community votes and submissions remain advisory signals for weekly review.
- The existing catalog remains the source for published movie selections and scores.
- GitHub remains the deployment source; a push triggers Cloudflare Pages.

## Information architecture

The homepage will become the primary authority page for “movies to fall asleep to” while retaining the complete ranked archive.

Add three distinct, prerendered guide pages:

- `/movies-to-fall-asleep-to/` — primary query guide and ranked shortlist.
- `/quiet-movies-for-bedtime/` — selections emphasizing steadier audio and pacing.
- `/comfort-movies-for-sleep/` — familiar, rewatchable quiet-night choices.

Each page will include an immediate answer, unique editorial guidance, a relevant official-catalog shortlist, selection rationale, FAQs, and contextual internal links. Pages must not be thin tag archives or duplicate one another.

## Content and trust

Rewrite the methodology to define the Nap Index as a subjective editorial framework based on factors such as familiarity, steady pacing, quieter sound profiles, visual calm, and rewatch comfort. Remove claims involving REM sleep, cortisol, brain disengagement, sleep cycles, deep sleep, or other unsupported health outcomes.

Add a clear statement that NapMovies provides entertainment recommendations, not medical or sleep advice. Use neutral approval wording such as “owner-approved” and “official approved ranking.”

## Technical SEO and AEO

- Unique title, description, canonical, Open Graph, and X metadata for every public route.
- Appropriate `WebSite`, `WebPage`, `ItemList`, `Movie`, `FAQPage`, and `BreadcrumbList` structured data.
- Crawlable prerendered fallback content containing the page-specific answer and internal links.
- Sitemap entries for all indexable routes.
- Add `llms.txt` describing the site, methodology, canonical pages, and ranking governance.
- Add automated build validation for metadata, canonicals, structured data, sitemap coverage, and rendered answer content.

## Verification and deployment

Run catalog validation, linting, type checks, production build, and SEO artifact validation. Commit the implementation and push to GitHub. Confirm the GitHub-triggered Cloudflare Pages deployment, then verify every new route, `robots.txt`, `sitemap.xml`, and `llms.txt` on `https://napmovies.app`.
