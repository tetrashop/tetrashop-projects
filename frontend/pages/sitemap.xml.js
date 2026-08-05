const BASE = 'https://tetrashop-projects-seven.vercel.app';

export async function getServerSideProps({ res }) {
  const pages = [
    '', '/products', '/digital-products', '/search', '/contact', '/about',
    '/status.html', '/dashboard.html',
    '/demos/bot.html', '/demos/chess.html', '/demos/ai.html', '/demos/finance.html', '/demos/error-system.html', '/demos/olympic.html',
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${BASE}${p ? '/' + p : ''}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
  return { props: {} };
}

export default function Sitemap() { return null; }
