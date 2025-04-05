const nextConfig = {
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
  serverExternalPackages: ['@vercel/postgres'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  }
};
module.exports = nextConfig; 