import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validate } from './validate.mjs';
import { render } from '../src/render.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(resolve(root, 'content/portfolio.json'), 'utf8'));
validate(data);
const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicitní HTML identifikátory.');
const fragments = [...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);
for (const id of fragments) assert(ids.includes(id), `Nefunkční vnitřní odkaz: ${id}`);
assert.equal((html.match(/<h1\b/g)||[]).length, 1, 'Stránka musí mít jeden hlavní nadpis.');
assert(html.includes('<html lang="cs"'), 'Chybí jazyk dokumentu.');
assert(!/href="(?:mailto:|tel:)/.test(html), 'Portfolio nesmí zveřejňovat kontakty.');
assert(!/<(?:img|video|iframe)\b[^>]*\bsrc="https?:/.test(html), 'Externí média nesmí být převzata bez schválení.');
assert(!/PLACEHOLDER|TODO|lorem ipsum/i.test(html), 'Nedokončený obsah.');
assert(html.includes('SCHEMATICKÁ VIZUALIZACE · SMYŠLENÁ DATA'), 'Graf musí uvádět původ dat.');
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
assert.equal(schema.mainEntity.name, 'Jan Smrž');
assert(!schema.mainEntity.email && !schema.mainEntity.telephone, 'Kontakty nesmí být ve strukturovaných datech.');
for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*assets\/[^"#?]+)"/g)) await access(resolve(root,'dist','.'+match[1].slice(match[1].indexOf('/assets/'))));
for (const file of ['src/app.js','src/render.mjs','scripts/build.mjs','scripts/dev.mjs','scripts/validate.mjs']) {
  const result = spawnSync(process.execPath, ['--check', file], { cwd: root, encoding:'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
// Verify that edited copy remains text, even if it contains markup, and broken citations fail the build.
const escaped = structuredClone(data);
escaped.copy.heroLine = '<img src=x onerror=alert(1)>';
assert(render(escaped).includes('&lt;img src=x onerror=alert(1)&gt;'));
const broken = structuredClone(data); broken.projects[0].sources = ['missing-source'];
assert.throws(()=>validate(broken), /Chybějící zdroj/);
const preview = render(data, {origin:'https://portfolio.example', robots:'noindex, nofollow'});
assert(preview.includes('<link rel="canonical" href="https://portfolio.example/">'));
assert(preview.includes('https://portfolio.example/assets/og.png'));
const pages = render(data, {origin:'https://portfolio.example/honza-smrz-portfolio', basePath:'/honza-smrz-portfolio'});
assert(pages.includes('src="/honza-smrz-portfolio/assets/app.js"'));
assert(pages.includes('href="/honza-smrz-portfolio/assets/style.css"'));
assert(pages.includes('https://portfolio.example/honza-smrz-portfolio/assets/og.png'));
assert(pages.includes('<link rel="canonical" href="https://portfolio.example/honza-smrz-portfolio/">'));
assert(!pages.includes('href="/assets/') && !pages.includes('src="/assets/'), 'GitHub Pages nesmí odkazovat na soubory v kořeni domény.');
const config = JSON.parse(await readFile(resolve(root,'vercel.json'),'utf8'));
assert.equal(config.outputDirectory,'dist');
assert(!JSON.stringify(config).includes('PLACEHOLDER'));
console.log(`Kontroly prošly: ${fragments.length} vnitřních odkazů, ${ids.length} unikátních ID, metadata, lokální média, zdroje, bezpečné vykreslení, syntaxe, Vercel.`);
