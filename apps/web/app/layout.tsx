import type { Metadata } from 'next';
import type { Viewport } from 'next';
import '@repo/ui/styles.css';
import '../styles/global.css';
// import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import { Toaster } from '@repo/ui/components/Toast/Sonner';
import Script from 'next/script';

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
        url: '/ios/apple-splash-640x1136.png',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/ios/apple-splash-750x1334.png',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/ios/apple-splash-1242x2208.png',
        media:
          '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/ios/apple-splash-828x1792.png',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/ios/apple-splash-1125x2436.png',
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/ios/apple-splash-1170x2532.png',
        media:
          '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/ios/apple-splash-1179x2556.png',
        media:
          '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/ios/apple-splash-1290x2796.png',
        media:
          '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/ios/apple-splash-1080x2340.png',
        media:
          '(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/ios/apple-splash-1242x2688.png',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/ios/apple-splash-1536x2008.png',
        media:
          '(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
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
        <div className="bg-neutral-0 mx-auto my-0 max-w-[600px]">
          {/* <ReactQueryProvider> */}
          <div id="container" className="flex min-h-screen flex-col">
            {children}
          </div>
          {/* </ReactQueryProvider> */}
          <Toaster />
        </div>
        {process.env.NODE_ENV === 'production' && (
          <Script id="clarity-script" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "skh5la3rrt");
            `}
          </Script>
        )}
      </body>
    </html>
  );
};

export default RootLayout;
