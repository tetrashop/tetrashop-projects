/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  compress: false,
  poweredByHeader: false,
  reactStrictMode: false,
  experimental: {
    forceSwcTransforms: true, // این خط را اضافه کنید
    optimizeCss: false,
    scrollRestoration: false,
  },
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
