export default function About() {
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <h1 style={{ color: '#059669', marginBottom: '1rem' }}>درباره TetraShop</h1>
      <p style={{ lineHeight: '1.8', color: '#4b5563' }}>
        TetraShop یک پلتفرم جامع فروشگاهی است که محصولات فیزیکی و دیجیتال را در یک اکوسیستم یکپارچه ارائه می‌دهد.
        این پروژه با بهره‌گیری از Next.js، React و Vercel ساخته شده و شامل ماژول‌های متعددی از جمله ربات بله، شطرنج، تحلیل احساسات، داشبورد مالی و پنل مدیریت می‌باشد.
      </p>
      <h2 style={{ marginTop: '2rem', color: '#333' }}>تماس با ما</h2>
      <p>📧 ایمیل: support@tetrashop.ir</p>
      <p>📱 تلگرام: @tetrashop_support</p>
      <p style={{ marginTop: '2rem' }}><strong>توسعه‌دهنده:</strong> رامین اجلال</p>
      <p><strong>نسخه:</strong> ۳.۱</p>
    </div>
  );
}
