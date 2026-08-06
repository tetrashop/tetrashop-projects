export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#059669', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🛍️ TetraShop</a>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/products" style={{ color: 'white', textDecoration: 'none' }}>محصولات</a>
          <a href="/digital-products" style={{ color: 'white', textDecoration: 'none' }}>محصولات دیجیتال</a>
          <a href="/search" style={{ color: 'white', textDecoration: 'none' }}>🔍 جستجو</a>
          <a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>تماس با ما</a>
          <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>درباره ما</a>
          <a href="/dashboard.html" style={{ color: '#fbbf24', textDecoration: 'none' }}>پنل مدیریت</a>
        </nav>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer style={{ background: '#1f2937', color: '#e5e7eb', padding: '2rem', textAlign: 'center' }}>
        <p>© ۱۴۰۵ TetraShop | توسعه‌دهنده: رامین اجلال</p>
      </footer>
    </div>
  );
}
