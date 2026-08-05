import { useState } from 'react';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* هدر */}
      <header style={{ background: '#059669', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🛍️ TetraShop</a>
        
        {/* منوی موبایل */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer' }} className="menu-btn">
          ☰
        </button>

        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/products" style={{ color: 'white', textDecoration: 'none' }}>محصولات</a>
          <a href="/digital-products" style={{ color: 'white', textDecoration: 'none' }}>محصولات دیجیتال</a>
          <a href="/search" style={{ color: 'white', textDecoration: 'none' }}>🔍 جستجو</a>
          <a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>تماس با ما</a>
          <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>درباره ما</a>
          <a href="/dashboard.html" style={{ color: '#fbbf24', textDecoration: 'none' }}>پنل مدیریت</a>
        </nav>
      </header>

      {/* محتوای اصلی */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* فوتر */}
      <footer style={{ background: '#1f2937', color: '#e5e7eb', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>دسترسی سریع</h4>
            <a href="/products" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>محصولات فیزیکی</a>
            <a href="/digital-products" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>محصولات دیجیتال</a>
            <a href="/search" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>جستجو</a>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>پشتیبانی</h4>
            <a href="/contact" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>تماس با ما</a>
            <a href="/about" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>درباره ما</a>
            <a href="/faq" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>سوالات متداول</a>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>ابزارها</h4>
            <a href="/status.html" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>لاگ زنده</a>
            <a href="/dashboard.html" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>پنل مدیریت</a>
            <a href="/sitemap.xml" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block' }}>نقشه سایت</a>
          </div>
        </div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>© ۱۴۰۵ TetraShop | توسعه‌دهنده: رامین اجلال</p>
      </footer>
    </div>
  );
}
