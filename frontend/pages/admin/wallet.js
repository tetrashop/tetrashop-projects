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
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    fetch('/api/wallet/balance')
      .then(r => r.json())
      .then(data => {
        setWallets(data.wallets || []);
        setTransactions(data.transactions || []);
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
      <h1 style={{ marginBottom: '20px' }}>💎 کیف پول</h1>

      {message && (
        <div style={{ padding: '12px', background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
          {message}
        </div>
      )}

      {/* موجودی‌ها */}
      <section style={{ marginBottom: '30px' }}>
        <h2>💰 موجودی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          {wallets.map(w => (
            <div key={w.currency} style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '32px' }}>{w.icon}</div>
              <h3>{w.name || w.currency}</h3>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>
                {w.balance} {w.symbol}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* تراکنش جدید */}
      <section style={{ marginBottom: '30px' }}>
        <h2>💳 تراکنش جدید</h2>
        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ flex: 1, padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
              <option value="deposit">💰 واریز</option>
              <option value="withdraw">💸 برداشت</option>
              <option value="transfer">🔄 انتقال</option>
            </select>
            <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} style={{ flex: 1, padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
              <option value="IRR">﷼ ریال</option>
              <option value="USDT">₮ تتر</option>
              <option value="BTC">₿ بیت‌کوین</option>
              <option value="ETH">Ξ اتریوم</option>
              <option value="TON">💎 تون</option>
            </select>
          </div>
          <input type="text" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="مقدار" required style={{ padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px' }} />
          <button type="submit" style={{ padding: '12px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ثبت تراکنش
          </button>
        </form>
      </section>

      {/* تاریخچه */}
      <section>
        <h2>📋 تاریخچه تراکنش‌ها</h2>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={{ padding: '12px 16px' }}>نوع</th>
                <th style={{ padding: '12px 16px' }}>ارز</th>
                <th style={{ padding: '12px 16px' }}>مقدار</th>
                <th style={{ padding: '12px 16px' }}>وضعیت</th>
                <th style={{ padding: '12px 16px' }}>زمان</th>
                <th style={{ padding: '12px 16px' }}>هش تراکنش</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: tx.type === 'deposit' ? '#d1fae5' : '#fee2e2', color: tx.type === 'deposit' ? '#059669' : '#dc2626', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                      {tx.type === 'deposit' ? 'واریز' : tx.type === 'withdraw' ? 'برداشت' : 'انتقال'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>{tx.currency}</td>
                  <td style={{ padding: '10px 16px', fontWeight: 'bold' }}>{tx.amount}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: tx.status === 'completed' ? '#d1fae5' : '#fef3c7', color: tx.status === 'completed' ? '#059669' : '#92400e', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                      {tx.status === 'completed' ? 'موفق' : 'در انتظار'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: '0.8rem', color: '#6b7280' }}>{new Date(tx.time).toLocaleString('fa-IR')}</td>
                  <td style={{ padding: '10px 16px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#2563eb' }}>{tx.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
