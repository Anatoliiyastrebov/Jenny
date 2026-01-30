import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/locale';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Дженни - Ваш wellness-консультант | Онлайн-анкетирование по здоровью',
  description: 'Дженни, ваш wellness-консультант. Профессиональная система онлайн-анкетирования в сфере здоровья',
  keywords: 'здоровье, wellness, анкетирование, консультация, Дженни',
  authors: [{ name: 'Jenny Wellness Consultant' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: 'en_US',
    title: 'Дженни - Ваш wellness-консультант',
    description: 'Профессиональная система онлайн-анкетирования в сфере здоровья',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
              {children}
            </main>
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}

