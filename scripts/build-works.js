const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const worksDir = path.join(root, 'works');
const worksOutput = path.join(root, 'assets', 'data', 'works.json');
const sitemapOutput = path.join(root, 'sitemap.xml');
const baseUrl = 'https://ssks.work';

const decode = (value = '') => value
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&#039;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

const readMeta = (html, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta\\s+name=["']${escaped}["']\\s+content=["']([^"']*)["']\\s*\\/?\\s*>`, 'i'),
    new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+name=["']${escaped}["']\\s*\\/?\\s*>`, 'i')
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decode(match[1].trim());
  }
  return '';
};

const xmlEscape = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

if (!fs.existsSync(worksDir)) fs.mkdirSync(worksDir, { recursive: true });

const files = fs.readdirSync(worksDir)
  .filter((file) => file.endsWith('.html') && !file.startsWith('_') && file !== 'work-template.html');

const works = files.map((file) => {
  const html = fs.readFileSync(path.join(worksDir, file), 'utf8');
  const title = readMeta(html, 'work:title');
  if (!title) {
    console.warn(`Skipped ${file}: work:title is missing.`);
    return null;
  }
  const image = readMeta(html, 'work:image');
  return {
    id: path.basename(file, '.html'),
    title,
    category: readMeta(html, 'work:category') || 'other',
    categoryLabel: readMeta(html, 'work:category-label') || 'PROJECT',
    year: readMeta(html, 'work:year'),
    summary: readMeta(html, 'work:summary'),
    url: `./works/${file}`,
    image: image ? image.replace(/^\.\.\//, './') : '',
    imageAlt: readMeta(html, 'work:image-alt') || title,
    placeholder: readMeta(html, 'work:category-label') || 'PROJECT',
    featured: readMeta(html, 'work:featured').toLowerCase() === 'true',
    published: readMeta(html, 'work:published').toLowerCase() !== 'false',
    order: Number(readMeta(html, 'work:order') || 0)
  };
}).filter(Boolean)
  .sort((a, b) => b.order - a.order || String(b.year).localeCompare(String(a.year)));

const publishedWorks = works.filter((work) => work.published !== false);

fs.mkdirSync(path.dirname(worksOutput), { recursive: true });
fs.writeFileSync(worksOutput, JSON.stringify(publishedWorks, null, 2) + '\n');
console.log(`Generated ${path.relative(root, worksOutput)} with ${publishedWorks.length} published work(s) (${works.length - publishedWorks.length} draft/sample excluded).`);

const staticUrls = [
  ['/', 'monthly', '1.0'],
  ['/about.html', 'monthly', '0.8'],
  ['/service.html', 'monthly', '0.9'],
  ['/service-ai.html', 'monthly', '0.8'],
  ['/service-web.html', 'monthly', '0.8'],
  ['/service-ec.html', 'monthly', '0.8'],
  ['/price.html', 'monthly', '0.9'],
  ['/works.html', 'weekly', '0.8'],
  ['/privacy.html', 'yearly', '0.3']
];

const workUrls = publishedWorks.map((work) => [
  work.url.replace(/^\./, ''),
  'monthly',
  '0.7'
]);

const allUrls = [...staticUrls, ...workUrls];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map(([url, changefreq, priority]) => `  <url>\n    <loc>${xmlEscape(baseUrl + url)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(sitemapOutput, sitemap);
console.log(`Generated ${path.relative(root, sitemapOutput)} with ${allUrls.length} URL(s).`);
