import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = () => fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem' }}>به فروشگاه TetraShop خوش آمدید</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>محصولات فیزیکی و دیجیتال با بهترین کیفیت</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/products" style={{ background: 'white', color: '#059669', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>محصولات فیزیکی</a>
          <a href="/digital-products" style={{ background: '#fbbf24', color: '#1f2937', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>محصولات دیجیتال</a>
        </div>
      </section>

      <section style={{ padding: '2rem', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>وضعیت سرور</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '⚡', label: 'وضعیت', value: status ? status.status : '...', color: status?.status === 'online' ? '#059669' : '#dc2626' },
            { icon: '⏱️', label: 'آپتایم', value: status ? Math.floor(status.uptime) + 's' : '...', color: '#2563eb' },
            { icon: '💾', label: 'حافظه', value: status ? status.memory + ' MB' : '...', color: '#7c3aed' },
            { icon: '🕒', label: 'زمان', value: status ? new Date(status.time).toLocaleTimeString('fa-IR') : '...', color: '#333' },
          ].map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '2rem' }}>{card.icon}</div>
              <h3 style={{ fontSize: '0.9rem', color: '#6b7280' }}>{card.label}</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: card.color || '#333' }}>{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>ماژول‌های دیجیتال</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { name: 'ربات بله', icon: '🤖', color: '#059669', href: '/demos/bot.html' },
            { name: 'شطرنج', icon: '♟️', color: '#7c3aed', href: '/demos/chess.html' },
            { name: 'تحلیل احساسات', icon: '🧠', color: '#2563eb', href: '/demos/ai.html' },
            { name: 'داشبورد مالی', icon: '📈', color: '#dc2626', href: '/demos/finance.html' },
            { name: 'سیستم خطا', icon: '⚠️', color: '#f59e0b', href: '/demos/error-system.html' },
            { name: 'المپیک', icon: '🏅', color: '#8b5cf6', href: '/demos/olympic.html' },
          ].map((m, i) => (
            <a key={i} href={m.href} style={{ background: m.color, color: 'white', padding: '0.8rem 1.5rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {m.icon} {m.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
