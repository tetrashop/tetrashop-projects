import { useRouter } from 'next/router';

export default function DigitalProduct() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ fontFamily: 'Tahoma', textAlign: 'center', padding: 60 }}>
      <h1>محصول #{id}</h1>
      <p>جزئیات به‌زودی</p>
      <a href="/" style={{ color: '#2563eb' }}>بازگشت</a>
    </div>
  );
}
