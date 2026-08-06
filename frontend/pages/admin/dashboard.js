import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function Dashboard() {
  useAuth();

  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const [olympic, setOlympic] = useState(null);
  const [finance, setFinance] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
      fetch('/api/errors').then(r => r.json()).then(d => setErrors(d.errors || [])).catch(() => {});
      fetch('/api/olympic').then(r => r.json()).then(setOlympic).catch(() => {});
      fetch('/api/finance').then(r => r.json()).then(setFinance).catch(() => {});
      import('../../src/data/products').then(m => setProducts(m.fakeProducts)).catch(() => {});
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const resolveError = async (id) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setErrors(prev => prev.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
    } catch (e) {}
  };

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>📊 داشبورد مدیریت</h1>

      {/* کارت‌های وضعیت */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>وضعیت سرور</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: status?.status === 'online' ? '#059669' : '#dc2626' }}>
            {status ? status.status : '...'}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>خطاهای فعال</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: errors.filter(e => e.status === 'active').length > 0 ? '#dc2626' : '#059669' }}>
            {errors.filter(e => e.status === 'active').length}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>درآمد ماهانه</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
            {finance ? finance.revenue + ' ریال' : '...'}
          </div>
        </div>
      </div>

      {/* بخش خطاها */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>⚠️ خطاهای اخیر</h2>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={{ padding: '12px 16px' }}>نوع</th>
                <th style={{ padding: '12px 16px' }}>پیام</th>
                <th style={{ padding: '12px 16px' }}>سرویس</th>
                <th style={{ padding: '12px 16px' }}>وضعیت</th>
                <th style={{ padding: '12px 16px' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {errors.map(err => (
                <tr key={err.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{err.type}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>{err.message}</td>
                  <td style={{ padding: '10px 16px' }}>{err.service}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: err.status === 'active' ? '#fee2e2' : '#d1fae5', color: err.status === 'active' ? '#dc2626' : '#059669', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                      {err.status === 'active' ? 'فعال' : 'رفع‌شده'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    {err.status === 'active' && (
                      <button onClick={() => resolveError(err.id)} style={{ padding: '4px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        رفع
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* بخش المپیک */}
      {olympic && (
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>🏅 المپیک</h2>
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                  <th style={{ padding: '10px' }}>رویداد</th>
                  <th style={{ padding: '10px' }}>وضعیت</th>
                  <th style={{ padding: '10px' }}>نتیجه</th>
                </tr>
              </thead>
              <tbody>
                {olympic.events.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px' }}>{e.name}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', background: e.status === 'live' ? '#dcfce7' : e.status === 'upcoming' ? '#fef3c7' : '#f3f4f6', color: e.status === 'live' ? '#059669' : '#92400e' }}>
                        {e.status === 'live' ? 'زنده' : e.status === 'upcoming' ? 'پیش‌رو' : 'پایان‌یافته'}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{e.score1 !== undefined ? `${e.score1} - ${e.score2}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* بخش محصولات */}
      <section>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📦 مدیریت محصولات</h2>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={{ padding: '12px 16px' }}>تصویر</th>
                <th style={{ padding: '12px 16px' }}>نام</th>
                <th style={{ padding: '12px 16px' }}>دسته‌بندی</th>
                <th style={{ padding: '12px 16px' }}>قیمت</th>
                <th style={{ padding: '12px 16px' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                  </td>
                  <td style={{ padding: '10px 16px' }}>{p.name}</td>
                  <td style={{ padding: '10px 16px' }}>{p.category}</td>
                  <td style={{ padding: '10px 16px' }}>{p.price.toLocaleString()} تومان</td>
                  <td style={{ padding: '10px 16px' }}>
                    <button style={{ padding: '4px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '4px' }}>ویرایش</button>
                    <button style={{ padding: '4px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>حذف</button>
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

export async function getServerSideProps({ req }) {
  // در محیط واقعی توکن را از کوکی بخوانید
  const token = req.cookies?.token;
  if (!token) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
