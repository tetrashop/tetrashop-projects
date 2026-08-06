import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Tahoma, sans-serif' }}>
      {/* سایدبار */}
      <aside style={{ width: '260px', background: '#1e293b', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#22c55e', marginBottom: '2rem', textAlign: 'center' }}>🛡️ پنل مدیریت</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <a href="/admin/dashboard" style={linkStyle}>📊 داشبورد</a>
          <a href="/admin/dashboard#errors" style={linkStyle}>⚠️ خطاها</a>
          <a href="/admin/dashboard#olympic" style={linkStyle}>🏅 المپیک</a>
          <a href="/admin/dashboard#finance" style={linkStyle}>💰 مالی</a>
          <a href="/admin/dashboard#products" style={linkStyle}>📦 محصولات</a>
          <a href="/" style={linkStyle}>🏠 فروشگاه</a>
          <button onClick={logout} style={{ ...linkStyle, background: '#dc2626', border: 'none', cursor: 'pointer', textAlign: 'right' }}>🚪 خروج</button>
        </nav>
      </aside>

      {/* محتوای اصلی */}
      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  transition: 'background 0.2s',
  display: 'block',
};
