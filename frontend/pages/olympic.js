import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';

export default function OlympicPage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/olympic').then(r => r.json()).then(setData).catch(() => {}); }, []);
  return (
    <Layout>
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#1e3a8a' }}>🏅 المپیک</h1>
        {data ? (
          <>
            <h2>رویدادها</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {data.events.map(e => (
                <div key={e.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <strong>{e.name}</strong> - {e.status}
                  {e.score1 !== undefined && ` (${e.score1} - ${e.score2})`}
                </div>
              ))}
            </div>
            <h2 style={{ marginTop: '2rem' }}>جدول مدال‌ها</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
              <thead><tr style={{ background: '#1e3a8a', color: 'white' }}><th>کشور</th><th>طلا</th><th>نقره</th><th>برنز</th></tr></thead>
              <tbody>
                {data.medals.map((m, i) => (
                  <tr key={i}><td>{m.country}</td><td>{m.gold}</td><td>{m.silver}</td><td>{m.bronze}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        ) : <p>در حال بارگذاری...</p>}
      </div>
    </Layout>
  );
}
