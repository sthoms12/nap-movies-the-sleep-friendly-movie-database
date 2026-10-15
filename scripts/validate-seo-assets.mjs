import fs from 'node:fs';
import path from 'node:path';

const routes = ['/', '/criteria/', '/movies-to-fall-asleep-to/', '/quiet-movies-for-bedtime/', '/comfort-movies-for-sleep/'];
const distDir = path.resolve('dist');
const errors = [];
const referencedProfiles = [
  'https://www.linkedin.com/in/steve-thoms-81381990',
  'https://x.com/thomstech12',
];

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

for (const route of routes) {
  const file = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const canonical = `https://napmovies.app${route}`;
  for (const required of [`<link rel="canonical" href="${canonical}"`, '<meta name="description"', 'application/ld+json', '<h1>']) {
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
    const sameAs = organization.sameAs ? [].concat(organization.sameAs) : [];
    if (sameAs.length !== referencedProfiles.length || referencedProfiles.some((profile) => !sameAs.includes(profile))) {
      errors.push(`${route} Organization sameAs must be only the referenced profiles`);
    }
  }
  if (website) {
    if (website.name !== 'NapMovies') errors.push(`${route} WebSite name must be NapMovies`);
    if (website.alternateName !== 'Nap Movies') errors.push(`${route} WebSite alternateName must be Nap Movies`);
    if (website.url !== 'https://napmovies.app/') errors.push(`${route} WebSite url mismatch`);
    const sameAs = website.sameAs ? [].concat(website.sameAs) : [];
    for (const profile of sameAs) {
      if (!referencedProfiles.includes(profile)) errors.push(`${route} WebSite sameAs is not a referenced profile: ${profile}`);
    }
  }
  for (const profile of referencedProfiles) {
    if (!html.includes(profile)) errors.push(`${route} dropped referenced profile ${profile}`);
  }
}

const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const homeTitle = homeHtml.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
const homeH1 = homeHtml.match(/<h1>([^<]*)<\/h1>/)?.[1] ?? '';
if (!homeTitle.startsWith('NapMovies')) errors.push('home title must lead with NapMovies');
if (!/^NapMovies|^Nap Movies/.test(homeH1)) errors.push('home h1 must lead with NapMovies or Nap Movies');

const napGuide = fs.readFileSync(path.join(distDir, 'movies-to-fall-asleep-to', 'index.html'), 'utf8');
const napAnswer = 'Movies to nap to are usually familiar rewatches with steady pacing, predictable sound, and a mood you already know.';
if (!napGuide.includes(napAnswer)) errors.push('movies-to-fall-asleep-to answer-first intro is missing');

const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
for (const route of routes) {
  if (!sitemap.includes(`https://napmovies.app${route}`)) errors.push(`sitemap missing ${route}`);
}
for (const artifact of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  if (!fs.existsSync(path.join(distDir, artifact))) errors.push(`missing ${artifact}`);
}
const llms = fs.readFileSync(path.join(distDir, 'llms.txt'), 'utf8');
if (!llms.includes('not medical or sleep advice')) errors.push('llms.txt missing editorial disclaimer');

if (errors.length) throw new Error(`SEO validation failed:\n${errors.join('\n')}`);
console.log(`Validated SEO assets for ${routes.length} routes.`);
