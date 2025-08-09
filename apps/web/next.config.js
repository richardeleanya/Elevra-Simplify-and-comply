const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  rewrites: async () => [
    {
      source: '/api/auth/:path*',
      destination: process.env.API_URL + '/auth/:path*',
    },
    {
      source: '/api/payrolls/:path*',
      destination: process.env.API_URL + '/payrolls/:path*',
    },
    {
      source: '/api/payrolls',
      destination: process.env.API_URL + '/payrolls',
    },
    {
      source: '/api/salary-policies',
      destination: process.env.API_URL + '/salary-policies',
    },
  ],
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
});