import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: '📊 داشبورد', icon: '📊' },
    { href: '/admin/wallet', label: '💎 کیف پول', icon: '💎' },
    { href: '/admin/dashboard#errors', label: '⚠️ خطاها', icon: '⚠️' },
    { href: '/admin/dashboard#olympic', label: '🏅 المپیک', icon: '🏅' },
    { href: '/admin/dashboard#finance', label: '💰 مالی', icon: '💰' },
    { href: '/admin/dashboard#products', label: '📦 محصولات', icon: '📦' },
    { href: '/', label: '🏠 فروشگاه', icon: '🏠' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Tahoma, sans-serif' }}>
      <aside style={{ width: '260px', background: '#1e293b', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#22c55e', marginBottom: '2rem', textAlign: 'center' }}>🛡️ پنل مدیریت</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} style={{ color: 'white', textDecoration: 'none', padding: '0.7rem 1rem', borderRadius: '8px', background: router.pathname === item.href ? '#334155' : 'transparent', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.icon} {item.label}
            </a>
          ))}
          <button onClick={logout} style={{ marginTop: '1rem', padding: '0.7rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'right', fontWeight: 'bold' }}>🚪 خروج</button>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
