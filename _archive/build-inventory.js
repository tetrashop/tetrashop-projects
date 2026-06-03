const fs = require('fs');
const path = require('path');
const BASE = process.env.HOME + '/tetrashop-projects';

const projectPaths = [
  'bots/bale_tetrashop.py','bots/bale-bot.py','bots/atlas_bot.py','bots/tetrashop.py',
  'bots/tetrashop_bridge.py','bots/tetrashop_health_check.py',
  'ml-services/nlp-gateway-clean','ml-services/nlp-project-fixed','ml-services/ocr-service',
  'games/chess-engine','games/chess-integrated','games/chess-premium',
  'speech-recognition','writer','voice-recognition',
  'tetrashop-vercel','tetrashop-production','tetra-saas-platform','tetra-error-system',
  'user-management','payment','api','gateway','services','cms','admin','dashboard',
  'client-sdk','cloud-server','quantum-calligraphy-advanced','quantum-writer',
  'common-rhetoric-pro','aman-secret-cluster','secret-garden','wish-garden',
  'infrastructure','algorithms','apps','modules','2d-to-3d-real'
];

const results = [];
for (const rel of projectPaths) {
  const full = path.join(BASE, rel);
  if (!fs.existsSync(full)) continue;
  const name = path.basename(rel, path.extname(rel)).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  let type = 'Other';
  let main = '';
  if (fs.statSync(full).isFile() && full.endsWith('.py')) { type = 'Python'; main = path.basename(full); }
  else if (fs.existsSync(path.join(full,'package.json'))) { type = 'Node.js'; main = 'npm start'; }
  else if (fs.existsSync(path.join(full,'requirements.txt'))) { type = 'Python'; main = 'python main.py'; }
  else if (fs.existsSync(path.join(full,'composer.json'))) { type = 'PHP'; main = 'php artisan serve'; }

  // ایجاد README اگر وجود ندارد
  const readmePath = path.join(full, 'README.md');
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# ${name}\n\nDigital product from TetraShop.\n## Type: ${type}\n## Usage\n- Main: ${main}\n`);
  }
  let desc = fs.readFileSync(readmePath, 'utf8').split('\n').filter(l => l && !l.startsWith('#') && !l.startsWith('##'))[0] || 'Digital tool';
  const price = 99000; // تومان
  results.push({
    id: rel.replace(/\//g, '-'),
    name,
    description: desc,
    type,
    price,
    image: `https://picsum.photos/seed/${Buffer.from(rel).toString('hex').slice(0,8)}/400/400`
  });
}
fs.writeFileSync(path.join(process.env.HOME, 'tetrashop-projects/frontend/src/data/digitalProducts.json'), JSON.stringify(results, null, 2));
console.log('Digital products JSON created');
