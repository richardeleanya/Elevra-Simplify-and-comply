/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  rewrites: async () => [
    {
      source: '/api/auth/:path*',
      destination: process.env.API_URL + '/auth/:path*',
    },
  ],
};

module.exports = nextConfig;