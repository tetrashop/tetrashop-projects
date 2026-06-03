/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  compress: false, // غیرفعال کردن فشرده‌سازی در dev برای صرفه‌جویی در CPU
  poweredByHeader: false,
  reactStrictMode: false,
  
  // محدود کردن باندل‌های تولید شده
  experimental: {
    optimizeCss: false,
    scrollRestoration: false,
  },
  
  // غیرفعال کردن source maps در توسعه
  productionBrowserSourceMaps: false,
  
  async rewrites() {
    return [
      {
        source: '/api/nlp-proxy/:path*',
        destination: 'https://tetrashop-projects.vercel.app/api/nlp/:path*',
      },
    ]
  },
}

module.exports = nextConfig
