/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // غیرفعال کردن کامل File Watching برای جلوگیری از خطاهای EACCES در Termux
      config.watch = false;
      config.watchOptions = {
        ignored: ['/data/**', '/**/node_modules', '/**/.git'],
        poll: false,
      };
    }
    config.cache = false;
    // غیرفعال کردن لاگ‌های سطح info و warning
    config.infrastructureLogging = { level: 'error' };
    config.stats = 'errors-only';
    return config;
  },
};
export default nextConfig;
