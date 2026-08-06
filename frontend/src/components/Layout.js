import { useState, useEffect } from 'react';
import Link from 'next/link';
import SupportWidget from './SupportWidget'; // ویجت پشتیبانی شناور

export default function Layout({ children }) {
  const [walletBalance, setWalletBalance] = useState('...');
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsEmail, setNewsEmail] = useState('');
  const [newsMsg, setNewsMsg] = useState('');

  useEffect(() => {
    fetch('/api/wallet/balance')
      .then(r => r.json())
      .then(d => { const irr = d.wallets?.find(w => w.currency === 'IRR'); if(irr) setWalletBalance(irr.balance + ' ' + irr.symbol); })
      .catch(() => {});
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newsEmail }) });
    const data = await res.json();
    setNewsMsg(data.message || data.error);
    setNewsEmail('');
  };

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
          <Link href="/compare" style={linkStyle}>📊 مقایسه</Link>
          <Link href="/wishlist" style={linkStyle}>❤️ علاقه‌مندی</Link>
          <Link href="/olympic" style={linkStyle}>🏅 المپیک</Link>
          <Link href="/errors" style={linkStyle}>⚠️ خطاها</Link>
          <Link href="/blog" style={linkStyle}>📰 وبلاگ</Link>
          <Link href="/faq" style={linkStyle}>❓ سوالات</Link>
          <Link href="/search" style={linkStyle}>🔍 جستجو</Link>
          <Link href="/status-page" style={linkStyle}>📊 وضعیت</Link>
          <Link href="/contact" style={linkStyle}>تماس</Link>
          <Link href="/about" style={linkStyle}>درباره</Link>
          <a href="/dashboard.html" style={linkStyle}>📊 داشبورد</a>
          <Link href="/admin/login" style={{...linkStyle, background:'#fbbf24', color:'#1f2937'}}>ورود مدیر</Link>
        </nav>
      </header>

      {menuOpen && (
        <div style={{ background: '#047857', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/products" style={linkStyle} onClick={()=>setMenuOpen(false)}>محصولات</Link>
          <Link href="/digital-products" style={linkStyle} onClick={()=>setMenuOpen(false)}>دیجیتال</Link>
          <Link href="/wallet" style={{...linkStyle, color:'#fbbf24'}} onClick={()=>setMenuOpen(false)}>💎 کیف پول</Link>
          <Link href="/compare" style={linkStyle} onClick={()=>setMenuOpen(false)}>📊 مقایسه</Link>
          <Link href="/wishlist" style={linkStyle} onClick={()=>setMenuOpen(false)}>❤️ علاقه‌مندی</Link>
          <Link href="/olympic" style={linkStyle} onClick={()=>setMenuOpen(false)}>🏅 المپیک</Link>
          <Link href="/errors" style={linkStyle} onClick={()=>setMenuOpen(false)}>⚠️ خطاها</Link>
          <Link href="/blog" style={linkStyle} onClick={()=>setMenuOpen(false)}>📰 وبلاگ</Link>
          <Link href="/faq" style={linkStyle} onClick={()=>setMenuOpen(false)}>❓ سوالات</Link>
          <Link href="/search" style={linkStyle} onClick={()=>setMenuOpen(false)}>🔍 جستجو</Link>
          <Link href="/status-page" style={linkStyle}>📊 وضعیت</Link>
          <Link href="/contact" style={linkStyle} onClick={()=>setMenuOpen(false)}>تماس</Link>
          <Link href="/about" style={linkStyle} onClick={()=>setMenuOpen(false)}>درباره</Link>
          <a href="/dashboard.html" style={linkStyle} onClick={()=>setMenuOpen(false)}>📊 داشبورد</a>
          <Link href="/admin/login" style={{...linkStyle, background:'#fbbf24', color:'#1f2937'}} onClick={()=>setMenuOpen(false)}>ورود مدیر</Link>
        </div>
      )}

      <main style={{ flex: 1 }}>{children}</main>

      <footer style={{ background: '#1f2937', color: '#e5e7eb', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>دسترسی سریع</h4>
            <Link href="/products" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>محصولات فیزیکی</Link>
            <Link href="/digital-products" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>محصولات دیجیتال</Link>
            <Link href="/wallet" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>کیف پول</Link>
            <Link href="/blog" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>وبلاگ</Link>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>پشتیبانی</h4>
          <Link href="/status-page" style={linkStyle}>📊 وضعیت</Link>
            <Link href="/contact" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>تماس با ما</Link>
            <Link href="/about" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>درباره ما</Link>
            <Link href="/faq" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>سوالات متداول</Link>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>خبرنامه</h4>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input value={newsEmail} onChange={e => setNewsEmail(e.target.value)} placeholder="ایمیل خود را وارد کنید" style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', width: '150px' }} />
              <button type="submit" style={{ padding: '0.5rem 1rem', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>عضویت</button>
            </form>
            {newsMsg && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{newsMsg}</p>}
          </div>
        </div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>© ۱۴۰۵ TetraShop | توسعه‌دهنده: رامین اجلال</p>
      </footer>

      {/* ویجت پشتیبانی شناور */}
      <SupportWidget />
    </div>
  );
}
