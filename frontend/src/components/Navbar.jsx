import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const totalItems = useCartStore(s => s.totalItems());
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-emerald-600">🛍️ TetraShop</Link>
          <Link href="/digital-products" className="text-gray-700 hover:text-emerald-600">محصولات دیجیتال</Link>
        </div>
        <button onClick={() => setOpen(true)} className="relative text-gray-700 hover:text-emerald-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
          {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>}
        </button>
      </div>
      {open && <CartSidebar onClose={() => setOpen(false)} />}
    </nav>
  );
}
