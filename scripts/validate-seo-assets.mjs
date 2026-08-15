import fs from 'node:fs';
import path from 'node:path';

const routes = ['/', '/criteria/', '/movies-to-fall-asleep-to/', '/quiet-movies-for-bedtime/', '/comfort-movies-for-sleep/'];
const distDir = path.resolve('dist');
const errors = [];

for (const route of routes) {
  const file = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const canonical = `https://napmovies.app${route}`;
  for (const required of [`<link rel="canonical" href="${canonical}"`, '<meta name="description"', 'application/ld+json', '<h1>']) {
    if (!html.includes(required)) errors.push(`${route} missing ${required}`);
  }
  if (route !== '/criteria/' && !html.includes('"@type":"ItemList"')) errors.push(`${route} missing ItemList schema`);
  if (route !== '/' && route !== '/criteria/' && !html.includes('"@type":"FAQPage"')) errors.push(`${route} missing FAQPage schema`);
}

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
