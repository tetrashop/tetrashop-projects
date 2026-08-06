import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';

export default function ErrorsPage() {
  const [errors, setErrors] = useState([]);
  useEffect(() => { fetch('/api/errors').then(r => r.json()).then(d => setErrors(d.errors || [])).catch(() => {}); }, []);
  return (
    <Layout>
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#dc2626' }}>⚠️ خطاهای سیستم</h1>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f9fafb' }}><th style={{ padding: 12 }}>نوع</th><th style={{ padding: 12 }}>پیام</th><th style={{ padding: 12 }}>وضعیت</th></tr></thead>
            <tbody>
              {errors.map(e => (
                <tr key={e.id}><td style={{ padding: 10 }}><span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: 12 }}>{e.type}</span></td><td style={{ padding: 10 }}>{e.message}</td><td style={{ padding: 10 }}><span style={{ background: e.status === 'active' ? '#fee2e2' : '#d1fae5', color: e.status === 'active' ? '#dc2626' : '#059669', padding: '2px 8px', borderRadius: 12 }}>{e.status === 'active' ? 'فعال' : 'رفع‌شده'}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
