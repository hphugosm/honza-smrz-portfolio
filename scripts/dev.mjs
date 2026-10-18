import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv.includes('--built')) {
  const build = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit' });
  if (build.status) process.exit(build.status);
}
const base = resolve(root, 'dist');
const port = Number(process.env.PORT || 4173);
const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server = http.createServer(async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); res.end(); return; }
  try {
    let pathname = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
    if (basePath && (pathname === '/' || pathname === basePath)) { res.writeHead(308, {Location:basePath+'/'}); res.end(); return; }
    if (basePath && pathname.startsWith(basePath+'/')) pathname = pathname.slice(basePath.length);
    const path = resolve(base, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(base + sep)) { res.writeHead(403); res.end(); return; }
    let body, status = 200;
    try { if (!(await stat(path)).isFile()) throw Error(); body = await readFile(path); }
    catch { body = await readFile(resolve(base, '404.html')); status = 404; }
    res.writeHead(status, {'Content-Type': status===404 ? types['.html'] : types[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD' ? undefined : body);
  } catch { res.writeHead(400); res.end('Bad request'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
