import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { render, escapeHtml } from '../src/render.mjs';
import { validate } from './validate.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(resolve(root, 'content/portfolio.json'), 'utf8'));
validate(data);
// A deployment origin is configuration, never inferred from a person's name.
const configured = process.env.SITE_URL || data.meta.siteUrl;
const fallback = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '';
const origin = (configured || fallback).replace(/\/$/, '');
const siteUrl = origin ? new URL(origin) : null;
if (siteUrl && (siteUrl.protocol !== 'https:' || siteUrl.search || siteUrl.hash || siteUrl.username || siteUrl.password)) throw Error('SITE_URL musí být HTTPS adresa webu bez parametrů a přihlašovacích údajů.');
const urlBasePath = siteUrl?.pathname.replace(/\/$/, '') || '';
const basePath = (process.env.BASE_PATH || urlBasePath).replace(/\/$/, '');
if (basePath && !/^\/[a-zA-Z0-9_/-]+$/.test(basePath)) throw Error('Neplatná cesta BASE_PATH.');
if (urlBasePath && basePath !== urlBasePath) throw Error('BASE_PATH neodpovídá cestě v SITE_URL.');
const indexable = data.meta.indexable && !!origin && process.env.VERCEL_ENV !== 'preview';
const robots = indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow';
await rm(resolve(root, 'dist'), { recursive: true, force: true });
await mkdir(resolve(root, 'dist/assets'), { recursive: true });
await cp(resolve(root, 'public'), resolve(root, 'dist/assets'), { recursive: true });
await Promise.all([
  writeFile(resolve(root, 'dist/index.html'), render(data, { origin, robots, basePath })),
  cp(resolve(root, 'src/style.css'), resolve(root, 'dist/assets/style.css')),
  cp(resolve(root, 'src/app.js'), resolve(root, 'dist/assets/app.js')),
  writeFile(resolve(root, 'dist/robots.txt'), indexable ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n'),
  writeFile(resolve(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable?`<url><loc>${escapeHtml(origin)}/</loc><lastmod>${data.meta.verifiedAt}</lastmod></url>`:''}</urlset>`),
  writeFile(resolve(root, 'dist/.nojekyll'), ''),
  writeFile(resolve(root, 'dist/404.html'), `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><link rel="stylesheet" href="${escapeHtml(basePath)}/assets/style.css"><title>Stránka nenalezena — Honza Smrž</title></head><body><main class="wrap section"><p class="eyebrow">404</p><h1>Tenhle nápad<br>tu ještě není.</h1><p>Požadovaná stránka neexistuje.</p><a class="button button-lime" href="${escapeHtml(basePath)}/">Zpět na portfolio ↗</a></main></body></html>`)
]);
console.log(`Build dokončen: dist/ · ${data.sources.length} zdrojů · ${data.projects.length} projektů a aktivit · ${robots}`);
