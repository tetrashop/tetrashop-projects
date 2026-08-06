import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState('...');

  useEffect(() => {
    fetch('/api/wallet/balance')
      .then(r => r.json())
      .then(d => {
        const irr = d.wallets?.find(w => w.currency === 'IRR');
        if (irr) setWalletBalance(irr.balance + ' ' + irr.symbol);
      })
      .catch(() => setWalletBalance('خطا'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: '📊 داشبورد' },
    { href: '/admin/wallet', label: '💎 کیف پول' },
    { href: '/', label: '🏠 فروشگاه' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Tahoma, sans-serif' }}>
      <aside style={{ width: 260, background: '#1e293b', color: 'white', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#22c55e', marginBottom: 30, textAlign: 'center' }}>🛡️ پنل مدیریت</h2>
        
        <div style={{ background: '#0f172a', borderRadius: 12, padding: 12, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>موجودی کیف پول</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#22c55e' }}>{walletBalance}</div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} style={{ color: 'white', textDecoration: 'none', padding: '10px 12px', borderRadius: 8, background: router.pathname === item.href ? '#334155' : 'transparent', transition: 'background 0.2s' }}>
              {item.label}
            </a>
          ))}
        </nav>

        <button onClick={logout} style={{ padding: 10, background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
          🚪 خروج
        </button>
      </aside>
      <main style={{ flex: 1, padding: 30, background: '#f5f5f5', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
