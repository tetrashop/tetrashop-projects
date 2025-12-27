import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import NLPHeader from '@/components/nlp/NLPHeader';
import NLPFooter from '@/components/nlp/NLPFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'پروژه‌های پردازش زبان طبیعی | Tetrashop',
  description: 'مجموعه‌ای جامع از پروژه‌های هوش مصنوعی در حوزه پردازش زبان فارسی و انگلیسی',
  keywords: ['NLP', 'هوش مصنوعی', 'پردازش متن', 'فارسی', 'پروژه'],
};

export default function NPLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen flex flex-col`}>
      <NLPHeader />
      <main className="flex-grow">
        {children}
      </main>
      <NLPFooter />
    </div>
  );
}
