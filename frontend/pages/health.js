import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';

export default function HealthPage() {
  const [health, setHealth] = useState(null);
  useEffect(() => { fetch('/api/health').then(r => r.json()).then(setHealth).catch(() => {}); }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>🏥 وضعیت سیستم</h1>
        {health ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <tbody>
              {[
                ['سرور', health.server],
                ['JWT', health.jwt],
                ['MongoDB', health.mongodb],
                ['زرین‌پال', health.zarinpal],
                ['ایمیل', health.email],
                ['TON Wallet', health.ton],
                ['Cloudinary', health.cloudinary],
              ].map(([name, ok]) => (
                <tr key={name} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 12, fontWeight: 'bold' }}>{name}</td>
                  <td style={{ padding: 12, color: ok ? '#059669' : '#dc2626' }}>
                    {ok ? '✅ فعال' : '❌ غیرفعال'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>در حال بررسی...</p>}
        {health && <p style={{ marginTop: 20, textAlign: 'center', color: '#6b7280' }}>{health.message}</p>}
      </div>
    </Layout>
  );
}
