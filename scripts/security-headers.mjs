import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const MAX_HEADER_LINE = 2000;

function walk(dir, predicate, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(filePath, predicate, acc);
    else if (predicate(filePath)) acc.push(filePath);
  }
  return acc;
}

function sha256Source(content) {
  const digest = crypto.createHash('sha256').update(content, 'utf8').digest('base64');
  return `'sha256-${digest}'`;
}

function inlineHashes(html) {
  const scripts = new Set();
  const styles = new Set();
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(match[1])) continue;
    scripts.add(sha256Source(match[2]));
  }
  for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    styles.add(sha256Source(match[1]));
  }
  return { scripts, styles };
}

export function contentSecurityPolicy(scriptHashes, styleHashes) {
  const scriptSrc = ["'self'", 'https://static.cloudflareinsights.com', ...scriptHashes].join(' ');
  const styleSrc = ["'self'", ...styleHashes].join(' ');
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "script-src-attr 'none'",
    `style-src ${styleSrc}`,
    "style-src-attr 'none'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "form-action 'none'",
    "worker-src 'none'",
  ].join('; ');
}

export function writeSecurityHeaders(distDir) {
  const scriptHashes = new Set();
  const styleHashes = new Set();
  for (const file of walk(distDir, (filePath) => filePath.endsWith('.html'))) {
    const html = fs.readFileSync(file, 'utf8');
    const found = inlineHashes(html);
    for (const hash of found.scripts) scriptHashes.add(hash);
    for (const hash of found.styles) styleHashes.add(hash);
  }
  const policy = contentSecurityPolicy([...scriptHashes].sort(), [...styleHashes].sort());
  const lines = [
    '/*',
    `  Content-Security-Policy: ${policy}`,
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '',
  ];
  for (const line of lines) {
    if (line.length > MAX_HEADER_LINE) {
      throw new Error(`_headers line is ${line.length} characters; Workers static assets allow ${MAX_HEADER_LINE}`);
    }
  }
  fs.writeFileSync(path.join(distDir, '_headers'), lines.join('\n'));
  return policy;
}

export function assertBuildOutputClean(distDir) {
  const blocked = [`zo${'computer'}`, `zo${'wa'}`];
  const hits = [];
  for (const file of walk(distDir, () => true)) {
    const lower = fs.readFileSync(file).toString('latin1').toLowerCase();
    if (blocked.some((needle) => lower.includes(needle))) hits.push(path.relative(distDir, file));
  }
  if (hits.length) {
    throw new Error(`Build output contains a removed analytics host in: ${hits.join(', ')}`);
  }

  const headersPath = path.join(distDir, '_headers');
  if (!fs.existsSync(headersPath)) throw new Error('dist/_headers is missing');
  const headers = fs.readFileSync(headersPath, 'utf8');
  const required = [
    'Content-Security-Policy:',
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    'https://static.cloudflareinsights.com',
    'https://cloudflareinsights.com',
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: strict-origin-when-cross-origin',
    "script-src-attr 'none'",
  ];
  for (const item of required) {
    if (!headers.includes(item)) throw new Error(`dist/_headers missing ${item}`);
  }
  if (/script-src[^;]*'unsafe-inline'/.test(headers)) {
    throw new Error("script-src must not allow 'unsafe-inline'");
  }
  for (const line of headers.split('\n')) {
    if (line.length > MAX_HEADER_LINE) throw new Error(`_headers line exceeds ${MAX_HEADER_LINE} characters (${line.length})`);
  }

  for (const file of walk(distDir, (filePath) => filePath.endsWith('.html'))) {
    const html = fs.readFileSync(file, 'utf8');
    if (/\sstyle\s*=/i.test(html)) {
      throw new Error(`${path.relative(distDir, file)} has a style attribute, which the Content-Security-Policy blocks`);
    }
  }
}
