import fs from 'node:fs';
import path from 'node:path';
import { assertBuildOutputClean } from './security-headers.mjs';

const routes = ['/', '/criteria/', '/movies-to-fall-asleep-to/', '/quiet-movies-for-bedtime/', '/comfort-movies-for-sleep/', '/visually-dark-movies-to-fall-asleep-to/'];
const distDir = path.resolve('dist');
const errors = [];
// Attribution is the NapMovies Organization only; no personal names or profiles.
const forbiddenAttribution = [/steve[\s-]thoms/i, /thomstech12/i];

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

for (const route of routes) {
  const file = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const canonical = `https://napmovies.app${route}`;
  for (const required of [`<link rel="canonical" href="${canonical}"`, '<meta name="description"', 'application/ld+json', '<h1']) {
    if (!html.includes(required)) errors.push(`${route} missing ${required}`);
  }
  if (route !== '/criteria/' && !html.includes('"@type":"ItemList"')) errors.push(`${route} missing ItemList schema`);
  if (route !== '/' && route !== '/criteria/' && !html.includes('"@type":"FAQPage"')) errors.push(`${route} missing FAQPage schema`);

  const blocks = jsonLdBlocks(html);
  const organization = blocks.find((block) => block['@type'] === 'Organization');
  const website = blocks.find((block) => block['@type'] === 'WebSite');
  if (!organization) errors.push(`${route} missing Organization schema`);
  if (!website) errors.push(`${route} missing WebSite schema`);
  if (organization) {
    if (organization.name !== 'NapMovies') errors.push(`${route} Organization name must be NapMovies`);
    if (organization.alternateName !== 'Nap Movies') errors.push(`${route} Organization alternateName must be Nap Movies`);
    if (organization.url !== 'https://napmovies.app/') errors.push(`${route} Organization url mismatch`);
    if (!organization.logo?.url?.endsWith('/og-napmovies.png')) errors.push(`${route} Organization logo missing`);
    if (organization.sameAs) errors.push(`${route} Organization must not list personal profiles in sameAs`);
  }
  if (website) {
    if (website.name !== 'NapMovies') errors.push(`${route} WebSite name must be NapMovies`);
    if (website.alternateName !== 'Nap Movies') errors.push(`${route} WebSite alternateName must be Nap Movies`);
    if (website.url !== 'https://napmovies.app/') errors.push(`${route} WebSite url mismatch`);
    if (website.sameAs) errors.push(`${route} WebSite must not list personal profiles in sameAs`);
  }
  if (blocks.some((block) => block['@type'] === 'Person')) errors.push(`${route} must not include Person schema`);
  for (const pattern of forbiddenAttribution) {
    if (pattern.test(html)) errors.push(`${route} contains personal attribution ${pattern}`);
  }
}

const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const homeTitle = homeHtml.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
const homeH1 = (homeHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, '');
if (!homeTitle.startsWith('NapMovies')) errors.push('home title must lead with NapMovies');
if (!/^NapMovies|^Nap Movies/.test(homeH1)) errors.push('home h1 must lead with NapMovies or Nap Movies');
if (!homeHtml.includes('data-ssr="true"')) errors.push('home prerender is missing the server-rendered app');
if (!homeHtml.includes('A River Runs Through It')) errors.push('home prerender is missing the catalog');

const napGuide = fs.readFileSync(path.join(distDir, 'movies-to-fall-asleep-to', 'index.html'), 'utf8');
const napAnswer = 'Movies to nap to are usually familiar rewatches with steady pacing, predictable sound, and a mood you already know.';
if (!napGuide.includes(napAnswer)) errors.push('movies-to-fall-asleep-to answer-first intro is missing');

const darkRoute = '/visually-dark-movies-to-fall-asleep-to/';
const darkHtml = fs.readFileSync(path.join(distDir, 'visually-dark-movies-to-fall-asleep-to', 'index.html'), 'utf8');
const darkTitle = darkHtml.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
const darkH1 = (darkHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const darkDescription = darkHtml.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? '';
const darkQuery = 'visually dark movies to fall asleep to';
if (darkTitle.length === 0 || darkTitle.length > 60) errors.push(`visually dark title must be 1-60 characters (got ${darkTitle.length}: ${darkTitle})`);
if (!darkTitle.toLowerCase().includes(darkQuery)) errors.push('visually dark title must include the query');
if (darkH1.toLowerCase() !== darkQuery) errors.push(`visually dark h1 must match the query (got ${darkH1})`);
if (!darkDescription.toLowerCase().includes(darkQuery)) errors.push('visually dark meta description must include the query');
if (!darkHtml.includes('id="ranked-picks"') || !darkHtml.includes('id="questions"')) errors.push('visually dark page is missing an existing anchor id');
const darkMain = darkHtml.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? '';
if (darkMain.includes('—')) errors.push('visually dark page copy contains an em dash');
if (/tv shows/i.test(darkMain)) errors.push('visually dark page must not add a TV section without TV data');
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/\s+/g, ' ')
    .trim();
}
const darkVisible = visibleText(darkMain);
const darkFaq = jsonLdBlocks(darkHtml).find((block) => block['@type'] === 'FAQPage');
if (!darkFaq) errors.push('visually dark page missing FAQPage schema');
for (const entity of darkFaq?.mainEntity ?? []) {
  const question = entity?.name ?? '';
  const answer = entity?.acceptedAnswer?.text ?? '';
  if (!darkVisible.includes(question)) errors.push(`FAQ question is not visible: ${question}`);
  if (!darkVisible.includes(answer)) errors.push(`FAQ answer is not visible: ${question}`);
}
const darkLinks = [
  ['/movies-to-fall-asleep-to/', 'owner-approved movies to fall asleep to'],
  ['/quiet-movies-for-bedtime/', 'quiet movies for bedtime'],
  ['/comfort-movies-for-sleep/', 'familiar comfort movies for sleep'],
  ['/criteria/', 'what visual stillness means in the Nap Index'],
];
for (const [href, anchor] of darkLinks) {
  const linked = new RegExp(`<a\\b[^>]*href="${href}"[^>]*>${anchor}</a>`).test(darkMain);
  if (!linked) errors.push(`visually dark page missing descriptive link ${href} (${anchor})`);
}
const darkMarkdown = fs.readFileSync(path.join(distDir, 'visually-dark-movies-to-fall-asleep-to.md'), 'utf8');
if (darkMarkdown.includes('—')) errors.push('visually dark markdown mirror contains an em dash');
if (!darkMarkdown.toLowerCase().includes(darkQuery)) errors.push('visually dark markdown mirror missing the query');

const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
for (const route of routes) {
  if (!sitemap.includes(`https://napmovies.app${route}`)) errors.push(`sitemap missing ${route}`);
}
for (const artifact of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  if (!fs.existsSync(path.join(distDir, artifact))) errors.push(`missing ${artifact}`);
}
const llms = fs.readFileSync(path.join(distDir, 'llms.txt'), 'utf8');
if (!llms.includes('not medical or sleep advice')) errors.push('llms.txt missing editorial disclaimer');

const markdownRoutes = ['/', '/criteria/', '/movies-to-fall-asleep-to/', '/quiet-movies-for-bedtime/', '/comfort-movies-for-sleep/', '/visually-dark-movies-to-fall-asleep-to/'];
for (const route of markdownRoutes) {
  const file = route === '/' ? path.join(distDir, 'index.md') : path.join(distDir, `${route.replace(/^\/|\/$/g, '')}.md`);
  if (!fs.existsSync(file)) {
    errors.push(`missing markdown mirror for ${route}`);
    continue;
  }
  const markdown = fs.readFileSync(file, 'utf8');
  if (!markdown.startsWith('# ')) errors.push(`markdown mirror for ${route} must start with an h1`);
  if (!markdown.includes(`https://napmovies.app${route}`)) errors.push(`markdown mirror for ${route} missing its canonical URL`);
  if (markdown.length < 300) errors.push(`markdown mirror for ${route} is too short (${markdown.length} chars)`);
}

if (errors.length) throw new Error(`SEO validation failed:\n${errors.join('\n')}`);
assertBuildOutputClean(distDir);
console.log(`Validated SEO assets for ${routes.length} routes.`);
