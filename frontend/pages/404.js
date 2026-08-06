import Link from 'next/link';
export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h1 style={{ fontSize: '5rem', color: '#dc2626', margin: 0 }}>۴۰۴</h1>
      <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: 30 }}>متأسفانه صفحه مورد نظر یافت نشد.</p>
      <Link href="/" style={{ background: '#2563eb', color: 'white', padding: '12px 30px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>بازگشت به صفحه اصلی</Link>
    </div>
  );
}
