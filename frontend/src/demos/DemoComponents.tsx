import BotDemo from './BotDemo.tsx';
import ChessDemo from './ChessDemo.tsx';
import AiDemo from './AiDemo.tsx';
import FinanceDemo from './FinanceDemo.tsx';
import PlatformDemo from './PlatformDemo.tsx';
import digitalProducts from '../data/digitalProducts.json';

export default function DemoComponent({ productId }) {
  const product = digitalProducts.find(p => p.id === productId);
  if (!product) return <p className="text-red-500 text-center mt-4">محصول یافت نشد.</p>;
  const cat = product.category;
  if (cat === 'bot') return <BotDemo />;
  if (cat === 'game') return <ChessDemo />;
  if (cat === 'ai') return <AiDemo />;
  if (cat === 'finance') return <FinanceDemo />;
  if (cat === 'platform' || cat === 'management') return <PlatformDemo />;
  return <p className="text-center mt-8 text-gray-500">نسخه نمایشی برای این محصول آماده نیست.</p>;
}