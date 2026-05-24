const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0].split('#')[0];
  const requested = path.resolve(ROOT, '.' + decodeURIComponent(urlPath));
  if (requested !== ROOT && !requested.startsWith(ROOT + path.sep)) {
    res.writeHead(403, SECURITY_HEADERS);
    res.end('Forbidden');
    return;
  }
  const ext = path.extname(requested);
  const mimeTypes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' };
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(requested, (err, content) => {
    if (err) { res.writeHead(404, SECURITY_HEADERS); res.end('Not found'); return; }
    res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
