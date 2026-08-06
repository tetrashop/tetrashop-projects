import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';
import WalletCard from '../src/components/WalletCard';

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState({ type: 'all', currency: 'all', search: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/wallet/balance').then(r => r.json()),
      fetch('/api/wallet/history?limit=15').then(r => r.json()),
      fetch('/api/wallet/stats').then(r => r.json()),
    ])
      .then(([balanceData, historyData, statsData]) => {
        setWallets(balanceData.wallets || []);
        setTransactions(historyData.transactions || []);
        setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const applyFilter = () => {
    const params = new URLSearchParams(filter).toString();
    fetch(`/api/wallet/history?${params}&limit=20`)
      .then(r => r.json())
      .then(data => setTransactions(data.transactions || []))
      .catch(() => {});
  };

  const exportCSV = () => {
    window.open('/api/wallet/export', '_blank');
  };

  if (loading) return <Layout><div style={{ textAlign: 'center', padding: 60 }}>در حال بارگذاری...</div></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>💎 کیف پول</h1>

        {/* آمار کلی */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, margin: '20px 0' }}>
            <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: 14 }}>موجودی کل</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#059669' }}>{stats.totalBalance.toLocaleString()} تومان</div>
            </div>
            <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: 14 }}>تغییر ماهانه</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: stats.monthlyChange > 0 ? '#059669' : '#dc2626' }}>{stats.monthlyChange}%</div>
            </div>
            {/* نمودار میله‌ای ساده */}
            <div style={{ gridColumn: '1 / -1', background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: 15 }}>📈 روند هفتگی (تومان)</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                {stats.weeklyChart.map((val, i) => (
                  <div key={i} style={{ flex: 1, background: '#059669', borderRadius: '4px 4px 0 0', height: (val / 20000000 * 100) + '%', position: 'relative' }} title={val.toLocaleString()}>
                    <span style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 10 }}>{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* دارایی‌ها */}
        <h2>💰 دارایی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
          {wallets.map(w => <WalletCard key={w.currency} wallet={w} />)}
        </div>

        {/* فیلترها و تاریخچه */}
        <h2>📋 تاریخچه تراکنش‌ها</h2>
        <div style={{ display: 'flex', gap: 10, marginBottom: 15, flexWrap: 'wrap' }}>
          <select value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})} style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }}>
            <option value="all">همه نوع</option>
            <option value="deposit">واریز</option>
            <option value="withdraw">برداشت</option>
            <option value="transfer">انتقال</option>
          </select>
          <select value={filter.currency} onChange={e => setFilter({...filter, currency: e.target.value})} style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }}>
            <option value="all">همه ارزها</option>
            {wallets.map(w => <option key={w.currency} value={w.currency}>{w.currency}</option>)}
          </select>
          <input value={filter.search} onChange={e => setFilter({...filter, search: e.target.value})} placeholder="جستجوی هش یا آدرس" style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db', flex: 1, minWidth: 150 }} />
          <button onClick={applyFilter} style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>اعمال</button>
          <button onClick={exportCSV} style={{ padding: '8px 16px', background: '#059669', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>📥 CSV</button>
        </div>

        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={{ padding: 12 }}>نوع</th>
                <th style={{ padding: 12 }}>ارز</th>
                <th style={{ padding: 12 }}>مقدار</th>
                <th style={{ padding: 12 }}>وضعیت</th>
                <th style={{ padding: 12 }}>زمان</th>
                <th style={{ padding: 12 }}>آدرس</th>
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
                    <span style={{ background: tx.status === 'completed' ? '#d1fae5' : '#fef3c7', color: tx.status === 'completed' ? '#059669' : '#92400e', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                      {tx.status === 'completed' ? 'موفق' : 'در انتظار'}
                    </span>
                  </td>
                  <td style={{ padding: 10, fontSize: 12, color: '#6b7280' }}>{new Date(tx.time).toLocaleString('fa-IR')}</td>
                  <td style={{ padding: 10, fontSize: 11, fontFamily: 'monospace', color: '#2563eb' }} title={tx.toAddress}>{tx.toAddress?.slice(0, 10)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
