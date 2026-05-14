import { Hono } from 'hono'

const app = new Hono()

// This worker handles only API routes.
// All static files (HTML, CSS, JS, images) are served directly by
// Cloudflare Pages via the _routes.json exclude list — no serveStatic needed.

// Health check / API example
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', site: 'Sources of Inspiration in Art' })
})

// Fallback — serve index.html for any unmatched route
app.get('*', async (c) => {
  // In production (Cloudflare Pages), static files are served natively.
  // This fallback only fires for truly unknown routes.
  return c.html(`<!DOCTYPE html>
<html><head><meta http-equiv="refresh" content="0;url=/index.html"></head>
<body><a href="/index.html">Go to site</a></body></html>`)
})

export default app
