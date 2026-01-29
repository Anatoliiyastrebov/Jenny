export type Locale = 'ru' | 'en';

export const locales: Locale[] = ['ru', 'en'];
export const defaultLocale: Locale = 'ru';

export const translations = {
  ru: {
    common: {
      title: 'Онлайн-анкетирование по здоровью',
      selectLanguage: 'Язык',
      submit: 'Отправить',
      back: 'Назад',
      next: 'Далее',
      loading: 'Загрузка...',
      required: 'Обязательное поле',
      optional: 'Необязательно',
      uploadFile: 'Загрузить файл',
      removeFile: 'Удалить',
      selectFile: 'Выберите файл',
      filesSelected: 'файлов выбрано',
      progress: 'Прогресс',
      privacyNotice: 'Конфиденциальность',
      privacyText: 'Ваши данные будут отправлены в защищённую группу Telegram. Мы не храним ваши персональные данные на сервере.',
      agreeAndSubmit: 'Я согласен и хочу отправить',
      success: 'Анкета успешно отправлена!',
      error: 'Произошла ошибка. Попробуйте позже.',
    },
    nav: {
      home: 'Главная',
      women: 'Женская анкета',
      men: 'Мужская анкета',
      infant: 'Анкета для младенца',
      child: 'Детская анкета',
      recommendation: 'Анкета по рекомендации',
    },
    forms: {
      personalData: 'Личные данные',
      health: 'Здоровье',
      additional: 'Дополнительно',
    },
  },
  en: {
    common: {
      title: 'Online Health Questionnaire',
      selectLanguage: 'Language',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      loading: 'Loading...',
      required: 'Required field',
      optional: 'Optional',
      uploadFile: 'Upload file',
      removeFile: 'Remove',
      selectFile: 'Select file',
      filesSelected: 'files selected',
      progress: 'Progress',
      privacyNotice: 'Privacy',
      privacyText: 'Your data will be sent to a secure Telegram group. We do not store your personal data on the server.',
      agreeAndSubmit: 'I agree and want to submit',
      success: 'Questionnaire submitted successfully!',
      error: 'An error occurred. Please try again later.',
    },
    nav: {
      home: 'Home',
      women: "Women's Questionnaire",
      men: "Men's Questionnaire",
      infant: 'Infant Questionnaire',
      child: "Children's Questionnaire",
      recommendation: 'Recommendation Questionnaire',
    },
    forms: {
      personalData: 'Personal Data',
      health: 'Health',
      additional: 'Additional',
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

