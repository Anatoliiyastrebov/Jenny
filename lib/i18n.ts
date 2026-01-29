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
      consultant: 'Дженни, ваш wellness-консультант',
      subtitle: 'Пройдите опрос и узнайте больше о своём здоровье',
      takeQuestionnaire: 'Пройти анкету',
      gdprTitle: 'Согласие на обработку персональных данных',
      gdprText: 'Я даю своё согласие на обработку моих персональных данных, указанных в данной анкете, в целях оказания консультационных услуг по вопросам здоровья и wellness. Я понимаю, что мои данные будут переданы в защищённую группу Telegram и не будут храниться на сервере. Я имею право отозвать своё согласие в любое время.',
      gdprRequired: 'Для отправки анкеты необходимо дать согласие на обработку персональных данных',
      gdprConsent: 'Я согласен(а) на обработку персональных данных',
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
      consultant: 'Jenny, your wellness consultant',
      subtitle: 'Take the questionnaire and learn more about your health',
      takeQuestionnaire: 'Take Questionnaire',
      gdprTitle: 'Consent to Personal Data Processing',
      gdprText: 'I give my consent to the processing of my personal data specified in this questionnaire for the purpose of providing health and wellness consulting services. I understand that my data will be sent to a secure Telegram group and will not be stored on the server. I have the right to withdraw my consent at any time.',
      gdprRequired: 'Consent to personal data processing is required to submit the questionnaire',
      gdprConsent: 'I agree to the processing of personal data',
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

