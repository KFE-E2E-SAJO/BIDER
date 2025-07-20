import type { Metadata } from 'next';
import type { Viewport } from 'next';
import '@repo/ui/styles.css';
import '../styles/global.css';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import { Toaster } from '@repo/ui/components/Toast/Sonner';

export const metadata: Metadata = {
  title: '가장 가까운 경매장 | Bider',
  description: '내 근처 가장 가까운 경매장, Bider',
  manifest: '/manifest.webmanifest',
  icons: {
    shortcut: '/ios/apple-touch-icon.png',
    apple: '/ios/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/ios/apple-touch-icon.png',
    },
  },
  appleWebApp: {
    capable: true,
    title: 'Bider',
    statusBarStyle: 'default',
    startupImage: [
      '/ios/apple-splash-768x1004.png',
      {
        url: '/ios/apple-splash-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          <div id="container" className="flex min-h-screen flex-col">
            {children}
          </div>
        </ReactQueryProvider>

        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
