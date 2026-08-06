import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ورود');
      localStorage.setItem('token', data.token);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: 380, maxWidth: '90%' }}>
        <h1 style={{ textAlign: 'center', color: '#059669', marginBottom: 20 }}>🔐 ورود به پنل مدیریت</h1>
        {error && <p style={{ color: '#dc2626', background: '#fee2e2', padding: 10, borderRadius: 8, marginBottom: 15, textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="نام کاربری" required style={{ padding: 12, border: '2px solid #e5e7eb', borderRadius: 12 }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="رمز عبور" required style={{ padding: 12, border: '2px solid #e5e7eb', borderRadius: 12 }} />
          <button type="submit" disabled={loading} style={{ padding: 12, background: loading ? '#9ca3af' : '#059669', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 15, color: '#6b7280', fontSize: 14 }}>
          اطلاعات پیش‌فرض: admin / admin123
        </p>
      </div>
    </div>
  );
}
