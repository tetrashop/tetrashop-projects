import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/status')
        .then(r => r.json())
        .then(data => { setStatus(data); setError(false); })
        .catch(() => setError(true));
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* هدر */}
      <header style={{ background: '#059669', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🛍️ TetraShop</a>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="/digital-products" style={{ color: 'white', textDecoration: 'none' }}>محصولات دیجیتال</a>
          <a href="/status.html" style={{ color: '#fbbf24', textDecoration: 'none' }}>📊 لاگ زنده</a>
          <a href="/dashboard.html" style={{ color: 'white', textDecoration: 'none' }}>پنل مدیریت</a>
        </nav>
      </header>

      {/* محتوای اصلی */}
      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>داشبورد فروشگاه</h1>
        
        {/* کارت‌های وضعیت */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>⚡</div>
            <h3>وضعیت سرور</h3>
            {error ? (
              <p style={{ color: '#dc2626' }}>قطع</p>
            ) : status ? (
              <p style={{ color: '#059669', fontWeight: 'bold' }}>{status.status}</p>
            ) : (
              <p>در حال دریافت...</p>
            )}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>⏱️</div>
            <h3>آپتایم</h3>
            {status ? <p style={{ fontWeight: 'bold', color: '#2563eb' }}>{Math.floor(status.uptime)} ثانیه</p> : <p>...</p>}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>💾</div>
            <h3>حافظه</h3>
            {status ? <p style={{ fontWeight: 'bold', color: '#7c3aed' }}>{status.memory} MB</p> : <p>...</p>}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>🕒</div>
            <h3>زمان سرور</h3>
            {status ? <p style={{ fontWeight: 'bold' }}>{new Date(status.time).toLocaleTimeString('fa-IR')}</p> : <p>...</p>}
          </div>
        </div>

        {/* لینک‌های سریع */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>دسترسی سریع</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="/digital-products" style={{ background: '#2563eb', color: 'white', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none' }}>محصولات دیجیتال</a>
            <a href="/demos/bot.html" style={{ background: '#059669', color: 'white', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none' }}>دمو ربات</a>
            <a href="/demos/chess.html" style={{ background: '#7c3aed', color: 'white', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none' }}>دمو شطرنج</a>
            <a href="/dashboard.html" style={{ background: '#dc2626', color: 'white', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none' }}>پنل مدیریت</a>
          </div>
        </div>
      </main>

      {/* فوتر */}
      <footer style={{ background: '#1f2937', color: 'white', textAlign: 'center', padding: '1rem' }}>
        <p>تمامی حقوق محفوظ است © ۱۴۰۵ TetraShop | توسعه‌دهنده: رامین اجلال</p>
      </footer>
    </div>
  );
}
