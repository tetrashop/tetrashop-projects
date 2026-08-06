import { useState } from 'react';

export default function WalletCard({ wallet, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard?.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopy) onCopy(wallet.address);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center', position: 'relative', transition: 'transform 0.2s' }}>
      <div style={{ fontSize: 40 }}>{wallet.icon}</div>
      <h3 style={{ margin: '8px 0' }}>{wallet.name}</h3>
      <p style={{ fontSize: 22, fontWeight: 'bold', color: '#059669' }}>{wallet.balance} <span style={{ fontSize: 16 }}>{wallet.symbol}</span></p>
      {wallet.change24h && (
        <p style={{ fontSize: 14, color: wallet.change24h.startsWith('+') ? '#059669' : '#dc2626' }}>{wallet.change24h}</p>
      )}
      {wallet.address && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <code style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: 6, fontSize: 11, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wallet.address}</code>
          <button onClick={handleCopy} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}>
            {copied ? '✅' : '📋'}
          </button>
        </div>
      )}
    </div>
  );
}
