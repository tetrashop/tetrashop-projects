/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = { ignored: ['/data/**', '/**/node_modules'] };
    }
    return config;
  },
};
export default nextConfig;
