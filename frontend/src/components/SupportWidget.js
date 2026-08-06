import { useState } from 'react';
import Link from 'next/link';

export default function SupportWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {open && (
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', padding: 15, marginBottom: 10, width: 220, textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px' }}>📞 نیاز به کمک دارید؟</p>
          <a href="/contact" style={{ display: 'block', background: '#059669', color: 'white', padding: '8px', borderRadius: 8, textDecoration: 'none', marginBottom: 5 }}>تماس با ما</a>
          <a href="/faq" style={{ display: 'block', background: '#2563eb', color: 'white', padding: '8px', borderRadius: 8, textDecoration: 'none' }}>سوالات متداول</a>
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{ background: '#059669', color: 'white', border: 'none', borderRadius: '50%', width: 56, height: 56, fontSize: '1.8rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        💬
      </button>
    </div>
  );
}
