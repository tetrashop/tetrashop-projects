import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import { verifyToken } from '../../src/utils/auth';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const [olympic, setOlympic] = useState(null);
  const [finance, setFinance] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // وضعیت سرور
    fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
    const statusInterval = setInterval(() => fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {}), 5000);

    // خطاها
    fetch('/api/errors').then(r => r.json()).then(d => setErrors(d.errors || [])).catch(() => {});
    const errorsInterval = setInterval(() => fetch('/api/errors').then(r => r.json()).then(d => setErrors(d.errors || [])).catch(() => {}), 10000);

    // المپیک
    fetch('/api/olympic').then(r => r.json()).then(setOlympic).catch(() => {});
    const olympicInterval = setInterval(() => fetch('/api/olympic').then(r => r.json()).then(setOlympic).catch(() => {}), 10000);

    // مالی
    fetch('/api/finance').then(r => r.json()).then(setFinance).catch(() => {});
    const financeInterval = setInterval(() => fetch('/api/finance').then(r => r.json()).then(setFinance).catch(() => {}), 10000);

    // محصولات (فعلاً از داده‌های استاتیک استفاده می‌کنیم)
    import('../../src/data/products').then(m => setProducts(m.fakeProducts)).catch(() => {});

    return () => {
      clearInterval(statusInterval);
      clearInterval(errorsInterval);
      clearInterval(olympicInterval);
      clearInterval(financeInterval);
    };
  }, []);

  const resolveError = async (id) => {
    await fetch('/api/errors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setErrors(prev => prev.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
  };

  return (
    <AdminLayout>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>📊 داشبورد مدیریت</h1>

      {/* بخش وضعیت سرور */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>⚡ وضعیت سرور</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'وضعیت', value: status ? status.status : '...', color: status?.status === 'online' ? '#059669' : '#dc2626' },
            { label: 'آپتایم', value: status ? Math.floor(status.uptime) + 's' : '...' },
            { label: 'حافظه', value: status ? status.memory + ' MB' : '...' },
            { label: 'زمان سرور', value: status ? new Date(status.time).toLocaleTimeString('fa-IR') : '...' },
          ].map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{card.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: card.color || '#333' }}>{card.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* بخش خطاها */}
      <section id="errors" style={{ marginBottom: '2rem' }}>
        <h2>⚠️ خطاهای اخیر</h2>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={thStyle}>نوع</th>
                <th style={thStyle}>پیام</th>
                <th style={thStyle}>سرویس</th>
                <th style={thStyle}>وضعیت</th>
                <th style={thStyle}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {errors.map(err => (
                <tr key={err.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={tdStyle}><span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{err.type}</span></td>
                  <td style={tdStyle}>{err.message}</td>
                  <td style={tdStyle}>{err.service}</td>
                  <td style={tdStyle}><span style={{ background: err.status === 'active' ? '#fee2e2' : '#d1fae5', color: err.status === 'active' ? '#dc2626' : '#059669', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{err.status === 'active' ? 'فعال' : 'رفع‌شده'}</span></td>
                  <td style={tdStyle}>
                    {err.status === 'active' && (
                      <button onClick={() => resolveError(err.id)} style={{ padding: '4px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>رفع</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* بخش المپیک */}
      <section id="olympic" style={{ marginBottom: '2rem' }}>
        <h2>🏅 المپیک</h2>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem', overflow: 'auto' }}>
          {olympic ? (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                    <th style={thStyle}>رویداد</th>
                    <th style={thStyle}>وضعیت</th>
                    <th style={thStyle}>نتیجه</th>
                    <th style={thStyle}>زمان</th>
                  </tr>
                </thead>
                <tbody>
                  {olympic.events.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={tdStyle}>{e.name}</td>
                      <td style={tdStyle}><span style={{ background: e.status === 'live' ? '#dcfce7' : e.status === 'upcoming' ? '#fef3c7' : '#f3f4f6', color: e.status === 'live' ? '#059669' : e.status === 'upcoming' ? '#92400e' : '#6b7280', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{e.status === 'live' ? 'زنده' : e.status === 'upcoming' ? 'پیش‌رو' : 'پایان‌یافته'}</span></td>
                      <td style={tdStyle}>{e.score1 !== undefined ? `${e.score1} - ${e.score2}` : '-'}</td>
                      <td style={tdStyle}>{e.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>جدول مدال‌ها</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                    <th style={thStyle}>کشور</th>
                    <th style={thStyle}>🥇 طلا</th>
                    <th style={thStyle}>🥈 نقره</th>
                    <th style={thStyle}>🥉 برنز</th>
                    <th style={thStyle}>کل</th>
                  </tr>
                </thead>
                <tbody>
                  {olympic.medals.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={tdStyle}>{m.country}</td>
                      <td style={tdStyle}>{m.gold}</td>
                      <td style={tdStyle}>{m.silver}</td>
                      <td style={tdStyle}>{m.bronze}</td>
                      <td style={tdStyle}><strong>{m.gold + m.silver + m.bronze}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : <p>در حال بارگذاری...</p>}
        </div>
      </section>

      {/* بخش مالی */}
      <section id="finance" style={{ marginBottom: '2rem' }}>
        <h2>💰 داشبورد مالی</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {finance ? (
            <>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>موجودی</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#059669' }}>{finance.balance} ریال</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>معاملات امروز</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2563eb' }}>{finance.transactions}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>درآمد ماهانه</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#7c3aed' }}>{finance.revenue} ریال</div>
              </div>
            </>
          ) : <p>در حال بارگذاری...</p>}
        </div>
      </section>

      {/* بخش محصولات */}
      <section id="products" style={{ marginBottom: '2rem' }}>
        <h2>📦 مدیریت محصولات</h2>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={thStyle}>تصویر</th>
                <th style={thStyle}>نام</th>
                <th style={thStyle}>دسته‌بندی</th>
                <th style={thStyle}>قیمت</th>
                <th style={thStyle}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={tdStyle}><img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} /></td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.category}</td>
                  <td style={tdStyle}>{p.price.toLocaleString()} تومان</td>
                  <td style={tdStyle}>
                    <button style={{ padding: '4px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '4px' }}>ویرایش</button>
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

const thStyle = { padding: '12px 16px', fontSize: '0.85rem', fontWeight: 'bold', color: '#4b5563' };
const tdStyle = { padding: '10px 16px' };

export async function getServerSideProps({ req }) {
  // احراز هویت ساده – در محیط واقعی توکن را از کوکی یا هدر بررسی کنید
  const token = req.cookies?.token;
  if (!token) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  // می‌توانید اعتبارسنجی بیشتری انجام دهید
  return { props: {} };
}
