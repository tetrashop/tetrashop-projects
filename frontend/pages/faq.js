import Layout from '../src/components/Layout';
import { useState, useEffect } from 'react';
export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  useEffect(() => { fetch('/api/faq').then(r => r.json()).then(setFaqs).catch(()=>{}); }, []);
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', color: '#059669' }}>❓ سوالات متداول</h1>
      <div style={{ marginTop: '2rem' }}>
        {faqs.map((faq, i) => (
          <details key={i} style={{ background: 'white', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <summary style={{ padding: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>{faq.q}</summary>
            <p style={{ padding: '1rem', borderTop: '1px solid #eee' }}>{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
