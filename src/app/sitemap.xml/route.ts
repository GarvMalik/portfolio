import { NextResponse } from 'next/server'

const BASE = 'https://garvmalik.lol'
const DATE = '2026-06-11'

const urls = [
  { loc: BASE,                                    changefreq: 'monthly', priority: '1.0' },
  { loc: `${BASE}/projects/cityloop`,             changefreq: 'yearly',  priority: '0.8' },
  { loc: `${BASE}/projects/mytown`,               changefreq: 'yearly',  priority: '0.8' },
  { loc: `${BASE}/projects/playpal`,              changefreq: 'yearly',  priority: '0.8' },
  { loc: `${BASE}/projects/noise-experiment`,     changefreq: 'yearly',  priority: '0.7' },
  { loc: `${BASE}/projects/talos`,                changefreq: 'yearly',  priority: '0.8' },
]

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${DATE}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}