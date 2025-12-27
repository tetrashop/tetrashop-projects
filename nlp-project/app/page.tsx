export default function Home() {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: 'white'
    }}>
      <h1 style={{color: 'black', fontSize: '2rem', marginBottom: '1rem'}}>
        تست صفحه - پروژه NLP
      </h1>
      <p style={{color: '#333', marginBottom: '1.5rem'}}>
        اگر این متن را می‌بینید، Next.js در حال اجراست.
      </p>
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        display: 'inline-block',
        fontWeight: 'bold'
      }}>
        <a href="/nlp" style={{color: 'white', textDecoration: 'none'}}>
          رفتن به صفحه پروژه‌ها
        </a>
      </div>
    </div>
  )
}
