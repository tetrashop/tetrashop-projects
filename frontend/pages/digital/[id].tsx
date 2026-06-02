import { useRouter } from 'next/router';

export default function DigitalProduct() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', textAlign: 'center', padding: 60 }}>
      <h1>محصول دیجیتال #{id}</h1>
      <p>جزئیات محصول به‌زودی اضافه خواهد شد.</p>
      <a href="/" style={{ color: '#2563eb' }}>بازگشت به فروشگاه</a>
    </div>
  );
}
