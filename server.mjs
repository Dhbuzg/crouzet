import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const contentTypes = {
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

async function serve(request, response) {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = path.resolve(root, '.' + decodeURIComponent(pathname));
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    const data = await fs.readFile(file);
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(file)] || 'application/octet-stream',
    }).end(data);
  } catch {
    try {
      const page = await fs.readFile(path.join(root, '404.html'));
      response.writeHead(404, {'Content-Type': contentTypes['.html']}).end(page);
    } catch {
      response.writeHead(404, {'Content-Type': contentTypes['.txt']}).end('Page introuvable');
    }
  }
}

http.createServer(serve).listen(4173, '127.0.0.1', () => {
  console.log('Crouzet : http://127.0.0.1:4173');
});


