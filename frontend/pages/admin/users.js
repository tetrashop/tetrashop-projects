import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function UsersPage() {
  useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', role: 'user', email: '' });

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers).catch(()=>{});
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
      setForm({ username: '', role: 'user', email: '' });
    }
  };

  const deleteUser = async (id) => {
    await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AdminLayout>
      <h1>👥 مدیریت کاربران</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        <div>
          <h3>افزودن کاربر</h3>
          <form onSubmit={addUser} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="نام کاربری" required style={{ width: '100%', padding: 10, marginBottom: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ width: '100%', padding: 10, marginBottom: 10, border: '2px solid #e5e7eb', borderRadius: 8 }}>
              <option value="user">کاربر عادی</option>
              <option value="admin">مدیر</option>
              <option value="manager">مدیر فروش</option>
            </select>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ایمیل" style={{ width: '100%', padding: 10, marginBottom: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
            <button type="submit" style={{ width: '100%', padding: 10, background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold' }}>افزودن</button>
          </form>
        </div>
        <div>
          <h3>لیست کاربران</h3>
          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f9fafb' }}><th style={th}>نام</th><th style={th}>نقش</th><th style={th}>عملیات</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}><td style={td}>{u.username}</td><td style={td}>{u.role}</td><td style={td}><button onClick={() => deleteUser(u.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>حذف</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
const th = { padding: '12px 16px', textAlign: 'right' };
const td = { padding: '10px 16px' };
