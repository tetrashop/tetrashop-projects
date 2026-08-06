import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [wallet, setWallet] = useState('...');

  useEffect(() => {
    fetch('/api/wallet/balance').then(r => r.json()).then(d => {
      const irr = d.wallets?.find(w => w.currency === 'IRR');
      if(irr) setWallet(irr.balance + ' ' + irr.symbol);
    }).catch(() => {});
  }, []);

  const logout = () => { localStorage.removeItem('token'); router.push('/admin/login'); };

  const navItems = [
    { href: '/admin/dashboard', label: '📊 داشبورد' },
    { href: '/admin/products', label: '📦 محصولات' },
    { href: '/admin/wallet', label: '💎 کیف پول' },
    { href: '/admin/orders', label: '📋 سفارشات' },
    { href: '/admin/users', label: '👥 کاربران' },
    { href: '/admin/settings', label: '⚙️ تنظیمات' },
    { href: '/', label: '🏠 فروشگاه' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Tahoma' }}>
      <aside style={{ width: 260, background: '#1e293b', color: 'white', padding: 20 }}>
        <h2 style={{ color: '#22c55e', marginBottom: 20, textAlign: 'center' }}>🛡️ پنل مدیریت</h2>
        <div style={{ background: '#0f172a', borderRadius: 12, padding: 12, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>موجودی کیف پول</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#22c55e' }}>{wallet}</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} style={{
              color: 'white', textDecoration: 'none', padding: '10px 12px', borderRadius: 8,
              background: router.pathname === item.href ? '#334155' : 'transparent', transition: '0.2s'
            }}>
              {item.label}
            </a>
          ))}
          <button onClick={logout} style={{ marginTop: 20, padding: 10, background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
            🚪 خروج
          </button>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 30, background: '#f5f5f5', overflowY: 'auto' }}>{children}</main>
    </div>
  );
}
