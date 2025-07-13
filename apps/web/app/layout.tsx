import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { Viewport } from 'next';
import '@repo/ui/styles.css';
import '../styles/global.css';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import { Toaster } from '@repo/ui/components/Toast/Sonner';

const geistSans = localFont({
  src: '../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: '../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: '가장 가까운 경매장 | Bider',
  description: '내 근처 가장 가까운 경매장, Bider',
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <div id="container" className="flex min-h-screen flex-col">
            {/* 'pb-헤더높이'로 수정 */}

            {children}
          </div>
        </ReactQueryProvider>

        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
