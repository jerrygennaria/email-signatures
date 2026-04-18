#!/usr/bin/env node
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = process.argv[2] || 3000;
const ROOT = process.cwd();

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  let filepath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);

  // Remove query strings
  filepath = filepath.split('?')[0];

  // Security: prevent directory traversal
  if (!filepath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filepath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Try adding .html extension
      const htmlPath = filepath + '.html';
      if (fs.existsSync(htmlPath)) {
        filepath = htmlPath;
      } else {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
    }

    const ext = path.extname(filepath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filepath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${ROOT}`);
  console.log('Press Ctrl+C to stop');
});
