import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function Dashboard() {
  useAuth();
  const [stats, setStats] = useState({ status: null, errors: [], users: [], products: [], orders: 0, revenue: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statusRes, errorsRes, usersRes, productsRes] = await Promise.all([
          fetch('/api/status'), fetch('/api/errors'), fetch('/api/users'), fetch('/api/orders')
        ]);
        const status = await statusRes.json();
        const errors = await errorsRes.json();
        const users = await usersRes.json();
        // شبیه‌سازی سفارشات
        const orders = { total: 48, pending: 5 };
        setStats(prev => ({ ...prev, status, errors: errors.errors || [], users: users || [], products: [], orders: orders.total, revenue: '12,500,000' }));
      } catch(e) {}
    };
    fetchAll();
    const interval = setInterval(fetchAll, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 20 }}>📊 داشبورد مدیریت</h1>
      
      {/* کارت‌های آماری */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
        <div style={cardStyle}><div style={labelStyle}>وضعیت سرور</div><div style={{...valueStyle, color: stats.status?.status === 'online' ? '#059669' : '#dc2626'}}>{stats.status?.status || '...'}</div></div>
        <div style={cardStyle}><div style={labelStyle}>کاربران</div><div style={{...valueStyle, color: '#2563eb'}}>{stats.users.length}</div></div>
        <div style={cardStyle}><div style={labelStyle}>سفارشات امروز</div><div style={{...valueStyle, color: '#7c3aed'}}>{stats.orders}</div></div>
        <div style={cardStyle}><div style={labelStyle}>درآمد (تومان)</div><div style={{...valueStyle, color: '#f59e0b'}}>{stats.revenue}</div></div>
        <div style={cardStyle}><div style={labelStyle}>خطاهای فعال</div><div style={{...valueStyle, color: stats.errors?.filter(e=>e.status==='active').length > 0 ? '#dc2626' : '#059669'}}>{stats.errors?.filter(e=>e.status==='active').length || 0}</div></div>
      </div>

      {/* جدول خطاها */}
      <section style={{ marginBottom: 30 }}>
        <h2>⚠️ خطاهای اخیر</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f9fafb' }}><th style={th}>نوع</th><th style={th}>پیام</th><th style={th}>وضعیت</th></tr></thead>
            <tbody>
              {stats.errors?.slice(0,5).map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={td}><span style={{ background:'#dbeafe', color:'#2563eb', padding:'2px 8px', borderRadius:12 }}>{e.type}</span></td>
                  <td style={td}>{e.message}</td>
                  <td style={td}><span style={{ background: e.status==='active'?'#fee2e2':'#d1fae5', color: e.status==='active'?'#dc2626':'#059669', padding:'2px 8px', borderRadius:12 }}>{e.status==='active'?'فعال':'رفع‌شده'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* نمودار فروش ساده (میله‌ای) */}
      <section>
        <h2>📈 فروش هفتگی</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: 20, display: 'flex', alignItems: 'flex-end', gap: 10, height: 150 }}>
          {[40, 70, 55, 90, 65, 80, 50].map((val, i) => (
            <div key={i} style={{ flex: 1, background: '#059669', borderRadius: '4px 4px 0 0', height: val + '%', transition: '0.3s' }} title={`روز ${i+1}`} />
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
const cardStyle = { background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const labelStyle = { color: '#6b7280', fontSize: 14 };
const valueStyle = { fontSize: 28, fontWeight: 'bold', marginTop: 8 };
const th = { padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#4b5563' };
const td = { padding: '10px 16px' };
