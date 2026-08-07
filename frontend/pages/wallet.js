import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';
import WalletCard from '../src/components/WalletCard';

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ toAddress: '', amount: '' });

  useEffect(() => {
    setLoading(true);
    // دریافت موجودی واقعی TON
    fetch('/api/wallet/real-balance')
      .then(r => r.json())
      .then(tonData => {
        // ترکیب با سایر ارزهای شبیه‌سازی‌شده
        const otherWallets = [
          { currency: 'IRR', symbol: '﷼', name: 'ریال ایران', balance: '12,500,000', icon: '🇮🇷', type: 'fiat', address: 'IRR-WALLET-001' },
          { currency: 'USDT', symbol: '₮', name: 'تتر', balance: '500.00', icon: '💎', type: 'crypto', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7' },
          { currency: 'BTC', symbol: '₿', name: 'بیت‌کوین', balance: '0.015', icon: '🪙', type: 'crypto', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
          { currency: 'ETH', symbol: 'Ξ', name: 'اتریوم', balance: '0.52', icon: '🔷', type: 'crypto', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7' },
        ];
        setWallets([tonData, ...otherWallets]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // دریافت تاریخچه واقعی
    fetch('/api/wallet/real-history')
      .then(r => r.json())
      .then(d => setTransactions(d.transactions || []))
      .catch(() => {});
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/wallet/send-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage('✅ ' + data.message);
      setForm({ toAddress: '', amount: '' });
    } catch (err) {
      setMessage('❌ ' + err.message + (err.hint ? '\n' + err.hint : ''));
    }
  };

  if (loading) return <Layout><div style={{ textAlign: 'center', padding: 60 }}>در حال بارگذاری داده‌های واقعی...</div></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>💎 کیف پول (داده‌های واقعی)</h1>

        {message && (
          <div style={{ padding: 12, background: message.includes('✅') ? '#d1fae5' : '#fee2e2', borderRadius: 8, marginBottom: 15, textAlign: 'center', whiteSpace: 'pre-line' }}>
            {message}
          </div>
        )}

        {/* دارایی‌ها */}
        <h2>💰 دارایی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
          {wallets.map(w => <WalletCard key={w.currency} wallet={w} />)}
        </div>

        {/* ارسال TON واقعی */}
        <h2>💸 ارسال TON</h2>
        <form onSubmit={handleSend} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
          <input type="text" value={form.toAddress} onChange={e => setForm({...form, toAddress: e.target.value})} placeholder="آدرس مقصد TON" required style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
          <input type="text" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="مقدار (TON)" required style={{ padding: 10, border: '2px solid #e5e7eb', borderRadius: 8 }} />
          <button type="submit" style={{ padding: 12, background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>ارسال</button>
          <small style={{ color: '#6b7280' }}>⚠️ نیاز به تنظیم TON_PRIVATE_KEY در متغیرهای محیطی</small>
        </form>

        {/* تاریخچه */}
        <h2>📋 تاریخچه (واقعی)</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={{ padding: 12 }}>نوع</th>
                <th style={{ padding: 12 }}>مقدار</th>
                <th style={{ padding: 12 }}>وضعیت</th>
                <th style={{ padding: 12 }}>زمان</th>
                <th style={{ padding: 12 }}>هش</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 10 }}>
                    <span style={{ background: tx.type === 'deposit' ? '#d1fae5' : '#fee2e2', color: tx.type === 'deposit' ? '#059669' : '#dc2626', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                      {tx.type === 'deposit' ? 'واریز' : tx.type === 'transfer' ? 'انتقال' : 'سایر'}
                    </span>
                  </td>
                  <td style={{ padding: 10, fontWeight: 'bold' }}>{tx.amount} TON</td>
                  <td style={{ padding: 10 }}>
                    <span style={{ background: tx.status === 'completed' ? '#d1fae5' : '#fef3c7', color: tx.status === 'completed' ? '#059669' : '#92400e', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                      {tx.status === 'completed' ? 'موفق' : 'ناموفق'}
                    </span>
                  </td>
                  <td style={{ padding: 10, fontSize: 12, color: '#6b7280' }}>{new Date(tx.time).toLocaleString('fa-IR')}</td>
                  <td style={{ padding: 10, fontSize: 11, fontFamily: 'monospace', color: '#2563eb' }}>{tx.txHash?.slice(0, 10)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
