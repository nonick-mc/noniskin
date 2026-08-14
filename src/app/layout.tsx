import { Doto, Geist_Mono, Noto_Sans_JP } from 'next/font/google';

import './globals.css';
import type { Metadata, Viewport } from 'next';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const doto = Doto({
  subsets: ['latin'],
  variable: '--font-doto',
});

export const metadata: Metadata = {
  title: 'noniskin',
  description: 'カスタムマント付きのスキンパックを作成するWebアプリ',
  metadataBase: new URL('https://skin.nonick.net'),
};

export const viewport: Viewport = {
  themeColor: '#0073f5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ja'
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        doto.variable,
        'font-sans',
        notoSansJP.variable,
      )}
    >
      <body className='dark'>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
