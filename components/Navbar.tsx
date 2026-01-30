'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale';
import { getTranslations } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Navbar() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const pathname = usePathname();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(4);

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/questionnaire/women', label: t.nav.women },
    { href: '/questionnaire/men', label: t.nav.men },
    { href: '/questionnaire/infant', label: t.nav.infant },
    { href: '/questionnaire/child', label: t.nav.child },
  ];

  useEffect(() => {
    if (pathname === '/' || !navContainerRef.current || !navItemsRef.current) {
      setVisibleItems(4);
      return;
    }

    const checkVisibility = () => {
      const container = navContainerRef.current;
      const itemsContainer = navItemsRef.current;
      if (!container || !itemsContainer) return;

      // Ждем, пока элементы отрендерятся
      setTimeout(() => {
        const containerWidth = container.offsetWidth;
        const logoWidth = container.querySelector('a[href="/"]')?.getBoundingClientRect().width || 200;
        const languageSwitcher = container.querySelector('[data-language-switcher]')?.getBoundingClientRect().width || 80;
        const gaps = 48; // отступы между элементами
        const availableWidth = containerWidth - logoWidth - languageSwitcher - gaps;

        const allItems = Array.from(itemsContainer.children) as HTMLElement[];
        if (allItems.length === 0) return;

        let totalWidth = 0;
        let visibleCount = 0;

        for (let i = 0; i < allItems.length; i++) {
          const itemWidth = allItems[i].offsetWidth;
          const gap = i > 0 ? 8 : 0; // gap между элементами
          if (totalWidth + itemWidth + gap <= availableWidth) {
            totalWidth += itemWidth + gap;
            visibleCount++;
          } else {
            break;
          }
        }

        setVisibleItems(visibleCount);
      }, 0);
    };

    // Проверяем сразу и при изменении размера
    checkVisibility();
    window.addEventListener('resize', checkVisibility);
    
    // Используем ResizeObserver для более точного отслеживания
    const resizeObserver = new ResizeObserver(checkVisibility);
    if (navContainerRef.current) {
      resizeObserver.observe(navContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkVisibility);
      resizeObserver.disconnect();
    };
  }, [pathname, locale, t.nav]);

  return (
    <nav className="bg-white shadow-sm border-b border-medical-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6" ref={navContainerRef}>
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="text-xl sm:text-2xl">✨</div>
            <div>
              <div className="text-lg sm:text-xl font-semibold text-medical-900">
                Дженни
              </div>
              <div className="text-xs text-medical-600 hidden sm:block">ваш wellness-консультант</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0 justify-end">
            {pathname !== '/' && (
              <div 
                ref={navItemsRef}
                className="hidden md:flex items-center gap-2 lg:gap-4 flex-shrink-0"
              >
                {navItems.slice(1).slice(0, visibleItems).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs sm:text-sm font-medium transition-colors px-2 sm:px-3 py-1.5 rounded-md whitespace-nowrap flex-shrink-0 ${
                      pathname === item.href
                        ? 'bg-primary-600 text-white'
                        : 'text-medical-700 hover:bg-medical-100 hover:text-primary-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex-shrink-0" data-language-switcher>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

