#!/bin/bash
# ============================================================
#  TetraShop Frontend - Full Setup Script (Next.js + Tailwind + Zustand)
#  اجرا در مسیر ~/tetrashop-projects/frontend
#  یک کپی پیست کامل تمام نیازمندی‌ها
# ============================================================
set -o pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[1/9] کشتن پروسه‌های قبلی node ...${NC}"
pkill -9 node 2>/dev/null || true
sleep 1

echo -e "${YELLOW}[2/9] ورود به پوشه پروژه ...${NC}"
cd ~/tetrashop-projects/frontend || { echo -e "${RED}مسیر وجود ندارد${NC}"; exit 1; }
echo -e "${GREEN}مسیر فعلی: $(pwd)${NC}"

echo -e "${YELLOW}[3/9] نصب پکیج‌های اصلی ...${NC}"
# حذف react-router-dom اگر هنوز هست
npm uninstall react-router-dom 2>/dev/null || true
# نصب latest نسخه‌های سازگار
npm install next@latest react@latest react-dom@latest zustand
# نصب tailwind و postcss
npm install -D tailwindcss postcss autoprefixer

echo -e "${YELLOW}[4/9] ایجاد پوشه‌های مورد نیاز ...${NC}"
mkdir -p src/{components,pages,data,types,store,utils}
mkdir -p pages/product

echo -e "${YELLOW}[5/9] ایجاد فایل‌های پروژه ...${NC}"

# ---- src/types/product.ts ----
cat > src/types/product.ts << 'TYPES'
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
TYPES

# ---- src/data/products.ts ----
cat > src/data/products.ts << 'DATA'
import { Product } from '../types/product';

export const fakeProducts: Product[] = [
  {
    id: 1,
    name: 'هدفون بی‌سیم مدل X1',
    description: 'کیفیت صدای بالا، باتری ۲۰ ساعته',
    price: 3500000,
    image: 'https://picsum.photos/seed/headphone/400/400',
    category: 'electronics',
  },
  {
    id: 2,
    name: 'کوله‌پشتی لپ‌تاپ',
    description: 'ضدآب، جادار، مناسب سایز ۱۵.۶ اینچ',
    price: 1250000,
    image: 'https://picsum.photos/seed/backpack/400/400',
    category: 'accessories',
  },
  {
    id: 3,
    name: 'ماگ سرامیکی طرح‌دار',
    description: 'ظرفیت ۳۵۰ میلی‌لیتر، قابل شستشو در ماشین',
    price: 280000,
    image: 'https://picsum.photos/seed/mug/400/400',
    category: 'home',
  },
  {
    id: 4,
    name: 'کتاب آموزش React',
    description: 'از مبتدی تا پیشرفته در ۴۰۰ صفحه',
    price: 475000,
    image: 'https://picsum.photos/seed/book/400/400',
    category: 'books',
  },
  {
    id: 5,
    name: 'ساعت هوشمند Sport Pro',
    description: 'نمایش ضربان قلب، گام‌شمار، ضدآب',
    price: 4200000,
    image: 'https://picsum.photos/seed/watch/400/400',
    category: 'electronics',
  },
  {
    id: 6,
    name: 'شارژر فندکی USB-C',
    description: 'توان ۳۰ وات، سازگار با تمام گوشی‌ها',
    price: 195000,
    image: 'https://picsum.photos/seed/charger/400/400',
    category: 'electronics',
  },
];
DATA

# ---- src/utils/formatPrice.ts ----
cat > src/utils/formatPrice.ts << 'UTIL'
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}
UTIL

# ---- src/store/cartStore.ts (Zustand) ----
cat > src/store/cartStore.ts << 'STORE'
import { create } from 'zustand';
import { Product } from '../types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find(item => item.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: () =>
    get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
}));
STORE

# ---- src/components/ProductCard.tsx ----
cat > src/components/ProductCard.tsx << 'CARD'
import Link from 'next/link';
import { Product } from '../types/product';
import { formatPrice } from '../utils/formatPrice';
import { useCartStore } from '../store/cartStore';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(state => state.addItem);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col items-center text-center">
      <Link href={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 object-cover rounded-xl mb-4 cursor-pointer"
        />
      </Link>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.description}</p>
      <span className="text-xl font-bold text-emerald-600 mb-3">
        {formatPrice(product.price)} تومان
      </span>
      <button
        onClick={() => addItem(product)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors w-full"
      >
        افزودن به سبد خرید
      </button>
    </div>
  );
}
CARD

# ---- src/components/Navbar.tsx ----
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
        <Link href="/" className="text-2xl font-bold text-emerald-600">
          🛍️ TetraShop
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-gray-700 hover:text-emerald-600 transition-colors"
          >
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
      </div>
      {cartOpen && <CartSidebar onClose={() => setCartOpen(false)} />}
    </nav>
  );
}
NAV

# ---- src/components/CartSidebar.tsx ----
cat > src/components/CartSidebar.tsx << 'CART'
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatPrice';

type Props = { onClose: () => void };

export default function CartSidebar({ onClose }: Props) {
  const items = useCartStore(state => state.items);
  const totalPrice = useCartStore(state => state.totalPrice());
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full shadow-xl p-6 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">سبد خرید</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">سبد خرید خالی است</p>
        ) : (
          <>
            <ul className="flex-1 divide-y">
              {items.map(item => (
                <li key={item.product.id} className="py-4 flex gap-4 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">{formatPrice(item.product.price)} تومان</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >+</button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>جمع:</span>
                <span>{formatPrice(totalPrice)} تومان</span>
              </div>
              <button
                onClick={clearCart}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
              >
                خالی کردن سبد
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
CART

# ---- pages/index.tsx ----
cat > pages/index.tsx << 'INDEX'
import { fakeProducts } from '../src/data/products';
import ProductCard from '../src/components/ProductCard';
import Navbar from '../src/components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          فروشگاه تتــــرا
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {fakeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
INDEX

# ---- pages/product/[id].tsx ----
cat > pages/product/[id].tsx << 'DETAIL'
import { useRouter } from 'next/router';
import { fakeProducts } from '../../src/data/products';
import { formatPrice } from '../../src/utils/formatPrice';
import Navbar from '../../src/components/Navbar';
import { useCartStore } from '../../src/store/cartStore';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = fakeProducts.find((p) => p.id === Number(id));
  const addItem = useCartStore(state => state.addItem);

  if (!product) {
    return (
      <div className="p-8 text-center text-red-500">محصول پیدا نشد!</div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded-2xl mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <span className="text-2xl font-bold text-emerald-600 block mb-6">
          {formatPrice(product.price)} تومان
        </span>
        <button
          onClick={() => addItem(product)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg w-full md:w-auto"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </>
  );
}
DETAIL

# ---- pages/_app.tsx ----
cat > pages/_app.tsx << 'APP'
import type { AppProps } from 'next/app';
import '../src/index.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
APP

echo -e "${GREEN}فایل‌های صفحات و کامپوننت‌ها ایجاد شدند.${NC}"

echo -e "${YELLOW}[6/9] تنظیم tailwind و postcss ...${NC}"
npx tailwindcss init -p 2>/dev/null || true

# بازنویسی tailwind.config.js برای پوشه‌های درست
cat > tailwind.config.js << 'TAILWIND'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
TAILWIND

# src/index.css
cat > src/index.css << 'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS

echo -e "${YELLOW}[7/9] تنظیم next.config برای ESM ...${NC}"
# تشخیص اینکه package.json "type": "module" دارد یا نه
if grep -q '"type": "module"' package.json 2>/dev/null; then
  echo "حالت ESM فعال است. استفاده از next.config.mjs"
  cat > next.config.mjs << 'CONFIGMJS'
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
CONFIGMJS
  # اگر next.config.js وجود داشت حذف کن
  rm -f next.config.js next.config.cjs
else
  echo "حالت CommonJS. استفاده از next.config.js"
  cat > next.config.js << 'CONFIGJS'
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

module.exports = nextConfig;
CONFIGJS
  rm -f next.config.mjs next.config.cjs
fi

echo -e "${YELLOW}[8/9] اصلاح package.json (scripts) ...${NC}"
# اطمینان از وجود اسکریپت dev مناسب
if grep -q '"dev"' package.json; then
  # اسکریپت dev را بهینه کنیم
  sed -i 's/"dev":.*/"dev": "next dev --webpack -p 3002",/' package.json
else
  echo 'افزودن dev script'
  # اضافه کردن در صورت نبود
  sed -i '/"scripts": {/a \    "dev": "next dev --webpack -p 3002",' package.json
fi

echo -e "${YELLOW}[9/9] راه‌اندازی پروژه ...${NC}"
echo -e "${GREEN}همه چیز آماده است. در حال اجرای npm run dev...${NC}"
npm run dev
