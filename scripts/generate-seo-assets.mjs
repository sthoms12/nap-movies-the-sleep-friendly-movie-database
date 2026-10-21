import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const siteOrigin = 'https://napmovies.app';
const distDir = path.resolve('dist');
const movies = JSON.parse(fs.readFileSync(path.resolve('public/movies.json'), 'utf8'));
const organizationId = `${siteOrigin}/#organization`;
const websiteId = `${siteOrigin}/#website`;
const creatorId = `${siteOrigin}/#creator`;
// Only profiles already referenced in the repo. Do not add accounts that are not in the source.
const creatorProfiles = [
  'https://www.linkedin.com/in/steve-thoms-81381990',
  'https://x.com/thomstech12',
];
const logoFile = 'og-napmovies.png';
const logoUrl = fs.existsSync(path.resolve('public', logoFile)) ? `${siteOrigin}/${logoFile}` : undefined;

const routes = [
  {
    path: '/',
    output: path.join(distDir, 'index.html'),
    title: 'NapMovies | Nap Movies to Fall Asleep To',
    description: 'Explore 50 owner-approved movies to fall asleep to, ranked by the Nap Index for familiarity, steady pacing, atmosphere, and quiet-night comfort.',
    h1: 'NapMovies',
    itemListName: 'Movies to fall asleep to',
    answer: 'NapMovies is a ranked archive of nap movies — familiar rewatches, steady pacing, and quiet-night comfort picks.',
    movieIds: movies.map((movie) => movie.id),
    faq: [
      ['What makes a good nap movie?', 'A useful nap movie is usually a familiar rewatch with steady pacing, predictable sound, and a mood you already know.'],
      ['How does the Nap Index work?', 'The Nap Index weighs familiarity, pacing, sound, visual stillness, atmosphere, runtime, and rewatch comfort.'],
      ['Can community votes change the official ranking?', 'Community votes inform weekly review, but the public ranking changes only after owner approval.'],
      ['What are nap movies?', 'Nap movies are films people rewatch at night because steady pacing, predictable sound, and familiar stories make them easy movies to nap to. NapMovies ranks these titles with the owner-approved Nap Index, which weighs familiarity, pacing, sound, visual stillness, atmosphere, runtime, and rewatch comfort.'],
      ['How many movies are in the NapMovies archive?', 'The archive currently ranks 50 owner-approved movies. Community votes and submissions inform a weekly review, but the public ranking changes only after owner approval.'],
      ['Does NapMovies stream movies?', 'No. NapMovies is a ranked guide for quiet-night viewing; it does not host or stream any films.'],
      ['What range does the Nap Index use?', 'Scores are shown on a 0–10 scale. Every movie currently in the archive scores 8 or 9, reflecting that only vetted comfort rewatches make the cut.'],
    ],
  },
  {
    path: '/criteria/',
    output: path.join(distDir, 'criteria', 'index.html'),
    title: 'How the Nap Index Works | NapMovies Methodology',
    description: 'Learn how NapMovies uses familiarity, steady pacing, sound, visual stillness, atmosphere, and rewatch comfort to create owner-approved rankings.',
    h1: 'How the Nap Index works',
    answer: 'The Nap Index is a subjective editorial score for quiet-night viewing, not a medical assessment or a measure of movie quality.',
  },
  {
    path: '/movies-to-fall-asleep-to/',
    output: path.join(distDir, 'movies-to-fall-asleep-to', 'index.html'),
    title: 'Movies to Fall Asleep To: Owner-Approved Picks | NapMovies',
    description: 'Find movies to fall asleep to using owner-approved Nap Index rankings focused on familiar stories, steady pacing, predictable sound, and comfort.',
    h1: 'Movies to fall asleep to',
    answer: 'Movies to nap to are usually familiar rewatches with steady pacing, predictable sound, and a mood you already know.',
    introduction: 'This owner-approved shortlist from the NapMovies catalog favors movies you can rejoin after drifting off. Familiar stories, longer runtimes, and consistent atmosphere carry more weight than conventional movie quality.',
    movieIds: ['01', '02', '03', '08', '24', '25', '26', '36'],
    faq: [
      ['What makes a movie good to fall asleep to?', 'NapMovies looks for familiar stories, steady pacing, manageable sound changes, visual calm, and enough runtime to avoid choosing another title quickly.'],
      ['Does the highest Nap Index work for everyone?', 'No. The Nap Index is an editorial guide, and personal familiarity can matter more than position.'],
      ['Are these sleep recommendations medical advice?', 'No. NapMovies offers entertainment recommendations for quiet-night viewing, not medical or sleep advice.'],
      ['What is the best Harry Potter movie to fall asleep to?', 'Harry Potter (Complete Film Series) sits at number 2 on this list with a Nap Index of 9/10. The familiar wizarding world, gentle scoring, and a story you already know make it one of the strongest comfort rewatches in the archive.'],
    ],
  },
  {
    path: '/quiet-movies-for-bedtime/',
    output: path.join(distDir, 'quiet-movies-for-bedtime', 'index.html'),
    title: 'Quiet Movies for Bedtime: Lower-Key Picks | NapMovies',
    description: 'Browse quiet movies for bedtime selected for stillness, atmosphere, routine, restrained dialogue, and steadier pacing from the NapMovies archive.',
    h1: 'Quiet movies for bedtime',
    answer: 'Quiet bedtime movies tend to use still compositions, long scenes, restrained dialogue, or sustained ambient sound instead of constant shifts.',
    movieIds: ['07', '11', '12', '14', '19', '31', '38', '39', '40', '46'],
    faq: [
      ['Are quiet movies always low stress?', 'No. A restrained visual or audio style can still accompany serious subject matter. Familiarity and personal comfort remain important.'],
      ['How are these movies selected?', 'The list favors official catalog tags connected with quiet, stillness, routine, ambient sound, and slower pacing.'],
      ['Can community votes change this list?', 'Community votes inform weekly review, but published scores change only after owner approval.'],
    ],
  },
  {
    path: '/comfort-movies-for-sleep/',
    output: path.join(distDir, 'comfort-movies-for-sleep', 'index.html'),
    title: 'Comfort Movies for Sleep and Quiet Rewatches | NapMovies',
    description: 'Find familiar comfort movies for sleep and quiet nights, selected from the owner-approved NapMovies archive for predictable, easygoing rewatches.',
    h1: 'Comfort movies for sleep',
    answer: 'Comfort movies for sleep are personal favorites you can follow without concentrating because you already know the characters, turns, and ending.',
    movieIds: ['01', '02', '03', '04', '24', '25', '44', '45', '49', '50'],
    faq: [
      ['Why can a familiar movie feel easier at bedtime?', 'A familiar rewatch asks less of your attention because you already know the characters, turns, and ending.'],
      ['What is a comfort pick on NapMovies?', 'It is a community signal that does not directly change the official Nap Index.'],
      ['How often do official rankings change?', 'Community feedback is reviewed weekly, and the public ranking changes only when a snapshot receives owner approval.'],
    ],
  },
];

const notFound = {
  path: '/404',
  output: path.join(distDir, '404.html'),
  title: 'Page Not Found | NapMovies',
  description: 'This NapMovies page does not exist. Return to the ranked movie archive or review the Nap Index methodology.',
  h1: 'Page not found',
  answer: 'Return to the NapMovies archive.',
};

const today = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function canonical(routePath) {
  return `${siteOrigin}${routePath}`;
}

function selectedMovies(route) {
  if (!route.movieIds) return [];
  const ids = new Set(route.movieIds);
  return movies.filter((movie) => ids.has(movie.id)).sort((a, b) => b.napIndex - a.napIndex || (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
}

function itemListJsonLd(route) {
  const selected = selectedMovies(route);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: route.itemListName ?? route.h1,
    description: route.description,
    url: canonical(route.path),
    numberOfItems: selected.length,
    itemListElement: selected.map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        duration: movie.duration ? `PT${movie.duration}M` : undefined,
        additionalProperty: [{ '@type': 'PropertyValue', name: 'Nap Index', value: `${movie.napIndex}/10` }],
        keywords: movie.tags.join(', '),
      },
    })),
  };
}

function breadcrumbJsonLd(route) {
  if (route.path === '/') return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'NapMovies', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: route.h1, item: canonical(route.path) },
    ],
  };
}

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: 'NapMovies',
    alternateName: 'Nap Movies',
    url: canonical('/'),
    sameAs: creatorProfiles,
    ...(logoUrl ? { logo: { '@type': 'ImageObject', url: logoUrl, width: 1200, height: 630 } } : {}),
  };
}

function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: 'NapMovies',
    alternateName: 'Nap Movies',
    url: canonical('/'),
    publisher: { '@id': organizationId },
    creator: { '@id': creatorId },
  };
}

function routeJsonLd(route) {
  const entries = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': creatorId,
      name: 'Steve Thoms',
      url: creatorProfiles[0],
      sameAs: creatorProfiles,
    },
  ];
  if (route.path !== '/404') {
    entries.push(organizationJsonLd(), websiteJsonLd());
  }
  entries.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: route.h1,
    url: canonical(route.path),
    description: route.description,
    creator: { '@id': creatorId },
    isPartOf: { '@id': websiteId },
  });
  if (route.movieIds) entries.push(itemListJsonLd(route));
  if (route.faq) {
    entries.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: route.faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
    });
  }
  const breadcrumb = breadcrumbJsonLd(route);
  if (breadcrumb) entries.push(breadcrumb);
  return entries;
}

function headTags(route) {
  const url = canonical(route.path);
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const jsonLd = routeJsonLd(route).map((entry) => `<script type="application/ld+json">${JSON.stringify(entry)}</script>`).join('\n    ');
  return `<!-- SEO_META_START -->
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="${route.path === '/404' ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="NapMovies" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${siteOrigin}/og-napmovies.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="NapMovies ranked archive for quiet-night viewing" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${siteOrigin}/og-napmovies.png" />
    ${jsonLd}
    <!-- SEO_META_END -->`;
}

function relocateAssets(html) {
  const styleMatch = html.match(/<link rel="stylesheet"[^>]*>/);
  const scriptMatch = html.match(/<script type="module"[^>]*><\/script>/);
  let next = html;
  if (styleMatch) next = next.replace(styleMatch[0], '');
  if (scriptMatch) next = next.replace(scriptMatch[0], '');
  if (styleMatch) {
    if (next.includes('<meta charset="UTF-8" />')) {
      next = next.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${styleMatch[0]}`);
    } else {
      next = next.replace('<head>', `<head>\n    ${styleMatch[0]}`);
    }
  }
  if (scriptMatch) next = next.replace('</body>', `    ${scriptMatch[0]}\n  </body>`);
  return next;
}

function renderHtml(route, template) {
  let html = template
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(route.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(route.description)}" />`);
  html = html.replace(/\s*<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/s, '');
  html = html.replace('</head>', `    ${headTags(route)}\n  </head>`);
  const rendered = render(route.path === '/404' ? '/404' : route.path);
  html = html.replace('<div id="root"></div>', () => `<div id="root" data-ssr="true">${rendered}</div>`);
  return relocateAssets(html);
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const templates = {
  home: fs.readFileSync(path.join(distDir, 'index.html'), 'utf8'),
  criteria: fs.readFileSync(path.join(distDir, 'criteria.html'), 'utf8'),
  guide: fs.readFileSync(path.join(distDir, 'guide.html'), 'utf8'),
};

function templateFor(route) {
  if (route.path === '/criteria/') return templates.criteria;
  if (route.path === '/movies-to-fall-asleep-to/' || route.path === '/quiet-movies-for-bedtime/' || route.path === '/comfort-movies-for-sleep/') return templates.guide;
  return templates.home;
}

for (const route of [...routes, notFound]) writeFile(route.output, renderHtml(route, templateFor(route)));
fs.rmSync(path.join(distDir, 'criteria.html'), { force: true });
fs.rmSync(path.join(distDir, 'guide.html'), { force: true });

writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nContent-Signal: ai-train=no, search=yes, ai-input=yes\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);
writeFile(path.join(distDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url>\n    <loc>${canonical(route.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.path === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}\n</urlset>\n`);
writeFile(path.join(distDir, 'llms.txt'), `# NapMovies\n\nNapMovies is an editorial archive of movies for quiet-night viewing. The official Nap Index ranks familiar rewatches using factors such as pacing, sound consistency, visual stillness, atmosphere, runtime, and personal comfort.\n\n## Canonical pages\n- ${canonical('/')} — complete owner-approved ranked archive\n- ${canonical('/movies-to-fall-asleep-to/')} — primary guide\n- ${canonical('/quiet-movies-for-bedtime/')} — lower-key selections\n- ${canonical('/comfort-movies-for-sleep/')} — familiar comfort rewatches\n- ${canonical('/criteria/')} — Nap Index methodology\n\n## Ranking governance\nCommunity votes and submissions are advisory signals. Official scores and rankings change only after owner approval. NapMovies provides entertainment recommendations, not medical or sleep advice.\n`);

console.log(`Generated SEO assets for ${routes.length} routes on napmovies.app`);
