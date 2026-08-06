import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/api/wallet/balance').then(r => r.json()).then(d => setWallets(d.wallets || [])).catch(() => {});
    fetch('/api/wallet/history?limit=15').then(r => r.json()).then(d => setTransactions(d.transactions || [])).catch(() => {});
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>💎 کیف پول</h1>

        <h2>💰 دارایی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
          {wallets.map(w => (
            <div key={w.currency} style={{ background: 'white', borderRadius: 16, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 40 }}>{w.icon}</div>
              <h3>{w.name}</h3>
              <p style={{ fontSize: 22, fontWeight: 'bold', color: '#059669' }}>{w.balance} {w.symbol}</p>
              {w.change24h && <p style={{ fontSize: 14, color: w.change24h.startsWith('+') ? '#059669' : '#dc2626' }}>{w.change24h}</p>}
            </div>
          ))}
        </div>

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
