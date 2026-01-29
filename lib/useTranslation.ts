import { useLocale } from './locale';
import { getTranslations } from './i18n';

export function useTranslation() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  return t;
}

