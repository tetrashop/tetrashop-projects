import { useState } from 'react';

export default function SpeechDemo() {
  const [listening, setListening] = useState(false);
  const [recognized, setRecognized] = useState('');

  const start = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setRecognized('سلام، به فروشگاه خوش آمدید');
    }, 2500);
  };

  return (
    <div className="text-center p-8">
      <button
        onClick={start}
        disabled={listening}
        className={`px-8 py-4 rounded-full text-white text-lg transition ${
          listening ? 'bg-red-400 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {listening ? 'در حال گوش دادن...' : '🎤 شروع'}
      </button>
      {recognized && <p className="mt-6 text-2xl font-bold">{recognized}</p>}
    </div>
  );
}
