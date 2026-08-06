import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function AdminWallet() {
  useAuth();
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: 'deposit', currency: 'IRR', amount: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/wallet/balance').then(r => r.json()).then(d => setWallets(d.wallets || [])).catch(() => {});
    fetch('/api/wallet/history?limit=15').then(r => r.json()).then(d => setTransactions(d.transactions || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/wallet/transaction', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage('✅ ' + data.message);
      setForm({ ...form, amount: '' });
    } catch (err) { setMessage('❌ ' + err.message); }
  };

  return (
    <AdminLayout>
      <h1>💎 کیف پول</h1>
      {message && <div style={{ padding: 12, background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: 8, marginBottom: 15, textAlign: 'center' }}>{message}</div>}

      <section style={{ marginBottom: 30 }}>
        <h2>💰 دارایی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 15 }}>
          {wallets.map(w => (
            <div key={w.currency} style={{ background: 'white', borderRadius: 16, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 40 }}>{w.icon}</div>
              <h3>{w.name}</h3>
              <p style={{ fontSize: 22, fontWeight: 'bold', color: '#059669' }}>{w.balance} {w.symbol}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>💳 تراکنش جدید</h2>
        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={selectStyle}>
              <option value="deposit">💰 واریز</option>
              <option value="withdraw">💸 برداشت</option>
              <option value="transfer">🔄 انتقال</option>
            </select>
            <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} style={selectStyle}>
              {wallets.map(w => <option key={w.currency} value={w.currency}>{w.currency}</option>)}
            </select>
          </div>
          <input type="text" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="مقدار" required style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
          <button type="submit" style={{ padding: 12, background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>ثبت تراکنش</button>
        </form>
      </section>

      <section>
        <h2>📋 تاریخچه</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={{ padding: 12 }}>نوع</th>
                <th style={{ padding: 12 }}>ارز</th>
                <th style={{ padding: 12 }}>مقدار</th>
                <th style={{ padding: 12 }}>وضعیت</th>
                <th style={{ padding: 12 }}>زمان</th>
                <th style={{ padding: 12 }}>هش</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 10 }}><span style={{ background: tx.type === 'deposit' ? '#d1fae5' : '#fee2e2', color: tx.type === 'deposit' ? '#059669' : '#dc2626', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>{tx.type === 'deposit' ? 'واریز' : 'برداشت'}</span></td>
                  <td style={{ padding: 10 }}>{tx.currency}</td>
                  <td style={{ padding: 10, fontWeight: 'bold' }}>{tx.amount}</td>
                  <td style={{ padding: 10 }}><span style={{ background: tx.status === 'completed' ? '#d1fae5' : '#fef3c7', color: tx.status === 'completed' ? '#059669' : '#92400e', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>{tx.status === 'completed' ? 'موفق' : 'در انتظار'}</span></td>
                  <td style={{ padding: 10, fontSize: 12, color: '#6b7280' }}>{new Date(tx.time).toLocaleString('fa-IR')}</td>
                  <td style={{ padding: 10, fontSize: 11, fontFamily: 'monospace', color: '#2563eb' }}>{tx.txHash?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
const selectStyle = { flex: 1, padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 };
