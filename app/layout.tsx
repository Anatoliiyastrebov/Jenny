import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/locale';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Дженни - Ваш wellness-консультант | Онлайн-анкетирование по здоровью',
  description: 'Дженни, ваш wellness-консультант. Профессиональная система онлайн-анкетирования в сфере здоровья',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <LocaleProvider>
          <div className="min-h-screen bg-medical-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
              {children}
            </main>
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}

