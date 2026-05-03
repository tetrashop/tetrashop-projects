#!/bin/bash
set -e
YELLOW='\033[1;33m'; NC='\033[0m'
cd ~/tetrashop-projects/frontend

# مرحله ۳ دوباره (با فایل .cjs)
echo -e "${YELLOW}[3/7] ساخت inventory با build-inventory.cjs${NC}"
cd ~/tetrashop-projects/frontend
node build-inventory.cjs

# مرحله ۴
echo -e "${YELLOW}[4/7] ساخت صفحه محصولات دیجیتال و اصلاح Navbar${NC}"

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

# مرحله ۵
echo -e "${YELLOW}[5/7] رفع باگ‌های فرانت‌اند${NC}"
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

sed -i 's/"dev": ".*"/"dev": "next dev --webpack -p 3002"/' package.json

cat > tailwind.config.js << 'TAILWIND'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
TAILWIND

# مرحله ۶
echo -e "${YELLOW}[6/7] اطمینان از نصب پکیج‌ها${NC}"
npm install

# مرحله ۷
echo -e "${YELLOW}[7/7] راه‌اندازی فروشگاه${NC}"
npm run dev
