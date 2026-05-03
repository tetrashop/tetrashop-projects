#!/bin/bash
set -e

###############################################
# TetraShop - Full Digital Product Integration
# اجرا در ~/tetrashop-projects/frontend
###############################################

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
BASE=~/tetrashop-projects
FRONTEND=$BASE/frontend

echo -e "${YELLOW}[1/7] کشتن پروسه‌های قدیمی و ورود به پوشه${NC}"
pkill -9 node 2>/dev/null || true
sleep 1
cd $FRONTEND

echo -e "${YELLOW}[2/7] نصب وابستگی‌های اصلی${NC}"
npm install next@latest react@latest react-dom@latest zustand tailwindcss postcss autoprefixer

echo -e "${YELLOW}[3/7] اسکن پروژه‌های دیجیتال و ساخت inventory${NC}"
cd $BASE

# یک اسکریپت کمکی Node.js برای ساخت JSON (بدون نیاز به jq)
cat > build-inventory.js << 'EOFJS'
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
EOFJS

node build-inventory.js
rm build-inventory.js

echo -e "${YELLOW}[4/7] ساخت صفحه محصولات دیجیتال و اصلاح Navbar${NC}"
cd $FRONTEND

# تایپ محصول دیجیتال
cat > src/types/digitalProduct.ts << 'EOF'
export interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  image: string;
}
EOF

# صفحه /digital-products
cat > pages/digital-products.tsx << 'PAGE'
import Navbar from '../src/components/Navbar';
import digitalProducts from '../src/data/digitalProducts.json';
import { formatPrice } from '../src/utils/formatPrice';
import { useCartStore } from '../src/store/cartStore';

export default function DigitalProductsPage() {
  const addItem = useCartStore(state => state.addItem);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">محصولات دیجیتال</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {digitalProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <span className="text-sm text-gray-500 mb-3">نوع: {product.type}</span>
              <span className="text-2xl font-bold text-emerald-600 mb-4">{formatPrice(product.price)} تومان</span>
              <button
                onClick={() => addItem({ id: parseInt(product.id, 36), name: product.name, description: product.description, price: product.price, image: product.image, category: 'digital' })}
                className="mt-auto bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                افزودن به سبد خرید
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
PAGE

# آپدیت Navbar با لینک محصولات دیجیتال
cat > src/components/Navbar.tsx << 'NAV'
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const totalItems = useCartStore(state => state.totalItems());
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-emerald-600">
            🛍️ TetraShop
          </Link>
          <Link href="/digital-products" className="text-gray-700 hover:text-emerald-600 transition-colors">
            محصولات دیجیتال
          </Link>
        </div>
        <button onClick={() => setCartOpen(true)} className="relative text-gray-700 hover:text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
      {cartOpen && <CartSidebar onClose={() => setCartOpen(false)} />}
    </nav>
  );
}
NAV

echo -e "${YELLOW}[5/7] رفع باگ‌های فرانت‌اند${NC}"
# اصلاح next.config برای ESM/CJS و Watchpack
cat > next.config.mjs << 'CONFIG'
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: ['/data/**', '/**/node_modules'],
      };
    }
    return config;
  },
};
export default nextConfig;
CONFIG
rm -f next.config.js next.config.cjs

# اصلاح package.json - اسکریپت dev
sed -i 's/"dev": ".*"/"dev": "next dev --webpack -p 3002"/' package.json

# اطمینان از وجود tailwind.config.js
cat > tailwind.config.js << 'TAILWIND'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
TAILWIND

echo -e "${YELLOW}[6/7] اطمینان از نصب پکیج‌های مورد نیاز${NC}"
npm install

echo -e "${YELLOW}[7/7] راه‌اندازی فروشگاه با محصولات دیجیتال${NC}"
npm run dev
