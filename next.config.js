/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  serverExternalPackages: ['@neondatabase/serverless'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  }
};
module.exports = nextConfig; 