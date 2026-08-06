import { useState } from 'react';
import { useRouter } from 'next/router';

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
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2rem', width: '380px', maxWidth: '90%' }}>
        <h1 style={{ textAlign: 'center', color: '#059669', marginBottom: '1.5rem' }}>🔐 ورود به پنل مدیریت</h1>
        {error && <p style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="نام کاربری" required style={{ padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px' }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="رمز عبور" required style={{ padding: '0.8rem', border: '2px solid #e5e7eb', borderRadius: '12px' }} />
          <button type="submit" style={{ padding: '0.8rem', background: '#059669', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>ورود</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
          کاربری پیش‌فرض: admin / admin123
        </p>
      </div>
    </div>
  );
}
