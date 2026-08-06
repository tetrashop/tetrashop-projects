import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
  const [walletBalance, setWalletBalance] = useState('...');

  useEffect(() => {
    fetch('/api/wallet/balance')
      .then(r => r.json())
      .then(data => {
        const irr = data.wallets?.find(w => w.currency === 'IRR');
        if (irr) setWalletBalance(irr.balance + ' ' + irr.symbol);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#059669', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🛍️ TetraShop</Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/products" style={{ color: 'white', textDecoration: 'none' }}>محصولات</Link>
          <Link href="/digital-products" style={{ color: 'white', textDecoration: 'none' }}>محصولات دیجیتال</Link>
          <Link href="/wallet" style={{ color: '#fbbf24', textDecoration: 'none' }}>💎 کیف پول <span style={{ fontSize: '0.8rem' }}>({walletBalance})</span></Link>
          <Link href="/olympic" style={{ color: 'white', textDecoration: 'none' }}>🏅 المپیک</Link>
          <Link href="/errors" style={{ color: 'white', textDecoration: 'none' }}>⚠️ خطاها</Link>
          <Link href="/search" style={{ color: 'white', textDecoration: 'none' }}>🔍 جستجو</Link>
          <Link href="/contact" style={{ color: 'white', textDecoration: 'none' }}>تماس با ما</Link>
          <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>درباره ما</Link>
          <a href="/dashboard.html" style={{ color: '#fbbf24', textDecoration: 'none' }}>پنل مدیریت</a>
        </nav>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer style={{ background: '#1f2937', color: '#e5e7eb', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>دسترسی سریع</h4>
            <Link href="/products" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>محصولات فیزیکی</Link>
            <Link href="/digital-products" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>محصولات دیجیتال</Link>
            <Link href="/wallet" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>کیف پول</Link>
            <Link href="/olympic" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>المپیک</Link>
            <Link href="/errors" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>خطاها</Link>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>پشتیبانی</h4>
            <Link href="/contact" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>تماس با ما</Link>
            <Link href="/about" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>درباره ما</Link>
            <Link href="/search" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>جستجو</Link>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>ابزارها</h4>
            <a href="/status.html" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>لاگ زنده</a>
            <a href="/dashboard.html" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>پنل مدیریت</a>
            <Link href="/admin/login" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>ورود مدیر</Link>
          </div>
        </div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>© ۱۴۰۵ TetraShop | توسعه‌دهنده: رامین اجلال</p>
      </footer>
    </div>
  );
}
