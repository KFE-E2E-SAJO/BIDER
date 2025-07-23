import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProd = process.env.NODE_ENV === 'production';

if (dsn && isProd) {
  Sentry.init({
    dsn,
    integrations: [Sentry.replayIntegration(), Sentry.captureConsoleIntegration()],
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
    environment: process.env.NODE_ENV,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
