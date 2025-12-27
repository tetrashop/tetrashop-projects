import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'پلتفرم NLP - TetraSaaS',
  description: 'پروژه‌های پردازش زبان طبیعی',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`} style={{direction: 'rtl', textAlign: 'right'}}>
        {/* هدر با منوی کامل */}
        <header style={{padding: '1rem', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto'}}>
            <div style={{fontWeight: 'bold', fontSize: '1.25rem'}}>🧠 پلتفرم TetraSaaS</div>
            <nav style={{display: 'flex', gap: '1.5rem'}}>
              <a href="/" style={{color: '#4b5563'}} className="hover:text-blue-600">خانه</a>
              <a href="/nlp" style={{color: '#4b5563'}} className="hover:text-blue-600">پروژه‌ها</a>
              <a href="/services" style={{color: '#3b82f6', fontWeight: '500'}} className="hover:text-blue-700">سرویس‌ها</a>
            </nav>
          </div>
        </header>
        <main style={{padding: '1rem', maxWidth: '1200px', margin: '0 auto'}}>
          {children}
        </main>
        {/* فوتر ساده */}
        <footer style={{padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', borderTop: '1px solid #e5e7eb', marginTop: '2rem'}}>
          <p>© ۱۴۰۳ TetraSaaS - تمامی حقوق محفوظ است</p>
        </footer>
      </body>
    </html>
  )
}
