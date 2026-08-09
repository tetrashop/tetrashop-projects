import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';
import WalletCard from '../src/components/WalletCard';

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // دریافت موجودی واقعی TON
    fetch('/api/wallet/real-balance')
      .then(r => r.json())
      .then(tonData => {
        // دارایی‌های دیگر (شبیه‌سازی شده، ولی نمایش داده می‌شوند)
        const otherWallets = [
          { currency: 'IRR', symbol: '﷼', name: 'ریال ایران', balance: '12,500,000', icon: '🇮🇷', type: 'fiat', address: 'IRR-WALLET-001' },
          { currency: 'USDT', symbol: '₮', name: 'تتر (TRC20)', balance: '500.00', icon: '💎', type: 'crypto', address: 'TKbvdkdxfXEQJM38e5yGdTMQmNuDN34Tx2' },
          { currency: 'BTC', symbol: '₿', name: 'بیت‌کوین', balance: '0.015', icon: '🪙', type: 'crypto', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
          { currency: 'ETH', symbol: 'Ξ', name: 'اتریوم', balance: '0.52', icon: '🔷', type: 'crypto', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7' },
        ];
        setWallets([tonData, ...otherWallets]);
      })
      .catch(() => {
        // در صورت خطا، حداقل دارایی‌های شبیه‌سازی را نشان بده
        setWallets([
          { currency: 'TON', symbol: '💎', name: 'تون کوین', balance: '0.00', icon: '💎', type: 'crypto', address: 'UQBgjRhKP_MEUN8pcfxTMmY-uj8RdRyb9yl_czQ6VcSRV3Ol' },
          { currency: 'USDT', symbol: '₮', name: 'تتر (TRC20)', balance: '500.00', icon: '💎', type: 'crypto' },
          { currency: 'BTC', symbol: '₿', name: 'بیت‌کوین', balance: '0.015', icon: '🪙', type: 'crypto' },
        ]);
      })
      .finally(() => setLoading(false));

    // دریافت تاریخچه واقعی TON
    fetch('/api/wallet/real-history')
      .then(r => r.json())
      .then(d => setTransactions(d.transactions || []))
      .catch(() => {});
  }, []);

  if (loading) return <Layout><div style={{ textAlign: 'center', padding: 60 }}>در حال بارگذاری...</div></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>💎 کیف پول</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
          موجودی TON از شبکه واقعی دریافت می‌شود. سایر ارزها شبیه‌سازی هستند.
        </p>

        {/* دارایی‌ها */}
        <h2>💰 دارایی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15, marginBottom: 30 }}>
          {wallets.map(w => <WalletCard key={w.currency} wallet={w} />)}
        </div>

        {/* تاریخچه */}
        <h2>📋 تاریخچه تراکنش‌ها</h2>
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'right' }}>
                <th style={{ padding: 12 }}>نوع</th>
                <th style={{ padding: 12 }}>مقدار (TON)</th>
                <th style={{ padding: 12 }}>وضعیت</th>
                <th style={{ padding: 12 }}>زمان</th>
                <th style={{ padding: 12 }}>هش</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#6b7280' }}>تراکنشی یافت نشد</td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: 10 }}>
                      <span style={{ background: tx.type === 'deposit' ? '#d1fae5' : '#fee2e2', color: tx.type === 'deposit' ? '#059669' : '#dc2626', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                        {tx.type === 'deposit' ? 'واریز' : 'برداشت'}
                      </span>
                    </td>
                    <td style={{ padding: 10, fontWeight: 'bold' }}>{tx.amount}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ background: tx.status === 'completed' ? '#d1fae5' : '#fef3c7', color: tx.status === 'completed' ? '#059669' : '#92400e', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                        {tx.status === 'completed' ? 'موفق' : 'ناموفق'}
                      </span>
                    </td>
                    <td style={{ padding: 10, fontSize: 12, color: '#6b7280' }}>{new Date(tx.time).toLocaleString('fa-IR')}</td>
                    <td style={{ padding: 10, fontSize: 11, fontFamily: 'monospace', color: '#2563eb' }} title={tx.txHash}>{tx.txHash?.slice(0, 15)}...</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
