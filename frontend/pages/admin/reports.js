import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function AdminReports() {
  useAuth();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch('/api/reports/sales')
      .then(r => r.json())
      .then(setReport)
      .catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <h1>📈 گزارشات فروش</h1>
      {report && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15, marginBottom: 30 }}>
            <div style={card}><div style={label}>درآمد کل</div><div style={val}>{report.totalRevenue} تومان</div></div>
            <div style={card}><div style={label}>تعداد سفارشات</div><div style={val}>{report.orderCount}</div></div>
            <div style={card}><div style={label}>میانگین سبد</div><div style={val}>{report.averageOrderValue} تومان</div></div>
          </div>

          <h3>📊 فروش هفتگی</h3>
          <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'flex-end', gap: 10, height: 150 }}>
            {report.weeklySales.map((val, i) => (
              <div key={i} style={{ flex: 1, background: '#059669', borderRadius: '4px 4px 0 0', height: (val / 2500000 * 100) + '%' }} title={`${val} تومان`} />
            ))}
          </div>

          <h3>🏆 محصولات پرفروش</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: 12 }}>محصول</th>
                <th style={{ padding: 12 }}>تعداد فروش</th>
              </tr>
            </thead>
            <tbody>
              {report.topProducts.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 12 }}>{p.name}</td>
                  <td style={{ padding: 12 }}>{p.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>📅 فروش ماهانه</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 12, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: 12 }}>ماه</th>
                <th style={{ padding: 12 }}>فروش (تومان)</th>
              </tr>
            </thead>
            <tbody>
              {report.monthlySales.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 12 }}>{m.month}</td>
                  <td style={{ padding: 12 }}>{m.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </AdminLayout>
  );
}
const card = { background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const label = { color: '#6b7280', fontSize: 14 };
const val = { fontSize: 24, fontWeight: 'bold', color: '#059669', marginTop: 8 };
