'use client';

import { useLocale } from '@/lib/locale';
import { Locale } from '@/lib/i18n';
import { motion } from 'framer-motion';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2 bg-white rounded-md p-1 shadow-sm border border-medical-200">
      <button
        onClick={() => setLocale('ru')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === 'ru'
            ? 'bg-primary-600 text-white'
            : 'bg-transparent text-medical-700 hover:bg-medical-100'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-primary-600 text-white'
            : 'bg-transparent text-medical-700 hover:bg-medical-100'
        }`}
      >
        EN
      </button>
    </div>
  );
}

