'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale';
import { getTranslations } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/questionnaire/women', label: t.nav.women },
    { href: '/questionnaire/men', label: t.nav.men },
    { href: '/questionnaire/infant', label: t.nav.infant },
    { href: '/questionnaire/child', label: t.nav.child },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-medical-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-2xl">✨</div>
            <div>
              <div className="text-xl font-semibold text-medical-900">
                Дженни
              </div>
              <div className="text-xs text-medical-600">ваш wellness-консультант</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              {navItems.slice(1, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
                    pathname === item.href
                      ? 'bg-primary-600 text-white'
                      : 'text-medical-700 hover:bg-medical-100 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}

