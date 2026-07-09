import fs from 'node:fs';
import path from 'node:path';

const siteOrigin = 'https://napmovies.app';
const distDir = path.resolve('dist');
const baseHtmlPath = path.join(distDir, 'index.html');

const routes = [
  {
    path: '/',
    output: path.join(distDir, 'index.html'),
    title: 'NapMovies | Sleep-Friendly Movies for Quiet Nights',
    description:
      'A calm, curated archive of sleep-friendly movies ranked for low-stress, familiar, quiet-night viewing.',
    h1: 'NapMovies',
  },
  {
    path: '/criteria',
    output: path.join(distDir, 'criteria', 'index.html'),
    title: 'NapMovies Methodology | How the Nap Index Works',
    description:
      'See how NapMovies scores sleep-friendly movies using calm audio, familiar pacing, visual stillness, and low-stress story criteria.',
    h1: 'NapMovies methodology',
  },
];

const notFound = {
  path: '/404',
  output: path.join(distDir, '404.html'),
  title: 'Page Not Found | NapMovies',
  description:
    'This NapMovies page does not exist. Return to the sleep-friendly movie archive or review the Nap Index methodology.',
  h1: 'Page not found',
};

const today = new Date().toISOString().slice(0, 10);
const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
const movies = JSON.parse(fs.readFileSync(path.resolve('public/movies.json'), 'utf8'));

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function canonical(routePath) {
  return `${siteOrigin}${routePath === '/' ? '/' : routePath}`;
}

function itemListJsonLd() {
  const sortedMovies = [...movies].sort(
    (a, b) => b.napIndex - a.napIndex || a.title.localeCompare(b.title),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'NapMovies sleep-friendly movie archive',
    description: 'A ranked archive of low-stress movies for quiet-night viewing.',
    url: canonical('/'),
    numberOfItems: sortedMovies.length,
    itemListElement: sortedMovies.map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        datePublished: String(movie.year),
        duration: movie.duration ? `PT${movie.duration}M` : undefined,
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Nap Index',
            value: `${movie.napIndex}/10`,
          },
        ],
        keywords: movie.tags.join(', '),
      },
    })),
  };
}

function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NapMovies',
    url: canonical('/'),
    description: 'A calm, curated archive of sleep-friendly movies.',
  };
}

function methodologyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'NapMovies Methodology',
    url: canonical('/criteria'),
    description: routes[1].description,
    isPartOf: {
      '@type': 'WebSite',
      name: 'NapMovies',
      url: canonical('/'),
    },
  };
}

function routeJsonLd(routePath) {
  if (routePath === '/') return [websiteJsonLd(), itemListJsonLd()];
  if (routePath === '/criteria') return [methodologyJsonLd()];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Page Not Found',
      url: canonical('/404'),
      isPartOf: {
        '@type': 'WebSite',
        name: 'NapMovies',
        url: canonical('/'),
      },
    },
  ];
}

function headTags(route) {
  const url = canonical(route.path);
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const jsonLd = routeJsonLd(route.path)
    .map((entry) => JSON.stringify(entry))
    .map((json) => `<script type="application/ld+json">${json}</script>`)
    .join('\n    ');

  return `<!-- SEO_META_START -->
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="${route.path === '/404' ? 'noindex, follow' : 'index, follow'}" />
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
  return `<noscript>
      <section>
        <h1>${escapeHtml(route.h1)}</h1>
        <p>${escapeHtml(route.description)}</p>
        <p><a href="/">Movie archive</a> | <a href="/criteria">Methodology</a></p>
      </section>
    </noscript>`;
}

function renderHtml(route) {
  let html = baseHtml
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
      `<meta name="description" content="${escapeHtml(route.description)}" />`,
    );

  html = html.replace(/\s*<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/s, '');
  html = html.replace('</head>', `    ${headTags(route)}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${fallbackMarkup(route)}`);
  return html;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

for (const route of [...routes, notFound]) {
  writeFile(route.output, renderHtml(route));
}

writeFile(
  path.join(distDir, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${siteOrigin}/sitemap.xml
`,
);

writeFile(
  path.join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${canonical(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route.path === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`,
);

console.log('Generated SEO assets for napmovies.app');
