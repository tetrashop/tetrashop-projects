import { useRouter } from 'next/router';
export default function AdminLayout({ children }) {
  const router = useRouter();
  const logout = () => { localStorage.removeItem('token'); router.push('/admin/login'); };
  const nav = [
    { href: '/admin/dashboard', label: '📊 داشبورد' },
    { href: '/admin/wallet', label: '💎 کیف پول' },
    { href: '/', label: '🏠 فروشگاه' },
  ];
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Tahoma' }}>
      <aside style={{ width: 240, background: '#1e293b', color: 'white', padding: '1.5rem' }}>
        <h2 style={{ color: '#22c55e', marginBottom: 20 }}>🛡️ پنل مدیریت</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {nav.map(item => (
            <a key={item.href} href={item.href} style={{ color: 'white', textDecoration: 'none', padding: '10px 12px', borderRadius: 8, background: router.pathname === item.href ? '#334155' : 'transparent' }}>{item.label}</a>
          ))}
          <button onClick={logout} style={{ marginTop: 20, padding: 10, background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>🚪 خروج</button>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5', overflowY: 'auto' }}>{children}</main>
    </div>
  );
}
