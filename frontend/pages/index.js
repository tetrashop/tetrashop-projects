import { useState, useEffect } from 'react';
export default function Home() {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
    const interval = setInterval(() => fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {}), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem' }}>به فروشگاه TetraShop خوش آمدید</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>محصولات فیزیکی و دیجیتال</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/products" style={{ background: 'white', color: '#059669', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>محصولات فیزیکی</a>
          <a href="/digital-products" style={{ background: '#fbbf24', color: '#1f2937', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>محصولات دیجیتال</a>
        </div>
      </section>

      <section style={{ padding: '2rem', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center' }}>وضعیت سرور</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '⚡', label: 'وضعیت', value: status ? status.status : '...', color: status?.status === 'online' ? '#059669' : '#dc2626' },
            { icon: '⏱️', label: 'آپتایم', value: status ? Math.floor(status.uptime) + 's' : '...' },
            { icon: '💾', label: 'حافظه', value: status ? status.memory + ' MB' : '...' },
            { icon: '🕒', label: 'زمان', value: status ? new Date(status.time).toLocaleTimeString('fa-IR') : '...' },
          ].map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '2rem' }}>{card.icon}</div>
              <h3 style={{ fontSize: '0.9rem', color: '#6b7280' }}>{card.label}</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: card.color || '#333' }}>{card.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
