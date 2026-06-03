import { useRouter } from 'next/router';
import Link from 'next/link';

export default function DigitalProduct() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ fontFamily: 'Tahoma', textAlign: 'center', padding: '4rem' }}>
      <h1>محصول #{id}</h1>
      <p>جزئیات و دموی این محصول به‌زودی اضافه می‌شود.</p>
      <Link href="/" style={{ color: '#2563eb' }}>بازگشت به فروشگاه</Link>
    </div>
  );
}
