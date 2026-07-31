import { useState } from 'react';

const initialErrors = [
  { id: 1, type: 'API', message: 'Connection timeout to payment gateway', status: 'active', time: '۲ ساعت پیش' },
  { id: 2, type: 'UI', message: 'Hydration mismatch in ProductCard', status: 'resolved', time: 'دیروز' },
  { id: 3, type: 'Webhook', message: '503 from Bale API', status: 'active', time: '۳۰ دقیقه پیش' },
  { id: 4, type: 'Database', message: 'MongoDB connection refused', status: 'pending', time: '۱ ساعت پیش' },
];

export default function ErrorDashboard() {
  const [errors, setErrors] = useState(initialErrors);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? errors : errors.filter(e => e.status === filter);

  const resolveError = (id: number) => {
    setErrors(errors.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
  };

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ color: '#dc2626', textAlign: 'center' }}>⚠️ TetraShop Error System</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>پنل مدیریت و پایش خطاهای سیستم</p>

      <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
        {['all', 'active', 'resolved', 'pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '8px 16px', background: filter === f ? '#dc2626' : '#eee', color: filter === f ? 'white' : '#333', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            {f === 'all' ? 'همه' : f === 'active' ? 'فعال' : f === 'resolved' ? 'رفع‌شده' : 'در انتظار'}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {filtered.map(e => (
          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #eee' }}>
            <div>
              <strong style={{ color: e.status === 'active' ? '#dc2626' : '#16a34a' }}>[{e.type}]</strong> {e.message}
              <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{e.time}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: e.status === 'active' ? '#fee2e2' : e.status === 'resolved' ? '#dcfce7' : '#fef9c3', color: e.status === 'active' ? '#dc2626' : e.status === 'resolved' ? '#16a34a' : '#ca8a04' }}>
                {e.status === 'active' ? 'فعال' : e.status === 'resolved' ? 'رفع‌شده' : 'در انتظار'}
              </span>
              {e.status !== 'resolved' && (
                <button onClick={() => resolveError(e.id)} style={{ padding: '6px 12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>رفع</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30, textAlign: 'center', color: '#999', fontSize: 14 }}>
        متصل به فروشگاه اصلی | <a href="https://tetrashop-projects-seven.vercel.app" style={{ color: '#2563eb' }}>TetraShop</a>
      </div>
    </div>
  );
}
