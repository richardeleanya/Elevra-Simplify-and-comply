export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
    SENTRY_DSN: process.env.SENTRY_DSN || ''
  }
});