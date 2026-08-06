import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const [olympic, setOlympic] = useState(null);
  const [finance, setFinance] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAll = () => {
      fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
      fetch('/api/errors').then(r => r.json()).then(d => setErrors(d.errors || [])).catch(() => {});
      fetch('/api/olympic').then(r => r.json()).then(setOlympic).catch(() => {});
      fetch('/api/finance').then(r => r.json()).then(setFinance).catch(() => {});
      fetch('/api/wallet/balance').then(r => r.json()).then(d => setWallet(d.wallets?.[0])).catch(() => {});
      import('../../src/data/products').then(m => setProducts(m.fakeProducts)).catch(() => {});
    };
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const resolveError = async (id) => {
    await fetch('/api/errors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setErrors(prev => prev.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
  };

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 20 }}>📊 داشبورد مدیریت</h1>

      {/* کارت‌های وضعیت */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
        {[
          { label: 'وضعیت سرور', value: status ? status.status : '...', color: status?.status === 'online' ? '#059669' : '#dc2626' },
          { label: 'موجودی کیف پول', value: wallet ? wallet.balance + ' ' + (wallet.symbol || '') : '...', color: '#059669' },
          { label: 'خطاهای فعال', value: errors.filter(e => e.status === 'active').length + ' عدد', color: errors.some(e => e.status === 'active') ? '#dc2626' : '#059669' },
          { label: 'درآمد ماهانه', value: finance ? finance.revenue + ' ریال' : '...', color: '#7c3aed' },
        ].map((card, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{card.label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* خطاها */}
      <section style={{ marginBottom: 30 }}>
        <h2>⚠️ خطاهای اخیر</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: '#f9fafb' }}><th style={th}>نوع</th><th style={th}>پیام</th><th style={th}>سرویس</th><th style={th}>وضعیت</th><th style={th}>عملیات</th></tr></thead>
            <tbody>
              {errors.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={td}><span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: 12 }}>{e.type}</span></td>
                  <td style={td}>{e.message}</td>
                  <td style={td}>{e.service}</td>
                  <td style={td}><span style={{ background: e.status === 'active' ? '#fee2e2' : '#d1fae5', color: e.status === 'active' ? '#dc2626' : '#059669', padding: '2px 8px', borderRadius: 12 }}>{e.status === 'active' ? 'فعال' : 'رفع‌شده'}</span></td>
                  <td style={td}>{e.status === 'active' && <button onClick={() => resolveError(e.id)} style={{ padding: '4px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>رفع</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* محصولات */}
      <section>
        <h2>📦 محصولات</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: '#f9fafb' }}><th style={th}>تصویر</th><th style={th}>نام</th><th style={th}>قیمت</th><th style={th}>عملیات</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={td}><img src={p.image} alt={p.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} /></td>
                  <td style={td}>{p.name}</td>
                  <td style={td}>{p.price.toLocaleString()} تومان</td>
                  <td style={td}>
                    <button style={{ padding: '4px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, marginRight: 4 }}>ویرایش</button>
                    <button style={{ padding: '4px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6 }}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

const th = { padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#4b5563' };
const td = { padding: '10px 16px' };

export async function getServerSideProps({ req }) {
  if (!req.cookies?.token) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
