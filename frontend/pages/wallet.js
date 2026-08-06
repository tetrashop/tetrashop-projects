import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/api/wallet/balance')
      .then(r => r.json())
      .then(d => { setWallets(d.wallets || []); setTransactions(d.transactions || []); })
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#059669', marginBottom: '2rem' }}>💎 کیف پول</h1>

        {/* موجودی‌ها */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>💰 موجودی‌ها</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {wallets.map(w => (
              <div key={w.currency} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2.5rem' }}>{w.icon}</div>
                <h3>{w.name || w.currency}</h3>
                <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#059669' }}>
                  {w.balance} {w.symbol}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{w.type === 'crypto' ? 'رمزارز' : 'فیات'}</p>
              </div>
            ))}
          </div>
        </section>

        {/* تاریخچه تراکنش‌ها */}
        <section>
          <h2>📋 تاریخچه تراکنش‌ها</h2>
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
      </div>
    </Layout>
  );
}
