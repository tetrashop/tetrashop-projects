import { useRouter } from 'next/router';
export default function Product() {
  const router = useRouter();
  const { id } = router.query;
  return <div style={{ fontFamily: 'Tahoma', textAlign: 'center', padding: 60 }}><h1>محصول #{id}</h1><a href="/">بازگشت</a></div>;
}
