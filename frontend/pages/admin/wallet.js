import { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import useAuth from '../../src/utils/useAuth';
import WalletCard from '../../src/components/WalletCard';

export default function AdminWallet() {
  useAuth();
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wallet/real-balance')
      .then(r => r.json())
      .then(ton => {
        const others = [
          { currency: 'IRR', symbol: '﷼', name: 'ریال ایران', balance: '12,500,000', icon: '🇮🇷' },
          { currency: 'USDT', symbol: '₮', name: 'تتر', balance: '500.00', icon: '💎' },
        ];
        setWallets([ton, ...others]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch('/api/wallet/real-history')
      .then(r => r.json())
      .then(d => setTransactions(d.transactions || []))
      .catch(() => {});
  }, []);

  if (loading) return <AdminLayout><div style={{ textAlign: 'center', padding: 60 }}>در حال بارگذاری...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1>💎 کیف پول</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
        {wallets.map(w => <WalletCard key={w.currency} wallet={w} />)}
      </div>
      <h2>📋 تاریخچه</h2>
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
                <td style={{ padding: 10 }}><span style={{ background: tx.type === 'deposit' ? '#d1fae5' : '#fee2e2', color: tx.type === 'deposit' ? '#059669' : '#dc2626', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>{tx.type === 'deposit' ? 'واریز' : 'برداشت'}</span></td>
                <td style={{ padding: 10, fontWeight: 'bold' }}>{tx.amount} TON</td>
                <td style={{ padding: 10 }}><span style={{ background: tx.status === 'completed' ? '#d1fae5' : '#fef3c7', color: tx.status === 'completed' ? '#059669' : '#92400e', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>{tx.status === 'completed' ? 'موفق' : 'ناموفق'}</span></td>
                <td style={{ padding: 10, fontSize: 12, color: '#6b7280' }}>{new Date(tx.time).toLocaleString('fa-IR')}</td>
                <td style={{ padding: 10, fontSize: 11, fontFamily: 'monospace', color: '#2563eb' }}>{tx.txHash?.slice(0, 10)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
