import type { Metadata } from 'next';
import { Libre_Baskerville } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre-baskerville',
  subsets: ['latin'],
  weight: ['400', '700'],
});


export const metadata: Metadata = {
  title: 'The Scholar - Easy Religious Knowledge',
  description: 'Get answers to your religious questions from knowledgeable sources.',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${libreBaskerville.className} antialiased`}>
        <ThemeProvider>
          
          {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
