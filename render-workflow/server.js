// LarpedIn headshot API (Render Web Service, start command: npm run start:api)
//
// The Studio page calls POST /headshot. This server hands the job to the
// Render workflow (index.js) and waits for the finished headshots.
// It exists because the Render API key must stay secret, so the website
// can't talk to the workflow directly.
//
// Env vars on this Render service:
//   RENDER_API_KEY        from Render > Account Settings > API Keys
//   WORKFLOW_SLUG         optional, defaults to "larpedin-headshots" (the workflow's name)
//   ALLOWED_ORIGIN        optional, e.g. https://pro-presence-lab.base44.app (defaults to any site)

import http from 'node:http';
import { Render } from '@renderinc/sdk';

const PORT = Number(process.env.PORT) || 10000;
const SLUG = process.env.WORKFLOW_SLUG || 'larpedin-headshots';
const ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ORIGIN,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error('Request too large'));
    });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

// GET /image?url=...  Re-serves a web image with permission for the browser to
// read its pixels (needed to paste the real face back on in the Studio page).
async function proxyImage(req, res) {
  try {
    const target = new URL(req.url, 'http://local').searchParams.get('url') || '';
    if (!/^https:\/\//.test(target)) return send(res, 400, { error: 'url must be https' });
    const upstream = await fetch(target);
    const type = upstream.headers.get('content-type') || '';
    if (!upstream.ok) return send(res, 502, { error: `Image fetch failed (${upstream.status})` });
    if (!type.startsWith('image/')) return send(res, 415, { error: 'Not an image' });
    const buf = Buffer.from(await upstream.arrayBuffer());
    if (buf.length > 15_000_000) return send(res, 413, { error: 'Image too large' });
    res.writeHead(200, {
      'Content-Type': type,
      'Access-Control-Allow-Origin': ORIGIN,
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(buf);
  } catch (err) {
    return send(res, 500, { error: String(err?.message ?? err) });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method === 'GET' && req.url.startsWith('/image')) return proxyImage(req, res);
  if (req.method === 'GET') return send(res, 200, { ok: true, service: 'larpedin-headshots-api' });
  if (req.method !== 'POST' || !req.url.startsWith('/headshot')) return send(res, 404, { error: 'Not found' });

  try {
    if (!process.env.RENDER_API_KEY) return send(res, 500, { error: 'RENDER_API_KEY not set on Render' });
    const input = await readJson(req);

    const render = new Render({ token: process.env.RENDER_API_KEY });
    const run = await render.workflows.startTask(`${SLUG}/generateHeadshots`, [input]);
    const finished = await run.get(); // waits until the workflow is done

    if (finished.status !== 'succeeded' && finished.status !== 'completed') {
      console.error('Workflow run did not succeed', finished.status, finished.error);
      return send(res, 502, { error: finished.error || `Headshot job ${finished.status}` });
    }

    const output = Array.isArray(finished.results) ? finished.results[0] : finished.results;
    const images = output?.images ?? [];
    if (!images.length) return send(res, 502, { error: 'No image returned' });
    return send(res, 200, { images });
  } catch (err) {
    console.error('headshot failed', err);
    return send(res, 500, { error: String(err?.message ?? err) });
  }
});

server.listen(PORT, () => console.log(`Headshot API listening on ${PORT}`));
