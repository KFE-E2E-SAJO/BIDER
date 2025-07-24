import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProd = process.env.NODE_ENV === 'production';

if (dsn && isProd) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1,
    debug: false,
    environment: process.env.NODE_ENV,
  });
}
