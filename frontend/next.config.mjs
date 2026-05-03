/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = { ignored: ['/data/**', '/**/node_modules'] };
    }
    // غیرفعال کردن کش برای جلوگیری از کرش
    config.cache = false;
    return config;
  },
};
export default nextConfig;
