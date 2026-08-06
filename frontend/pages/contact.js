import Layout from '../src/components/Layout';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) setSent(true);
  };

  if (sent) return <div style={{ padding: 60, textAlign: 'center' }}><h2>✅ پیام شما با موفقیت ارسال شد.</h2><a href="/">بازگشت به فروشگاه</a></div>;

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📧 تماس با ما</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="نام شما" required style={{ padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px' }} />
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="ایمیل شما" required style={{ padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px' }} />
        <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="پیام شما..." required rows={5} style={{ padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px' }} />
        <button type="submit" style={{ padding: '0.8rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>ارسال پیام</button>
      </form>
    </div>
  );
}
