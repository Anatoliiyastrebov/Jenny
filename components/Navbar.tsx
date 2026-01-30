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
        const logoElement = container.querySelector('a[href="/"]') as HTMLElement;
        const languageSwitcherElement = container.querySelector('[data-language-switcher]') as HTMLElement;
        
        const logoWidth = logoElement?.getBoundingClientRect().width || 200;
        const languageSwitcherWidth = languageSwitcherElement?.getBoundingClientRect().width || 80;
        const gaps = 80; // отступы между элементами (gap-2 sm:gap-3 lg:gap-6 + ml-4)
        const padding = 32; // дополнительные отступы для безопасности
        const availableWidth = containerWidth - logoWidth - languageSwitcherWidth - gaps - padding;

        const allItems = Array.from(itemsContainer.children) as HTMLElement[];
        if (allItems.length === 0) {
          setVisibleItems(4);
          return;
        }

        // Находим индекс активной анкеты
        const activeIndex = navItems.slice(1).findIndex(item => pathname === item.href);
        const activeItemIndex = activeIndex >= 0 ? activeIndex : -1;

        // Сначала проверяем, помещаются ли все элементы
        let totalWidth = 0;
        for (let i = 0; i < allItems.length; i++) {
          const itemWidth = allItems[i].offsetWidth;
          const gap = i > 0 ? 8 : 0; // gap между элементами (gap-2 lg:gap-4)
          totalWidth += itemWidth + gap;
        }

        // Если все помещаются, показываем все
        if (totalWidth <= availableWidth) {
          setVisibleItems(4);
          return;
        }

        // Если не все помещаются, всегда показываем активную анкету
        // и добавляем остальные, если помещаются
        let visibleCount = 0;
        let currentWidth = 0;
        const gapSize = 8;

        // Сначала добавляем активную анкету, если она есть
        if (activeItemIndex >= 0) {
          const activeItem = allItems[activeItemIndex];
          if (activeItem) {
            currentWidth += activeItem.offsetWidth;
            visibleCount = 1;
          }
        }

        // Затем добавляем остальные анкеты по порядку
        for (let i = 0; i < allItems.length; i++) {
          if (i === activeItemIndex) continue; // Пропускаем активную, она уже добавлена
          
          const itemWidth = allItems[i].offsetWidth;
          const gap = visibleCount > 0 ? gapSize : 0;
          
          if (currentWidth + itemWidth + gap <= availableWidth) {
            currentWidth += itemWidth + gap;
            visibleCount++;
          } else {
            break;
          }
        }

        // Если активная анкета не была добавлена (не поместилась), добавляем её принудительно
        if (activeItemIndex >= 0 && visibleCount === 0) {
          visibleCount = 1;
        }

        setVisibleItems(Math.max(visibleCount, activeItemIndex >= 0 ? 1 : 0));
      }, 50);
    };

    // Проверяем сразу и при изменении размера
    checkVisibility();
    const resizeTimeout = setTimeout(checkVisibility, 100);
    window.addEventListener('resize', checkVisibility);
    
    // Используем ResizeObserver для более точного отслеживания
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      setTimeout(checkVisibility, 50);
    });
    if (navContainerRef.current) {
      resizeObserver.observe(navContainerRef.current);
    }

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', checkVisibility);
      resizeObserver.disconnect();
    };
  }, [pathname, locale, t.nav]);

  return (
    <nav className="bg-white shadow-sm border-b border-medical-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6" ref={navContainerRef}>
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-w-0">
            <div className="text-xl sm:text-2xl flex-shrink-0">✨</div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-semibold text-medical-900 truncate">
                Дженни
              </div>
              <div className="text-xs text-medical-600 hidden sm:block truncate">ваш wellness-консультант</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 flex-1 min-w-0 justify-end ml-4">
            {pathname !== '/' && (
              <div 
                ref={navItemsRef}
                className="hidden md:flex items-center gap-2 lg:gap-4 flex-shrink-0 overflow-hidden"
              >
                {(() => {
                  const items = navItems.slice(1);
                  const activeIndex = items.findIndex(item => pathname === item.href);
                  
                  // Если есть активная анкета, показываем её первой
                  if (activeIndex >= 0) {
                    const activeItem = items[activeIndex];
                    const otherItems = items.filter((_, i) => i !== activeIndex);
                    const visibleOtherItems = otherItems.slice(0, Math.max(0, visibleItems - 1));
                    
                    return [
                      <Link
                        key={activeItem.href}
                        href={activeItem.href}
                        className="text-xs sm:text-sm font-medium transition-colors px-2 sm:px-3 py-1.5 rounded-md whitespace-nowrap flex-shrink-0 bg-primary-600 text-white"
                      >
                        {activeItem.label}
                      </Link>,
                      ...visibleOtherItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-xs sm:text-sm font-medium transition-colors px-2 sm:px-3 py-1.5 rounded-md whitespace-nowrap flex-shrink-0 text-medical-700 hover:bg-medical-100 hover:text-primary-600"
                        >
                          {item.label}
                        </Link>
                      ))
                    ];
                  }
                  
                  // Если активной анкеты нет, показываем первые visibleItems
                  return items.slice(0, visibleItems).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-xs sm:text-sm font-medium transition-colors px-2 sm:px-3 py-1.5 rounded-md whitespace-nowrap flex-shrink-0 text-medical-700 hover:bg-medical-100 hover:text-primary-600"
                    >
                      {item.label}
                    </Link>
                  ));
                })()}
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

