export interface QuestionnaireSubmission {
  type: string;
  data: Record<string, any>;
  locale: string;
  files?: File[];
}

export async function sendToTelegram(submission: QuestionnaireSubmission): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error('Telegram credentials not configured');
  }

  try {
    // Format the message
    const message = formatMessage(submission);

    // Send text message first
    const textResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!textResponse.ok) {
      const error = await textResponse.text();
      throw new Error(`Telegram API error: ${error}`);
    }

    // Send files if any
    if (submission.files && submission.files.length > 0) {
      for (const file of submission.files) {
        await sendFileToTelegram(botToken, chatId, file);
      }
    }

    return true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    throw error;
  }
}

function formatMessage(submission: QuestionnaireSubmission): string {
  const { type, data, locale } = submission;
  const date = new Date().toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US');

  let message = `<b>📋 Новая анкета: ${type}</b>\n\n`;
  message += `<b>Язык:</b> ${locale === 'ru' ? 'Русский' : 'English'}\n`;
  message += `<b>Дата и время:</b> ${date}\n\n`;
  message += `<b>Данные:</b>\n`;

  // Format all fields
  for (const [key, value] of Object.entries(data)) {
    if (key === 'files' || !value || value === '') continue;
    
    const label = formatFieldLabel(key);
    let formattedValue = value;

    if (Array.isArray(value)) {
      formattedValue = value.join(', ');
    } else if (typeof value === 'object') {
      formattedValue = JSON.stringify(value);
    }

    message += `<b>${label}:</b> ${formattedValue}\n`;
  }

  if (submission.files && submission.files.length > 0) {
    message += `\n<b>Файлов прикреплено:</b> ${submission.files.length}`;
  }

  return message;
}

function formatFieldLabel(key: string): string {
  const labels: Record<string, string> = {
    firstName: 'Имя',
    lastName: 'Фамилия',
    age: 'Возраст',
    ageMonths: 'Возраст (месяцы)',
    weight: 'Вес',
    country: 'Страна',
    city: 'Город',
    waterIntake: 'Потребление воды',
    covid: 'Ковид/Вакцина',
    covidComplications: 'Осложнения после ковида',
    hair: 'Волосы',
    teeth: 'Зубы',
    digestion: 'Пищеварение',
    stones: 'Камни/Песок',
    operations: 'Операции',
    pressure: 'Давление',
    chronicDiseases: 'Хронические заболевания',
    headaches: 'Головные боли',
    numbness: 'Онемение',
    varicose: 'Варикоз/Геморрой',
    joints: 'Суставы',
    cysts: 'Кисты/Полипы',
    herpes: 'Герпес/Папилломы',
    menstruation: 'Месячные',
    lifestyle: 'Образ жизни',
    skin: 'Кожа',
    allergies: 'Аллергия',
    colds: 'Простуды',
    sleep: 'Сон',
    energy: 'Энергия',
    memory: 'Память',
    hasTests: 'Есть анализы/УЗИ',
    medications: 'Лекарства',
    cleansing: 'Очищение организма',
    additional: 'Дополнительно',
    mainProblem: 'Основная проблема',
    source: 'Источник',
    nightSweating: 'Потливость во сне',
    badBreath: 'Запах изо рта',
    skinIssues: 'Проблемы с кожей',
    injuries: 'Травмы',
    injuriesDetails: 'Детали травм',
    illnesses: 'Заболевания',
    birthType: 'Тип родов',
    toxemia: 'Токсикоз',
    motherAllergies: 'Аллергия у мамы',
    motherConstipation: 'Запор у мамы',
    motherAntibiotics: 'Антибиотики у мамы',
    motherAnemia: 'Анемия у мамы',
    pregnancyProblems: 'Проблемы при беременности',
    sweets: 'Сладости',
    hyperactivity: 'Гиперактивность',
    weightSatisfaction: 'Удовлетворенность весом',
    weightChange: 'Изменение веса',
    coldLimbs: 'Холодные конечности',
    moles: 'Родинки/Бородавки',
    name: 'Имя',
    contact: 'Контакт',
    message: 'Сообщение',
  };

  return labels[key] || key;
}

async function sendFileToTelegram(
  botToken: string,
  chatId: string,
  file: File
): Promise<void> {
  // Convert File to Buffer for serverless environment
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Use form-data package for proper multipart/form-data encoding
  const FormDataModule = await import('form-data');
  const FormData = FormDataModule.default;
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('document', buffer, {
    filename: file.name,
    contentType: file.type || 'application/octet-stream',
  });

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendDocument`,
    {
      method: 'POST',
      // @ts-ignore - form-data sets headers automatically
      body: formData as any,
      headers: formData.getHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send file: ${error}`);
  }
}

