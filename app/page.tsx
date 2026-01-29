'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale';
import { getTranslations } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { locale } = useLocale();
  const t = getTranslations(locale);

  const questionnaires = [
    { href: '/questionnaire/women', label: t.nav.women, icon: '💃', color: 'from-pink-400 to-rose-500', emoji: '🌸' },
    { href: '/questionnaire/men', label: t.nav.men, icon: '💪', color: 'from-blue-400 to-cyan-500', emoji: '🔥' },
    { href: '/questionnaire/infant', label: t.nav.infant, icon: '👶', color: 'from-yellow-400 to-orange-500', emoji: '⭐' },
    { href: '/questionnaire/child', label: t.nav.child, icon: '🧒', color: 'from-green-400 to-emerald-500', emoji: '🎈' },
  ];

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-medical-900">
          {t.common.title}
        </h1>
        <p className="text-lg text-medical-700 max-w-2xl mx-auto font-medium mb-2">
          {t.common.consultant}
        </p>
        <p className="text-base text-medical-600 max-w-2xl mx-auto">
          {t.common.subtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questionnaires.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className="block"
            >
              <div className="relative p-6 bg-white rounded-lg shadow-sm border border-medical-200 hover:shadow-md hover:border-primary-300 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">{item.icon}</div>
                  <h2 className="text-xl font-semibold text-medical-900">
                    {item.label}
                  </h2>
                </div>
                <p className="text-sm text-medical-600">
                  {t.common.takeQuestionnaire} →
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-medical-50 border border-medical-200 rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <div className="text-2xl">🔒</div>
          <div>
            <h3 className="text-lg font-semibold text-medical-900 mb-2">
              {t.common.privacyNotice}
            </h3>
            <p className="text-sm text-medical-700 leading-relaxed">
              {t.common.privacyText}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

