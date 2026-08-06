import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';
import WalletCard from '../../src/components/WalletCard';

export default function AdminWallet() {
  useAuth();
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [form, setForm] = useState({ type: 'deposit', currency: 'IRR', amount: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch('/api/wallet/balance').then(r => r.json()),
      fetch('/api/wallet/history?limit=20').then(r => r.json()),
    ])
      .then(([bal, hist]) => {
        setWallets(bal.wallets || []);
        setTransactions(hist.transactions || []);
        setPendingCount(hist.transactions?.filter(t => t.status === 'pending').length || 0);
      })
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/wallet/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage('✅ ' + data.message);
      fetchData();
      setForm({ ...form, amount: '' });
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  };

  const approveTransaction = async (id) => {
    // شبیه‌سازی تأیید – در واقعیت باید یک API PATCH صدا زده شود
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  const rejectTransaction = async (id) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'failed' } : t));
  };

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 20 }}>💎 کیف پول</h1>

      {message && (
        <div style={{ padding: 12, background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: 8, marginBottom: 15, textAlign: 'center' }}>
          {message}
        </div>
      )}

      {/* خلاصه */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 15, marginBottom: 30 }}>
        <div style={card}><div style={label}>در انتظار تأیید</div><div style={{...val, color: '#f59e0b'}}>{pendingCount}</div></div>
        <div style={card}><div style={label}>کل تراکنش‌ها</div><div style={val}>{transactions.length}</div></div>
      </div>

      {/* دارایی‌ها */}
      <section style={{ marginBottom: 30 }}>
        <h2>💰 دارایی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 15 }}>
          {wallets.map(w => <WalletCard key={w.currency} wallet={w} />)}
        </div>
      </section>

      {/* تراکنش جدید */}
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
          <input type="text" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="مقدار" required style={inputStyle} />
          <button type="submit" style={{ padding: 12, background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>ثبت تراکنش</button>
        </form>
      </section>

      {/* تاریخچه با قابلیت تأیید/رد */}
      <section>
        <h2>📋 تاریخچه تراکنش‌ها</h2>
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
                <th style={{ padding: 12 }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 10 }}>
                    <span style={{ background: tx.type === 'deposit' ? '#d1fae5' : '#fee2e2', color: tx.type === 'deposit' ? '#059669' : '#dc2626', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                      {tx.type === 'deposit' ? 'واریز' : tx.type === 'withdraw' ? 'برداشت' : 'انتقال'}
                    </span>
                  </td>
                  <td style={{ padding: 10 }}>{tx.currency}</td>
                  <td style={{ padding: 10, fontWeight: 'bold' }}>{tx.amount}</td>
                  <td style={{ padding: 10 }}>
                    <span style={{ background: tx.status === 'completed' ? '#d1fae5' : tx.status === 'pending' ? '#fef3c7' : '#fee2e2', color: tx.status === 'completed' ? '#059669' : tx.status === 'pending' ? '#92400e' : '#dc2626', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                      {tx.status === 'completed' ? 'موفق' : tx.status === 'pending' ? 'در انتظار' : 'ناموفق'}
                    </span>
                  </td>
                  <td style={{ padding: 10, fontSize: 12, color: '#6b7280' }}>{new Date(tx.time).toLocaleString('fa-IR')}</td>
                  <td style={{ padding: 10, fontSize: 11, fontFamily: 'monospace', color: '#2563eb' }}>{tx.txHash?.slice(0, 10)}</td>
                  <td style={{ padding: 10 }}>
                    {tx.status === 'pending' && (
                      <>
                        <button onClick={() => approveTransaction(tx.id)} style={{ background: '#059669', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', marginRight: 4, cursor: 'pointer' }}>تأیید</button>
                        <button onClick={() => rejectTransaction(tx.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>رد</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
const card = { background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const label = { color: '#6b7280', fontSize: 14 };
const val = { fontSize: 24, fontWeight: 'bold', color: '#059669', marginTop: 8 };
const inputStyle = { padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 };
const selectStyle = { flex: 1, padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 };
