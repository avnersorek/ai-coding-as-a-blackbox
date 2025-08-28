import { readFileSync } from 'fs';
import path from 'path';

export default function spaFallback() {
  return {
    name: 'spa-fallback',
    configurePreviewServer(server) {
      server.middlewares.use('*', (req, res, next) => {
        if (req.method === 'GET' && !req.url.includes('.') && !req.url.includes('api')) {
          try {
            const indexPath = path.resolve('dist/index.html');
            const html = readFileSync(indexPath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
          } catch (e) {
            next();
          }
        } else {
          next();
        }
      });
    }
  };
}