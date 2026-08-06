import { useState, useEffect } from 'react';
import Link from 'next/link';
import SupportWidget from './SupportWidget';

export default function Layout({ children }) {
  const [walletBalance, setWalletBalance] = useState('...');
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsEmail, setNewsEmail] = useState('');
  const [newsMsg, setNewsMsg] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    fetch('/api/wallet/balance')
      .then(r => r.json())
      .then(d => { const irr = d.wallets?.find(w => w.currency === 'IRR'); if(irr) setWalletBalance(irr.balance + ' ' + irr.symbol); })
      .catch(() => {});

    // بررسی وضعیت ورود
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      setRole(localStorage.getItem('role') || 'user');
    }
  }, []);

  const linkStyle = { color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', transition: '0.2s' };

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#059669', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🛍️ TetraShop</Link>

        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', display: 'none' }} className="hamburger">☰</button>

        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/products" style={linkStyle}>محصولات</Link>
          <Link href="/digital-products" style={linkStyle}>دیجیتال</Link>
          <Link href="/wallet" style={{...linkStyle, color:'#fbbf24'}}>💎 کیف پول ({walletBalance})</Link>
          <Link href="/blog" style={linkStyle}>📰 وبلاگ</Link>
          <Link href="/faq" style={linkStyle}>❓ سوالات</Link>
          <Link href="/search" style={linkStyle}>🔍 جستجو</Link>
          <Link href="/contact" style={linkStyle}>تماس</Link>
          <Link href="/about" style={linkStyle}>درباره</Link>
          {loggedIn ? (
            <>
              {(role === 'admin' || role === 'manager') && (
                <Link href="/admin/dashboard" style={{...linkStyle, background:'#fbbf24', color:'#1f2937'}}>پنل مدیریت</Link>
              )}
              <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); setLoggedIn(false); }} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer' }}>خروج</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{...linkStyle, background:'#2563eb'}}>ورود</Link>
              <Link href="/register" style={{...linkStyle, background:'#f59e0b', color:'#1f2937'}}>ثبت‌نام</Link>
            </>
          )}
        </nav>
      </header>

      {menuOpen && (
        <div style={{ background: '#047857', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* همان لینک‌ها برای موبایل */}
        </div>
      )}

      <main style={{ flex: 1 }}>{children}</main>

      <footer style={{ background: '#1f2937', color: '#e5e7eb', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>دسترسی سریع</h4>
            <Link href="/products" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>محصولات</Link>
            <Link href="/wallet" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>کیف پول</Link>
            <Link href="/blog" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>وبلاگ</Link>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>پشتیبانی</h4>
            <Link href="/contact" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>تماس با ما</Link>
            <Link href="/faq" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>سوالات</Link>
            <Link href="/login" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>ورود</Link>
            <Link href="/register" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>ثبت‌نام</Link>
          </div>
        </div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>© ۱۴۰۵ TetraShop | توسعه‌دهنده: رامین اجلال</p>
      </footer>
      <SupportWidget />
    </div>
  );
}
