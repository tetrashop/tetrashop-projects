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
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '2.5rem', width: '400px', maxWidth: '90%' }}>
        <h1 style={{ textAlign: 'center', color: '#059669', marginBottom: '1.5rem' }}>🔐 ورود مدیر</h1>
        {error && <p style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem', background: '#fee2e2', padding: '0.5rem', borderRadius: '8px' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="نام کاربری" required style={{ padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="رمز عبور" required style={{ padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
          <button type="submit" disabled={loading} style={{ padding: '0.8rem', background: loading ? '#9ca3af' : '#059669', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.85rem' }}>
          کاربری پیش‌فرض: admin / admin123
        </p>
      </div>
    </div>
  );
}
