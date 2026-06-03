import { useRouter } from 'next/router';

export default function DigitalProduct() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div style={{ fontFamily: 'Tahoma', textAlign: 'center', padding: 60 }}>
      <h1>محصول #{id}</h1>
      <p>جزئیات محصول به‌زودی اضافه خواهد شد.</p>
      <a href="/" style={{ color: '#2563eb' }}>بازگشت به فروشگاه</a>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
      { params: { id: '3' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: {} };
}
