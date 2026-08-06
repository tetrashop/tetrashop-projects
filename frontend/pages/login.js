import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ورود');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      // اگر ادمین بود به پنل مدیریت برود وگرنه به صفحه اصلی
      if (data.role === 'admin' || data.role === 'manager') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: 400, margin: '3rem auto', padding: '2rem', background: 'white', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>🔐 ورود</h1>
        {error && <p style={{ color: '#dc2626', background: '#fee2e2', padding: 10, borderRadius: 8 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 20 }}>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="نام کاربری" required style={{ padding: 12, border: '2px solid #e5e7eb', borderRadius: 12 }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="رمز عبور" required style={{ padding: 12, border: '2px solid #e5e7eb', borderRadius: 12 }} />
          <button type="submit" style={{ padding: 12, background: '#059669', color: 'white', border: 'none', borderRadius: 12, fontWeight: 'bold' }}>ورود</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 15 }}>
          حساب کاربری ندارید؟ <a href="/register" style={{ color: '#2563eb' }}>ثبت‌نام کنید</a>
        </p>
      </div>
    </Layout>
  );
}
