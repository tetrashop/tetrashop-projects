// pages/_app.js
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // تا زمانی که روی کلاینت نباشیم، چیزی نمایش نده
  if (!isClient) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'system-ui'
      }}>
        در حال بارگذاری...
      </div>
    );
  }

  return <Component {...pageProps} />;
}

export default MyApp;
