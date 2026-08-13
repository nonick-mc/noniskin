import { Geist_Mono, Noto_Sans_JP } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ja'
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', notoSansJP.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
