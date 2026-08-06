import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function Dashboard() {
  useAuth();
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
    fetch('/api/errors').then(r => r.json()).then(d => setErrors(d.errors || [])).catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 20 }}>📊 داشبورد مدیریت</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
        <div style={card}><div style={label}>وضعیت سرور</div><div style={{...val, color: status?.status === 'online' ? '#059669' : '#dc2626'}}>{status ? status.status : '...'}</div></div>
        <div style={card}><div style={label}>خطاهای فعال</div><div style={{...val, color: errors.filter(e => e.status === 'active').length > 0 ? '#dc2626' : '#059669'}}>{errors.filter(e => e.status === 'active').length}</div></div>
      </div>
    </AdminLayout>
  );
}
const card = { background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const label = { color: '#6b7280', fontSize: 14 };
const val = { fontSize: 24, fontWeight: 'bold', color: '#059669', marginTop: 8 };
