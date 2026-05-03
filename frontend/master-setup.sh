#!/bin/bash
set -e
YELLOW='\033[1;33m'; GREEN='\033[0;32m'; NC='\033[0m'
BASE=~/tetrashop-projects
FRONTEND=$BASE/frontend
cd $FRONTEND

echo -e "${YELLOW}[1/8] کشتن پروسه‌های قدیمی${NC}"
pkill -9 node 2>/dev/null || true; sleep 1

echo -e "${YELLOW}[2/8] نصب پکیج‌های ضروری${NC}"
npm install next@latest react@latest react-dom@latest zustand tailwindcss postcss autoprefixer

echo -e "${YELLOW}[3/8] تولید inventory پروژه‌های دیجیتال${NC}"
cat > build-inventory.cjs << 'EOFJS'
const fs = require('fs');
const path = require('path');
const BASE = process.env.HOME + '/tetrashop-projects';

const projectPaths = [
  'bots/bale_tetrashop.py','bots/bale-bot.py','bots/atlas_bot.py','bots/tetrashop.py',
  'bots/tetrashop_bridge.py','bots/tetrashop_health_check.py',
  'ml-services/nlp-gateway-clean','ml-services/nlp-project-fixed','ml-services/ocr-service',
  'games/chess-engine','games/chess-integrated','games/chess-premium',
  'speech-recognition','writer','voice-recognition',
  'tetrashop-vercel','tetrashop-production','tetra-saas-platform','tetra-error-system',
  'user-management','payment','api','gateway','services','cms','admin','dashboard',
  'client-sdk','cloud-server','quantum-calligraphy-advanced','quantum-writer',
  'common-rhetoric-pro','aman-secret-cluster','secret-garden','wish-garden',
  'infrastructure','algorithms','apps','modules','2d-to-3d-real'
];

const results = [];
for (const rel of projectPaths) {
  const full = path.join(BASE, rel);
  if (!fs.existsSync(full)) continue;

  const isFile = fs.statSync(full).isFile();
  const dir = isFile ? path.dirname(full) : full;
  let name = path.basename(rel, path.extname(rel)).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  let type = 'Other';
  let main = '';
  let category = 'other';

  if (rel.startsWith('bots')) category = 'bot';
  else if (rel.startsWith('ml-services') || rel.includes('speech') || rel.includes('voice') || rel.includes('ocr')) category = 'ai';
  else if (rel.startsWith('games')) category = 'game';
  else if (rel.startsWith('tetrashop') || rel.startsWith('tetra')) category = 'platform';
  else if (rel.includes('payment') || rel.includes('wallet') || rel.includes('binance')) category = 'finance';
  else if (rel.includes('user') || rel.includes('admin') || rel.includes('dashboard')) category = 'management';

  if (isFile && full.endsWith('.py')) { type = 'Python'; main = path.basename(full); }
  else if (fs.existsSync(path.join(dir,'package.json'))) { type = 'Node.js'; main = 'npm start'; }
  else if (fs.existsSync(path.join(dir,'requirements.txt'))) { type = 'Python'; main = 'python main.py'; }
  else if (fs.existsSync(path.join(dir,'composer.json'))) { type = 'PHP'; main = 'php artisan serve'; }

  const readmePath = path.join(dir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    try {
      fs.writeFileSync(readmePath, `# ${name}\n\nDigital product from TetraShop.\n## Type: ${type}\n## Usage\n- Main: ${main}\n`);
    } catch (err) {}
  }

  let desc = '';
  try {
    const lines = fs.readFileSync(readmePath, 'utf8').split('\n');
    desc = lines.filter(l => l && !l.startsWith('#') && !l.startsWith('##'))[0] || 'Digital tool';
  } catch {
    desc = 'Digital tool';
  }

  const price = 99000;
  results.push({
    id: rel.replace(/[\/._]/g, '-'),
    name,
    description: desc,
    type,
    price,
    category,
    image: `https://picsum.photos/seed/${Buffer.from(rel).toString('hex').slice(0,8)}/400/400`
  });
}

const outPath = path.join(process.env.HOME, 'tetrashop-projects/frontend/src/data/digitalProducts.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log('Digital products JSON created');
EOFJS
node build-inventory.cjs

echo -e "${YELLOW}[4/8] ساخت دموهای تعاملی برای هر محصول${NC}"
mkdir -p src/demos

# فایل مرکزی دموها
cat > src/demos/DemoComponents.tsx << 'DEMOLIST'
import BaleBotDemo from './BaleBotDemo';
import ChessDemo from './ChessDemo';
import NlpDemo from './NlpDemo';
import OcrDemo from './OcrDemo';
import SpeechDemo from './SpeechDemo';
import FinanceDashboard from './FinanceDashboard';
import PlatformDashboard from './PlatformDashboard';

interface DemoComponentProps {
  productId: string;
}

const DemoMap: Record<string, React.FC<DemoComponentProps>> = {
  'bots': BaleBotDemo,
  'bale': BaleBotDemo,
  'chess': ChessDemo,
  'nlp': NlpDemo,
  'ocr': OcrDemo,
  'speech': SpeechDemo,
  'voice': SpeechDemo,
  'finance': FinanceDashboard,
  'platform': PlatformDashboard,
  'management': PlatformDashboard,
};

export default function DemoComponent({ productId }: { productId: string }) {
  // یافتن category از digitalProducts.json
  import digitalProducts from '../data/digitalProducts.json';
  const product = digitalProducts.find((p: any) => p.id === productId);
  if (!product) return <p>محصول یافت نشد.</p>;

  const cat = product.category || 'other';
  for (const [key, Comp] of Object.entries(DemoMap)) {
    if (productId.includes(key) || cat === key) {
      return <Comp productId={productId} />;
    }
  }
  return <p>نسخه نمایشی برای این محصول آماده نیست.</p>;
}
DEMOLIST

# ربات بله
cat > src/demos/BaleBotDemo.tsx << 'BALE'
import { useState } from 'react';

export default function BaleBotDemo({ productId }: { productId: string }) {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const botReply = getBotReply(input);
    setMessages([...messages, { user: input, bot: botReply }]);
    setInput('');
  };

  return (
    <div className="border rounded-2xl p-4 bg-gray-50 max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">🤖 ربات فروشگاهی</h3>
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i}>
            <p className="text-blue-600 font-semibold">👤 {m.user}</p>
            <p className="text-green-600">{m.bot}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded p-2" placeholder="پیام خود را بنویسید..." />
        <button onClick={send} className="bg-blue-500 text-white px-4 rounded">ارسال</button>
      </div>
    </div>
  );
}

function getBotReply(msg: string): string {
  if (msg.includes('محصول')) return 'محصولات ما شامل ساعت هوشمند، هدفون و کتاب است.';
  if (msg.includes('قیمت')) return 'قیمت‌ها از ۱۹۵٬۰۰۰ تومان شروع می‌شود.';
  return 'سلام! من ربات پشتیبانی هستم. چطور می‌توانم کمک کنم؟';
}
BALE

# شطرنج
cat > src/demos/ChessDemo.tsx << 'CHESS'
import { useState } from 'react';

export default function ChessDemo({ productId }: { productId: string }) {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [move, setMove] = useState('');
  const [status, setStatus] = useState('حرکت سفید');

  const makeMove = () => {
    if (!move.trim()) return;
    // حرکت ساده: فقط پیاده‌های e2-e4 یا d2-d4 را شبیه‌سازی می‌کنیم
    if (move === 'e4' && fen.includes('PPPP')) {
      setFen('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
      setStatus('حرکت سیاه');
    } else if (move === 'e5' && fen.includes('pppp')) {
      setFen('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2');
      setStatus('حرکت سفید');
    } else {
      setStatus('حرکت نامعتبر!');
    }
    setMove('');
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <div className="bg-amber-100 p-4 rounded-2xl text-center font-mono mb-4">
        <pre className="text-xs">{`  a b c d e f g h
8 r n b q k b n r 8
7 p p p p p p p p 7
6 - - - - - - - - 6
5 - - - - - - - - 5
4 - - - - P - - - 4
3 - - - - - - - - 3
2 P P P P - P P P 2
1 R N B Q K B N R 1
  a b c d e f g h`}</pre>
        <p className="mt-2 font-bold">{status}</p>
      </div>
      <div className="flex gap-2">
        <input value={move} onChange={(e) => setMove(e.target.value)} className="border rounded p-2 flex-1" placeholder="مثلاً e4" />
        <button onClick={makeMove} className="bg-green-600 text-white px-4 rounded">حرکت</button>
      </div>
      <p className="text-xs text-gray-500 mt-2">نسخه نمایشی – فقط e4/e5</p>
    </div>
  );
}
CHESS

# NLP
cat > src/demos/NlpDemo.tsx << 'NLP'
import { useState } from 'react';

export default function NlpDemo({ productId }: { productId: string }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const analyze = () => {
    if (!text.trim()) return;
    const sentiment = Math.random() > 0.5 ? 'مثبت' : 'منفی';
    setResult(`احساس: ${sentiment} – کلمات کلیدی: ${text.split(' ').slice(0,2).join(', ')}`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">🧠 تحلیل احساسات</h3>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full border rounded p-2 mb-2" placeholder="متن فارسی وارد کنید..." rows={3} />
      <button onClick={analyze} className="bg-purple-600 text-white px-4 py-2 rounded">تحلیل</button>
      {result && <p className="mt-4 p-3 bg-gray-100 rounded">{result}</p>}
    </div>
  );
}
NLP

# OCR
cat > src/demos/OcrDemo.tsx << 'OCR'
import { useState } from 'react';

export default function OcrDemo({ productId }: { productId: string }) {
  const [uploaded, setUploaded] = useState(false);
  const [resultText, setResultText] = useState('');

  const simulateOCR = () => {
    setUploaded(true);
    setResultText('متن استخراج‌شده: «سلام، این یک تست OCR است.»');
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h3 className="text-lg font-bold mb-4">🔍 تشخیص متن</h3>
      <div className="border-dashed border-2 border-gray-300 rounded-2xl p-8 text-center cursor-pointer" onClick={simulateOCR}>
        {!uploaded ? (
          <p>برای آپلود عکس کلیک کنید</p>
        ) : (
          <p className="text-green-600">عکس دریافت شد</p>
        )}
      </div>
      {resultText && <p className="mt-4 p-3 bg-gray-100 rounded">{resultText}</p>}
    </div>
  );
}
OCR

# Speech Recognition
cat > src/demos/SpeechDemo.tsx << 'SPEECH'
import { useState } from 'react';

export default function SpeechDemo({ productId }: { productId: string }) {
  const [listening, setListening] = useState(false);
  const [recognized, setRecognized] = useState('');

  const start = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setRecognized('سلام، خوش آمدید');
    }, 2000);
  };

  return (
    <div className="p-4 text-center">
      <h3 className="text-lg font-bold mb-4">🎤 تشخیص گفتار</h3>
      <button
        onClick={start}
        disabled={listening}
        className={`px-6 py-3 rounded-full text-white ${listening ? 'bg-red-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {listening ? 'در حال گوش دادن...' : 'شروع'}
      </button>
      {recognized && <p className="mt-4 text-xl font-semibold">{recognized}</p>}
    </div>
  );
}
SPEECH

# Finance Dashboard
cat > src/demos/FinanceDashboard.tsx << 'FINANCE'
export default function FinanceDashboard({ productId }: { productId: string }) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">📈 داشبورد مالی</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">موجودی</p>
          <p className="text-2xl font-bold">۲٬۵۰۰٬۰۰۰</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">معاملات امروز</p>
          <p className="text-2xl font-bold">۱۲</p>
        </div>
      </div>
      <div className="mt-4 bg-gray-100 h-32 rounded flex items-center justify-center">
        <p>نمودار قیمت (نمونه)</p>
      </div>
    </div>
  );
}
FINANCE

# Platform Dashboard
cat > src/demos/PlatformDashboard.tsx << 'PLATFORM'
export default function PlatformDashboard({ productId }: { productId: string }) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">⚙️ پنل مدیریت</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">کاربران: ۱۲۰</div>
        <div className="bg-green-100 p-4 rounded">سفارش‌ها: ۳۴</div>
        <div className="bg-yellow-100 p-4 rounded">درآمد: ۱۲ میلیون</div>
      </div>
    </div>
  );
}
PLATFORM

echo -e "${YELLOW}[5/8] ایجاد صفحهٔ جزئیات محصولات دیجیتال${NC}"
cat > pages/digital/[id].tsx << 'DETAIL'
import { useRouter } from 'next/router';
import Navbar from '../../src/components/Navbar';
import digitalProducts from '../../src/data/digitalProducts.json';
import { formatPrice } from '../../src/utils/formatPrice';
import { useCartStore } from '../../src/store/cartStore';
import dynamic from 'next/dynamic';

const DemoComponent = dynamic(() => import('../../src/demos/DemoComponents'), { ssr: false });

const DigitalProduct = () => {
  const router = useRouter();
  const { id } = router.query;
  const product = digitalProducts.find((p: any) => p.id === id);
  const addItem = useCartStore(state => state.addItem);

  if (!product) return <p className="p-8 text-center">محصول یافت نشد.</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-2xl mb-6" />
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <span className="text-2xl font-bold text-emerald-600 mb-6 block">{formatPrice(product.price)} تومان</span>
        <button
          onClick={() => addItem({ id: parseInt(product.id, 36), name: product.name, description: product.description, price: product.price, image: product.image, category: 'digital' })}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg mb-8"
        >
          افزودن به سبد خرید
        </button>
        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">پیش‌نمایش تعاملی</h2>
          {id && <DemoComponent productId={id as string} />}
        </div>
      </div>
    </>
  );
};

export default DigitalProduct;
DETAIL

echo -e "${YELLOW}[6/8] به‌روزرسانی لیست محصولات دیجیتال (لینک به جزئیات)${NC}"
cat > pages/digital-products.tsx << 'LIST'
import Navbar from '../src/components/Navbar';
import digitalProducts from '../src/data/digitalProducts.json';
import { formatPrice } from '../src/utils/formatPrice';
import Link from 'next/link';

export default function DigitalProductsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">محصولات دیجیتال</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {digitalProducts.map((product: any) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <span className="text-sm text-gray-500 mb-3">نوع: {product.type}</span>
              <span className="text-2xl font-bold text-emerald-600 mb-4">{formatPrice(product.price)} تومان</span>
              <div className="flex gap-2 mt-auto">
                <Link href={`/digital/${product.id}`} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center">
                  مشاهده و دمو
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
LIST

echo -e "${YELLOW}[7/8] رفع باگ‌ها و تنظیمات نهایی${NC}"
cat > next.config.mjs << 'CONFIG'
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: ['/data/**', '/**/node_modules'],
      };
    }
    return config;
  },
};
export default nextConfig;
CONFIG
rm -f next.config.js next.config.cjs

sed -i 's/"dev": ".*"/"dev": "next dev --webpack -p 3002"/' package.json

cat > tailwind.config.js << 'TAILWIND'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
TAILWIND

echo -e "${YELLOW}[8/8] نصب نهایی و راه‌اندازی${NC}"
npm install
npm run dev
