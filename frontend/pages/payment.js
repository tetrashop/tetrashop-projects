import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';

export default function PaymentResult() {
  const router = useRouter();
  const { status, refId } = router.query;

  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: 60 }}>
        {status === 'success' ? (
          <>
            <h1 style={{ color: '#059669' }}>✅ پرداخت موفقیت‌آمیز بود</h1>
            <p>شماره پیگیری: {refId}</p>
          </>
        ) : (
          <>
            <h1 style={{ color: '#dc2626' }}>❌ پرداخت ناموفق بود</h1>
            <p>متأسفانه پرداخت شما انجام نشد. لطفاً دوباره تلاش کنید.</p>
          </>
        )}
        <a href="/" style={{ color: '#2563eb' }}>بازگشت به فروشگاه</a>
      </div>
    </Layout>
  );
}
