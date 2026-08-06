import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function TicketsPage() {
  useAuth();
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ user: '', subject: '', priority: 'medium' });

  useEffect(() => {
    fetch('/api/tickets').then(r => r.json()).then(setTickets).catch(() => {});
  }, []);

  const addTicket = async () => {
    if (!newTicket.user || !newTicket.subject) return;
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket),
    });
    if (res.ok) {
      const t = await res.json();
      setTickets(prev => [t, ...prev]);
      setNewTicket({ user: '', subject: '', priority: 'medium' });
    }
  };

  const closeTicket = async (id) => {
    await fetch('/api/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'closed' }),
    });
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t));
  };

  return (
    <AdminLayout>
      <h1>🎫 تیکت‌های پشتیبانی</h1>

      <div style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 30 }}>
        <h3>ایجاد تیکت جدید</h3>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          <input value={newTicket.user} onChange={e => setNewTicket({...newTicket, user: e.target.value})} placeholder="نام کاربر" style={inputStyle} />
          <input value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} placeholder="موضوع" style={{...inputStyle, flex: 2}} />
          <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})} style={inputStyle}>
            <option value="low">کم</option>
            <option value="medium">متوسط</option>
            <option value="high">بالا</option>
          </select>
          <button onClick={addTicket} style={{ padding: '8px 16px', background: '#059669', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>ایجاد</button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
              <th style={{ padding: 12 }}>شناسه</th>
              <th style={{ padding: 12 }}>کاربر</th>
              <th style={{ padding: 12 }}>موضوع</th>
              <th style={{ padding: 12 }}>اولویت</th>
              <th style={{ padding: 12 }}>وضعیت</th>
              <th style={{ padding: 12 }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 10 }}>#{t.id}</td>
                <td style={{ padding: 10 }}>{t.user}</td>
                <td style={{ padding: 10 }}>{t.subject}</td>
                <td style={{ padding: 10 }}>
                  <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 12, background: t.priority === 'high' ? '#fee2e2' : t.priority === 'medium' ? '#fef3c7' : '#d1fae5', color: t.priority === 'high' ? '#dc2626' : '#92400e' }}>
                    {t.priority === 'high' ? 'بالا' : t.priority === 'medium' ? 'متوسط' : 'کم'}
                  </span>
                </td>
                <td style={{ padding: 10 }}>
                  <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 12, background: t.status === 'open' ? '#d1fae5' : '#e5e7eb', color: t.status === 'open' ? '#059669' : '#6b7280' }}>
                    {t.status === 'open' ? 'باز' : 'بسته'}
                  </span>
                </td>
                <td style={{ padding: 10 }}>
                  {t.status === 'open' && (
                    <button onClick={() => closeTicket(t.id)} style={{ padding: '4px 10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>بستن</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
const inputStyle = { padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: 8, flex: 1, minWidth: 130 };
