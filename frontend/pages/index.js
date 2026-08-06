import Layout from '../src/components/Layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [status, setStatus] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
    fetch('/api/blog').then(r => r.json()).then(setBlogPosts).catch(() => {});
    const int = setInterval(() => fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {}), 5000);
    return () => clearInterval(int);
  }, []);

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem' }}>به فروشگاه TetraShop خوش آمدید</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>محصولات فیزیکی و دیجیتال</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/products" style={{ background: 'white', color: '#059669', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>محصولات فیزیکی</Link>
          <Link href="/digital-products" style={{ background: '#fbbf24', color: '#1f2937', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>محصولات دیجیتال</Link>
        </div>
      </section>

      <section style={{ padding: '2rem', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>وضعیت سرور</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '⚡', label: 'وضعیت', value: status ? status.status : '...', color: status?.status === 'online' ? '#059669' : '#dc2626' },
            { icon: '⏱️', label: 'آپتایم', value: status ? Math.floor(status.uptime) + 's' : '...', color: '#2563eb' },
            { icon: '💾', label: 'حافظه', value: status ? status.memory + ' MB' : '...', color: '#7c3aed' },
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
            <Link key={i} href={m.href} style={{ background: m.color, color: 'white', padding: '0.8rem 1.5rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {m.icon} {m.name}
            </Link>
          ))}
        </div>
      </section>

      {/* آخرین مطالب وبلاگ */}
      <section style={{ padding: '2rem', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📰 آخرین مقالات</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          {blogPosts.slice(0, 3).map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>{post.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 8 }}>{post.excerpt}</p>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
