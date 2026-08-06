import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function Dashboard() {
  useAuth();

  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAll = () => {
      fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
      fetch('/api/errors').then(r => r.json()).then(d => setErrors(d.errors || [])).catch(() => {});
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

      {/* کارت‌های خلاصه */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>وضعیت سرور</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: status?.status === 'online' ? '#059669' : '#dc2626' }}>{status ? status.status : '...'}</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>خطاهای فعال</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: errors.some(e => e.status === 'active') ? '#dc2626' : '#059669' }}>{errors.filter(e => e.status === 'active').length}</div>
        </div>
      </div>

      {/* خطاها */}
      <section style={{ marginBottom: 30 }}>
        <h2>⚠️ خطاهای اخیر</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f9fafb' }}><th style={{ padding: 12 }}>نوع</th><th style={{ padding: 12 }}>پیام</th><th style={{ padding: 12 }}>وضعیت</th><th style={{ padding: 12 }}>عملیات</th></tr></thead>
            <tbody>
              {errors.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 10 }}><span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: 12 }}>{e.type}</span></td>
                  <td style={{ padding: 10 }}>{e.message}</td>
                  <td style={{ padding: 10 }}><span style={{ background: e.status === 'active' ? '#fee2e2' : '#d1fae5', color: e.status === 'active' ? '#dc2626' : '#059669', padding: '2px 8px', borderRadius: 12 }}>{e.status === 'active' ? 'فعال' : 'رفع‌شده'}</span></td>
                  <td style={{ padding: 10 }}>{e.status === 'active' && <button onClick={() => resolveError(e.id)} style={{ padding: '4px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>رفع</button>}</td>
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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f9fafb' }}><th style={{ padding: 12 }}>تصویر</th><th style={{ padding: 12 }}>نام</th><th style={{ padding: 12 }}>قیمت</th><th style={{ padding: 12 }}>عملیات</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 10 }}><img src={p.image} alt={p.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} /></td>
                  <td style={{ padding: 10 }}>{p.name}</td>
                  <td style={{ padding: 10 }}>{p.price.toLocaleString()} تومان</td>
                  <td style={{ padding: 10 }}>
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
