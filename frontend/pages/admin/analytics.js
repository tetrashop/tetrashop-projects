import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function Analytics() {
  useAuth();
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/analytics').then(r => r.json()).then(setData).catch(()=>{}); }, []);
  return (
    <AdminLayout>
      <h1>📈 آنالیتیکس</h1>
      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15, marginBottom: 30 }}>
            <div style={card}><div style={label}>بازدید</div><div style={val}>{data.pageViews}</div></div>
            <div style={card}><div style={label}>کاربران یکتا</div><div style={val}>{data.uniqueVisitors}</div></div>
            <div style={card}><div style={label}>نرخ پرش</div><div style={val}>{data.bounceRate}</div></div>
            <div style={card}><div style={label}>میانگین مدت</div><div style={val}>{data.avgSessionDuration}</div></div>
          </div>
          <h3>صفحات پر بازدید</h3>
          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f9fafb' }}><th style={th}>صفحه</th><th style={th}>بازدید</th></tr></thead>
              <tbody>{data.topPages.map((p,i) => (<tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}><td style={td}>{p.path}</td><td style={td}>{p.views}</td></tr>))}</tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 20 }}>نمودار بازدید هفتگی</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 150, background: 'white', borderRadius: 12, padding: 20 }}>
            {data.chartData.map((val, i) => (
              <div key={i} style={{ flex: 1, background: '#059669', borderRadius: '4px 4px 0 0', height: (val / 800 * 100) + '%' }} title={`روز ${i+1}`} />
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
const card = { background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const label = { color: '#6b7280', fontSize: 14 };
const val = { fontSize: 24, fontWeight: 'bold', color: '#059669', marginTop: 8 };
const th = { padding: '12px 16px', textAlign: 'right', fontWeight: 'bold' };
const td = { padding: '10px 16px' };
