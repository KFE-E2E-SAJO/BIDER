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
  appleWebApp: {
    capable: true,
    title: 'Bider',
    statusBarStyle: 'default',
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
      <head>
        <link rel="apple-touch-icon" href="/ios/apple-touch-icon.png" />
        {/* iPhone SE  */}
        <link
          rel="apple-touch-startup-image"
          href="/ios/apple-splash-640x1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        />

        {/* iPhone 8  */}
        <link
          rel="apple-touch-startup-image"
          href="/ios/apple-splash-750x1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        />

        {/* iPhone 8 Plus  */}
        <link
          rel="apple-touch-startup-image"
          href="/ios/apple-splash-1242x2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
        />

        {/* iPhone 11  */}
        <link
          rel="apple-touch-startup-image"
          href="/ios/apple-splash-828x1792.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        />

        {/* iPhone X, 11 Pro  */}
        <link
          rel="apple-touch-startup-image"
          href="/ios/apple-splash-1125x2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        />

        {/* iPhone 12, 13, 14  */}
        <link
          rel="apple-touch-startup-image"
          href="/ios/apple-splash-1170x2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />

        {/* iPhone 14 Pro  */}
        <link
          rel="apple-touch-startup-image"
          href="/ios/apple-splash-1179x2556.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
        />

        {/* iPhone 14 Pro Max  */}
        <link
          rel="apple-touch-startup-image"
          href="/ios/apple-splash-1290x2796.png"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
        />
      </head>
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
