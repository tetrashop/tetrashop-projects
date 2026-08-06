import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(data => {
        setStatus(data);
        setHistory(prev => [{ time: new Date().toLocaleTimeString('fa-IR'), status: data.status, uptime: Math.floor(data.uptime) }, ...prev].slice(0, 20));
      })
      .catch(() => {});
    const interval = setInterval(() => {
      fetch('/api/status')
        .then(r => r.json())
        .then(data => {
          setStatus(data);
          setHistory(prev => [{ time: new Date().toLocaleTimeString('fa-IR'), status: data.status, uptime: Math.floor(data.uptime) }, ...prev].slice(0, 20));
        })
        .catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>📊 وضعیت سیستم</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15, margin: '20px 0' }}>
          <div style={card}><div style={label}>وضعیت کلی</div><div style={{...val, color: status?.status === 'online' ? '#059669' : '#dc2626'}}>{status ? status.status : '...'}</div></div>
          <div style={card}><div style={label}>آپتایم</div><div style={val}>{status ? Math.floor(status.uptime) + 's' : '...'}</div></div>
          <div style={card}><div style={label}>حافظه</div><div style={val}>{status ? status.memory + ' MB' : '...'}</div></div>
          <div style={card}><div style={label}>Node.js</div><div style={val}>{status ? status.node : '...'}</div></div>
        </div>

        <h3>📋 تاریخچه وضعیت</h3>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto', maxHeight: 400 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f9fafb' }}><th style={{ padding: 12 }}>زمان</th><th style={{ padding: 12 }}>وضعیت</th><th style={{ padding: 12 }}>آپتایم</th></tr></thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 10 }}>{h.time}</td>
                  <td style={{ padding: 10 }}><span style={{ color: h.status === 'online' ? '#059669' : '#dc2626' }}>{h.status}</span></td>
                  <td style={{ padding: 10 }}>{h.uptime}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
const card = { background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const label = { color: '#6b7280', fontSize: 14 };
const val = { fontSize: 24, fontWeight: 'bold', color: '#059669', marginTop: 8 };
