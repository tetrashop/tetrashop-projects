import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: 'deposit', currency: 'USDT', amount: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/wallet/balance').then(r => r.json()).then(data => {
      setWallets(data.wallets || []);
      setTransactions(data.transactions || []);
    }).catch(() => {});
  }, []);

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
      // رفرش داده‌ها
      const refresh = await fetch('/api/wallet/balance');
      const newData = await refresh.json();
      setWallets(newData.wallets || []);
      setTransactions(newData.transactions || []);
      setForm({ ...form, amount: '' });
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>💎 کیف پول</h1>

      {message && <p style={{ textAlign: 'center', padding: '0.8rem', background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: '8px', marginBottom: '1rem' }}>{message}</p>}

      {/* بخش موجودی کیف پول‌ها */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>💰 موجودی کیف پول‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {wallets.map(w => (
            <div key={w.currency} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>{w.icon}</div>
              <h3 style={{ margin: '0.5rem 0', color: '#333' }}>{w.name}</h3>
              <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#059669' }}>{w.balance} {w.symbol}</p>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{w.type === 'crypto' ? 'رمزارز' : 'فیات'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* بخش عملیات مالی */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>💳 انجام تراکنش</h2>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ flex: 1, padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '0.9rem' }}>
                <option value="deposit">💰 واریز</option>
                <option value="withdraw">💸 برداشت</option>
                <option value="transfer">🔄 انتقال</option>
              </select>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} style={{ flex: 1, padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '0.9rem' }}>
                <option value="IRR">﷼ ریال</option>
                <option value="USD">$ دلار</option>
                <option value="USDT">₮ تتر</option>
                <option value="BTC">₿ بیت‌کوین</option>
                <option value="ETH">Ξ اتریوم</option>
                <option value="TON">💎 تون</option>
              </select>
            </div>
            <input type="text" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="مقدار" required style={{ padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '0.9rem' }} />
            <button type="submit" style={{ padding: '0.8rem', background: '#059669', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>ثبت تراکنش</button>
          </form>
        </div>
      </section>

      {/* بخش تاریخچه تراکنش‌ها */}
      <section>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📋 تاریخچه تراکنش‌ها</h2>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
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
                    <span style={{ background: tx.type === 'deposit' ? '#d1fae5' : tx.type === 'withdraw' ? '#fee2e2' : '#dbeafe', color: tx.type === 'deposit' ? '#059669' : tx.type === 'withdraw' ? '#dc2626' : '#2563eb', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
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
                  <td style={{ padding: '10px 16px', fontSize: '0.75rem', color: '#2563eb', fontFamily: 'monospace' }}>{tx.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps({ req }) {
  const token = req.cookies?.token;
  if (!token) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
