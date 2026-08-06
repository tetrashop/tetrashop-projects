import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';

export default function WalletPage() {
  useAuth(); // بررسی احراز هویت

  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: 'deposit', currency: 'IRR', amount: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    fetch('/api/wallet/balance')
      .then(r => r.json())
      .then(d => {
        setWallets(d.wallets || []);
        setTransactions(d.transactions || []);
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

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 20 }}>💎 کیف پول</h1>

      {message && (
        <div style={{ padding: 12, background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: 8, marginBottom: 15, textAlign: 'center' }}>
          {message}
        </div>
      )}

      {/* موجودی‌ها */}
      <section style={{ marginBottom: 30 }}>
        <h2>💰 موجودی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
          {wallets.map(w => (
            <div key={w.currency} style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 32 }}>{w.icon}</div>
              <h3>{w.name || w.currency}</h3>
              <p style={{ fontSize: 20, fontWeight: 'bold', color: '#059669' }}>
                {w.balance} {w.symbol}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* تراکنش جدید */}
      <section style={{ marginBottom: 30 }}>
        <h2>💳 تراکنش جدید</h2>
        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ flex: 1, padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }}>
              <option value="deposit">💰 واریز</option>
              <option value="withdraw">💸 برداشت</option>
              <option value="transfer">🔄 انتقال</option>
            </select>
            <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} style={{ flex: 1, padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }}>
              <option value="IRR">﷼ ریال</option>
              <option value="USDT">₮ تتر</option>
              <option value="BTC">₿ بیت‌کوین</option>
              <option value="ETH">Ξ اتریوم</option>
            </select>
          </div>
          <input type="text" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="مقدار" required style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
          <button type="submit" style={{ padding: 12, background: '#059669', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>ثبت تراکنش</button>
        </form>
      </section>

      {/* تاریخچه */}
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
                <th style={{ padding: 12 }}>هش تراکنش</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 10 }}><span style={{ background: tx.type === 'deposit' ? '#d1fae5' : '#fee2e2', color: tx.type === 'deposit' ? '#059669' : '#dc2626', padding: '3px 10px', borderRadius: 12, fontSize: 13 }}>
                    {tx.type === 'deposit' ? 'واریز' : tx.type === 'withdraw' ? 'برداشت' : 'انتقال'}
                  </span></td>
                  <td style={{ padding: 10 }}>{tx.currency}</td>
                  <td style={{ padding: 10, fontWeight: 'bold' }}>{tx.amount}</td>
                  <td style={{ padding: 10 }}><span style={{ background: tx.status === 'completed' ? '#d1fae5' : '#fef3c7', color: tx.status === 'completed' ? '#059669' : '#92400e', padding: '3px 10px', borderRadius: 12, fontSize: 13 }}>
                    {tx.status === 'completed' ? 'موفق' : 'در انتظار'}
                  </span></td>
                  <td style={{ padding: 10, fontSize: 13, color: '#6b7280' }}>{new Date(tx.time).toLocaleString('fa-IR')}</td>
                  <td style={{ padding: 10, fontSize: 12, fontFamily: 'monospace', color: '#2563eb' }}>{tx.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
