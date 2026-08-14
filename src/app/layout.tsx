import { Doto, Geist_Mono, Noto_Sans_JP } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
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
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
