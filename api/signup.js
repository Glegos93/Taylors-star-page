import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const CSV_PATH = path.join(__dirname, 'submissions.csv');

function csvEscape(value) {
  if (value == null) return '';
  const s = String(value).replace(/"/g, '""');
  return `"${s}"`;
}

function ensureHeader() {
  if (!fs.existsSync(CSV_PATH)) {
    const header = 'name,chapter,email,submittedAt\n';
    fs.writeFileSync(CSV_PATH, header, { encoding: 'utf8' });
  }
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const row = [data.name, data.chapter, data.email, new Date().toISOString()]
          .map(csvEscape)
          .join(',') + '\n';
        ensureHeader();
        fs.appendFileSync(CSV_PATH, row, { encoding: 'utf8' });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        console.error('Failed to process submission', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: String(err) }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/submissions.csv') {
    if (!fs.existsSync(CSV_PATH)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const stream = fs.createReadStream(CSV_PATH);
    res.writeHead(200, { 'Content-Type': 'text/csv' });
    stream.pipe(res);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`CSV server listening on http://localhost:${PORT}`);
});
