/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};
export default nextConfig;
