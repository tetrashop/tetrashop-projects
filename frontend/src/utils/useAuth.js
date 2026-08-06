import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // اعتبارسنجی توکن
    fetch('/api/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) {
        localStorage.removeItem('token');
        router.push('/admin/login');
      }
    })
    .catch(() => {
      router.push('/admin/login');
    });
  }, [router]);
}
