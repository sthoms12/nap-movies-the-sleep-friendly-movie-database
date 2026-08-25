import fs from 'node:fs';
import path from 'node:path';

const siteOrigin = 'https://napmovies.app';
const distDir = path.resolve('dist');
const baseHtmlPath = path.join(distDir, 'index.html');
const movies = JSON.parse(fs.readFileSync(path.resolve('public/movies.json'), 'utf8'));

const routes = [
  {
    path: '/',
    output: path.join(distDir, 'index.html'),
    title: 'Movies to Fall Asleep To | NapMovies Ranked Archive',
    description: 'Explore 50 owner-approved movies to fall asleep to, ranked by the Nap Index for familiarity, steady pacing, atmosphere, and quiet-night comfort.',
    h1: 'Movies to fall asleep to',
    answer: 'NapMovies is a ranked archive of familiar rewatches, steady pacing, and quiet-night comfort picks.',
    movieIds: movies.map((movie) => movie.id),
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
    answer: 'The best movies to fall asleep to are usually familiar rewatches with steady pacing, predictable sound, and a mood you already know.',
    movieIds: ['01', '02', '03', '08', '24', '25', '26', '36'],
    faq: [
      ['What makes a movie good to fall asleep to?', 'NapMovies looks for familiar stories, steady pacing, manageable sound changes, visual calm, and enough runtime to avoid choosing another title quickly.'],
      ['Does the highest Nap Index work for everyone?', 'No. The Nap Index is an editorial guide, and personal familiarity can matter more than position.'],
      ['Are these sleep recommendations medical advice?', 'No. NapMovies offers entertainment recommendations for quiet-night viewing, not medical or sleep advice.'],
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
const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function canonical(routePath) {
  return `${siteOrigin}${routePath}`;
}

function selectedMovies(route) {
  if (!route.movieIds) return [];
  const ids = new Set(route.movieIds);
  return movies.filter((movie) => ids.has(movie.id)).sort((a, b) => b.napIndex - a.napIndex || a.title.localeCompare(b.title));
}

function itemListJsonLd(route) {
  const selected = selectedMovies(route);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: route.h1,
    description: route.description,
    url: canonical(route.path),
    numberOfItems: selected.length,
    itemListElement: selected.map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        dateCreated: String(movie.year),
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

function routeJsonLd(route) {
  const entries = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${siteOrigin}/#creator`,
      name: 'Steve Thoms',
      url: 'https://www.linkedin.com/in/steve-thoms-81381990',
      sameAs: ['https://www.linkedin.com/in/steve-thoms-81381990', 'https://x.com/thomstech12'],
    },
    {
      '@context': 'https://schema.org',
      '@type': route.path === '/' ? 'WebSite' : 'WebPage',
      name: route.h1,
      url: canonical(route.path),
      description: route.description,
      creator: { '@id': `${siteOrigin}/#creator` },
      isPartOf: route.path === '/' ? undefined : { '@type': 'WebSite', name: 'NapMovies', url: canonical('/') },
    },
  ];
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
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${jsonLd}
    <!-- SEO_META_END -->`;
}

function fallbackMarkup(route) {
  const movieList = selectedMovies(route).slice(0, 10).map((movie) => `<li>${escapeHtml(movie.title)} — Nap Index ${movie.napIndex}/10</li>`).join('');
  const faq = (route.faq ?? []).map(([question, answer]) => `<h2>${escapeHtml(question)}</h2><p>${escapeHtml(answer)}</p>`).join('');
  const homeGuide = route.path === '/' ? `<h2>What makes a good nap movie?</h2><p>A useful nap movie is usually a familiar rewatch with steady pacing, predictable sound, and a mood you already know. The Nap Index considers familiarity, pacing, sound, visual stillness, atmosphere, runtime, and rewatch comfort. It is an editorial guide, not medical advice or a promise that a movie will make you sleep.</p><h2>How to use the archive</h2><p>Start with the official ranking, then use your own familiarity as the deciding factor. Community votes inform a weekly review, but published scores change only after owner approval.</p>` : '';
  const criteriaLink = route.path === '/criteria/' ? `<p><a href="/">Return to the owner-approved NapMovies ranking.</a></p>` : '';
  return `<noscript><main><h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(route.answer)}</p>${homeGuide}${movieList ? `<h2>Owner-approved nap movie rankings</h2><ol>${movieList}</ol>` : ''}${faq}${criteriaLink}<p><a href="/">Ranked archive</a> | <a href="/criteria/">Methodology</a> | <a href="/movies-to-fall-asleep-to/">Movies to fall asleep to</a></p></main></noscript>`;
}

function renderHtml(route) {
  let html = baseHtml
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(route.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(route.description)}" />`);
  html = html.replace(/\s*<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/s, '');
  html = html.replace('</head>', `    ${headTags(route)}\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${fallbackMarkup(route)}`);
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

for (const route of [...routes, notFound]) writeFile(route.output, renderHtml(route));

writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);
writeFile(path.join(distDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url>\n    <loc>${canonical(route.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.path === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}\n</urlset>\n`);
writeFile(path.join(distDir, 'llms.txt'), `# NapMovies\n\nNapMovies is an editorial archive of movies for quiet-night viewing. The official Nap Index ranks familiar rewatches using factors such as pacing, sound consistency, visual stillness, atmosphere, runtime, and personal comfort.\n\n## Canonical pages\n- ${canonical('/')} — complete owner-approved ranked archive\n- ${canonical('/movies-to-fall-asleep-to/')} — primary guide\n- ${canonical('/quiet-movies-for-bedtime/')} — lower-key selections\n- ${canonical('/comfort-movies-for-sleep/')} — familiar comfort rewatches\n- ${canonical('/criteria/')} — Nap Index methodology\n\n## Ranking governance\nCommunity votes and submissions are advisory signals. Official scores and rankings change only after owner approval. NapMovies provides entertainment recommendations, not medical or sleep advice.\n`);

console.log(`Generated SEO assets for ${routes.length} routes on napmovies.app`);
