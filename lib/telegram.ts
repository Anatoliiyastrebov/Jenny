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
      console.log(`Sending ${submission.files.length} file(s) to Telegram...`);
      for (let i = 0; i < submission.files.length; i++) {
        const file = submission.files[i];
        console.log(`Sending file ${i + 1}/${submission.files.length}: ${file.name}`);
        await sendFileToTelegram(botToken, chatId, file);
        // Small delay between files to avoid rate limiting
        if (i < submission.files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      console.log('All files sent successfully');
    } else {
      console.log('No files to send');
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
    // Skip empty values, files, and gdprConsent (internal field)
    if (key === 'files' || key === 'gdprConsent' || !value || value === '') continue;
    
    const label = formatFieldLabel(key);
    let formattedValue = value;

    if (Array.isArray(value)) {
      formattedValue = value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
      formattedValue = JSON.stringify(value);
    } else if (typeof value === 'boolean') {
      formattedValue = value ? 'Да' : 'Нет';
    } else {
      formattedValue = String(value);
    }

    // Escape HTML special characters to prevent issues with Telegram HTML parsing
    formattedValue = String(formattedValue)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

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
  try {
    console.log(`Sending file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    
    // Convert File to Buffer for serverless environment
    let buffer: Buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      console.log(`File converted to buffer: ${buffer.length} bytes`);
    } catch (error) {
      console.error(`Error converting file to buffer:`, error);
      throw new Error(`Failed to read file ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    if (buffer.length === 0) {
      throw new Error(`File ${file.name} is empty`);
    }
    
    // Use form-data package for proper multipart/form-data encoding
    const FormDataModule = await import('form-data');
    const FormData = FormDataModule.default;
    const formData = new FormData();
    formData.append('chat_id', chatId);
    
    // Determine file type and use appropriate Telegram API method
    const fileType = file.type || '';
    const fileName = file.name.toLowerCase();
    const isImage = fileType.startsWith('image/') || 
                    /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName);
    const isVideo = fileType.startsWith('video/') || 
                    /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(fileName);
    
    let apiMethod = 'sendDocument';
    let fieldName = 'document';
    
    if (isImage) {
      apiMethod = 'sendPhoto';
      fieldName = 'photo';
      console.log(`Using sendPhoto for image file`);
    } else if (isVideo) {
      apiMethod = 'sendVideo';
      fieldName = 'video';
      console.log(`Using sendVideo for video file`);
    } else {
      console.log(`Using sendDocument for file`);
    }
    
    // Append file with proper field name
    // For images, Telegram accepts photo as Buffer directly
    // For documents, we need to specify filename
    if (isImage) {
      formData.append(fieldName, buffer, {
        filename: file.name,
        contentType: file.type || 'image/jpeg',
      });
    } else {
      formData.append(fieldName, buffer, {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
      });
    }

    // Add caption with file name (only for documents and videos)
    if (!isImage) {
      formData.append('caption', `📎 ${file.name}`);
    }

    const headers = formData.getHeaders();
    console.log(`Sending to Telegram API: ${apiMethod}, headers:`, Object.keys(headers));

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/${apiMethod}`,
      {
        method: 'POST',
        // @ts-ignore - form-data sets headers automatically
        body: formData as any,
        headers: headers,
      }
    );

    const responseText = await response.text();
    console.log(`Telegram API response status: ${response.status}`);
    console.log(`Telegram API response:`, responseText.substring(0, 200));

    if (!response.ok) {
      let errorMessage = `Failed to send file ${file.name}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.description || errorMessage;
        console.error('Telegram API error:', errorJson);
      } catch {
        errorMessage = responseText || errorMessage;
        console.error('Telegram API error (text):', responseText);
      }
      throw new Error(errorMessage);
    }
    
    const result = JSON.parse(responseText);
    if (result.ok) {
      console.log(`✅ File ${file.name} sent successfully`);
    } else {
      throw new Error(`Telegram API returned ok=false: ${result.description || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(`❌ Error sending file ${file.name}:`, error);
    throw error;
  }
}

