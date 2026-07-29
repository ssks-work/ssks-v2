const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const worksDir = path.join(root, 'works');
const output = path.join(root, 'assets', 'data', 'works.json');

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

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(works, null, 2) + '\n');
console.log(`Generated ${path.relative(root, output)} from ${works.length} work HTML file(s).`);
