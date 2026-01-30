import { NextRequest, NextResponse } from 'next/server';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    let type = formData.get('type') as string;
    const locale = formData.get('locale') as string;
    const dataJson = formData.get('data') as string;
    
    if (!type || !locale || !dataJson) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Преобразуем полное название анкеты в короткий ключ
    const typeMapping: Record<string, string> = {
      'Женская анкета': 'women',
      "Women's Questionnaire": 'women',
      'Мужская анкета': 'men',
      "Men's Questionnaire": 'men',
      'Анкета для младенца': 'infant',
      'Анкета для младенца (до 1 года)': 'infant',
      'Infant Questionnaire': 'infant',
      'Infant Questionnaire (up to 1 year)': 'infant',
      'Детская анкета': 'child',
      "Children's Questionnaire": 'child',
    };
    
    type = typeMapping[type] || type;

    let data;
    try {
      data = JSON.parse(dataJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON data' },
        { status: 400 }
      );
    }
    
    // Логирование для отладки
    console.log('Received type:', type);
    console.log('Received locale:', locale);
    console.log('Received data keys:', Object.keys(data));
    console.log('Data sample:', JSON.stringify(data).substring(0, 500));

    // Check Telegram credentials
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, error: 'Telegram credentials not configured' },
        { status: 500 }
      );
    }

    // Format and send text message first
    const message = formatQuestionnaireMessage(type, data, locale);
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
      const errorText = await textResponse.text();
      return NextResponse.json(
        { success: false, error: `Failed to send message: ${errorText}` },
        { status: 500 }
      );
    }

    // Collect and send files
    const fileCount = parseInt(formData.get('fileCount') as string) || 0;
    const fileErrors: string[] = [];

    for (let i = 0; i < fileCount; i++) {
      const fileEntry = formData.get(`file_${i}`);
      
      if (!fileEntry || !(fileEntry instanceof File)) {
        continue;
      }

      const file = fileEntry;
      
      if (file.size === 0) {
        continue;
      }

      try {
        // Convert file to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create multipart/form-data manually for Telegram API
        // This ensures compatibility with Vercel serverless functions
        const boundary = `----WebKitFormBoundary${Date.now()}${Math.random().toString(36).substring(2, 15)}`;
        const parts: Buffer[] = [];
        
        // Add chat_id field
        parts.push(Buffer.from(`--${boundary}\r\n`));
        parts.push(Buffer.from(`Content-Disposition: form-data; name="chat_id"\r\n\r\n`));
        parts.push(Buffer.from(`${chatId}\r\n`));
        
        // Add document file
        parts.push(Buffer.from(`--${boundary}\r\n`));
        parts.push(Buffer.from(`Content-Disposition: form-data; name="document"; filename="${file.name}"\r\n`));
        parts.push(Buffer.from(`Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`));
        parts.push(buffer);
        parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));
        
        // Combine all parts
        const body = Buffer.concat(parts);

        // Send file to Telegram
        const fileResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/sendDocument`,
          {
            method: 'POST',
            headers: {
              'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body: body,
          }
        );

        if (!fileResponse.ok) {
          const errorText = await fileResponse.text();
          let errorMessage = `Failed to send file ${file.name}`;
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.description || errorMessage;
            console.error(`Telegram API error for ${file.name}:`, errorJson);
          } catch {
            errorMessage = errorText || errorMessage;
            console.error(`Telegram API error (text) for ${file.name}:`, errorText);
          }
          fileErrors.push(errorMessage);
        } else {
          console.log(`✅ File ${file.name} sent successfully`);
        }
      } catch (fileError) {
        const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown error';
        console.error(`Error processing file ${file.name}:`, errorMessage);
        fileErrors.push(`Failed to send file ${file.name}: ${errorMessage}`);
      }
    }

    if (fileErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: fileErrors.join('; ') },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

function formatQuestionnaireMessage(type: string, data: Record<string, any>, locale: string): string {
  const validLocale = (locale === 'ru' || locale === 'en') ? locale : 'ru';
  const date = new Date().toLocaleString(validLocale === 'ru' ? 'ru-RU' : 'en-US');
  const t = questionnaireTranslations[validLocale];
  
  // Определяем название анкеты на правильном языке
  const typeLabels: Record<string, { ru: string; en: string }> = {
    women: { ru: 'Женская анкета', en: "Women's Questionnaire" },
    men: { ru: 'Мужская анкета', en: "Men's Questionnaire" },
    infant: { ru: 'Анкета для младенца', en: 'Infant Questionnaire' },
    child: { ru: 'Детская анкета', en: "Children's Questionnaire" },
  };
  
  const typeLabel = typeLabels[type]?.[validLocale] || type;
  
  let message = `<b>📋 ${validLocale === 'ru' ? 'Новая анкета' : 'New Questionnaire'}: ${typeLabel}</b>\n\n`;
  message += `<b>${validLocale === 'ru' ? 'Язык' : 'Language'}:</b> ${validLocale === 'ru' ? 'Русский' : 'English'}\n`;
  message += `<b>${validLocale === 'ru' ? 'Дата и время' : 'Date and Time'}:</b> ${date}\n\n`;
  
  // Определяем порядок полей для каждой анкеты
  const fieldOrder = getFieldOrder(type);
  const personalDataFields = getPersonalDataFields(type);
  
  // Разделяем на личные данные и вопросы
  const personalData: Array<[string, any]> = [];
  const questions: Array<[string, any]> = [];
  
  // Сначала обрабатываем поля в правильном порядке из fieldOrder
  for (const key of fieldOrder) {
    if (key === 'files' || key === 'gdprConsent') continue;
    
    const value = data[key];
    // Проверяем, что значение существует и не пустое
    if (value === undefined || value === null || value === '') continue;
    
    if (personalDataFields.includes(key)) {
      personalData.push([key, value]);
    } else {
      questions.push([key, value]);
    }
  }
  
  // Также обрабатываем все остальные поля, которых нет в fieldOrder
  for (const [key, value] of Object.entries(data)) {
    if (key === 'files' || key === 'gdprConsent') continue;
    if (fieldOrder.includes(key)) continue; // Уже обработано
    if (value === undefined || value === null || value === '') continue;
    
    if (personalDataFields.includes(key)) {
      personalData.push([key, value]);
    } else {
      questions.push([key, value]);
    }
  }
  
  // Личные данные
  if (personalData.length > 0) {
    message += `<b>${validLocale === 'ru' ? 'Личные данные' : 'Personal Data'}:</b>\n`;
    for (const [key, value] of personalData) {
      const label = getFieldLabel(key, type, validLocale);
      const formattedValue = formatValue(value, validLocale);
      message += `<b>${label}:</b> ${formattedValue}\n`;
    }
    message += `\n`;
  }
  
  // Вопросы с нумерацией
  if (questions.length > 0) {
    message += `<b>${validLocale === 'ru' ? 'Вопросы' : 'Questions'}:</b>\n`;
    let questionNumber = 1;
    for (const [key, value] of questions) {
      const label = getFieldLabel(key, type, validLocale);
      const formattedValue = formatValue(value, validLocale);
      message += `${questionNumber}. <b>${label}:</b> ${formattedValue}\n`;
      questionNumber++;
    }
  }

  return message;
}

function getPersonalDataFields(type: string): string[] {
  const commonFields = ['firstName', 'lastName', 'age', 'weight', 'country', 'city'];
  if (type === 'infant') {
    return ['firstName', 'lastName', 'ageMonths', 'weight', 'country', 'city'];
  }
  return commonFields;
}

function getFieldOrder(type: string): string[] {
  const orders: Record<string, string[]> = {
    women: [
      'firstName', 'lastName', 'age', 'weight', 'country', 'city',
      'waterIntake', 'covid', 'covidComplications', 'hair', 'teeth', 'digestion',
      'stones', 'operations', 'pressure', 'chronicDiseases', 'headaches', 'numbness',
      'varicose', 'joints', 'cysts', 'herpes', 'menstruation', 'lifestyle',
      'skin', 'allergies', 'colds', 'sleep', 'energy', 'memory',
      'medications', 'cleansing', 'hasTests', 'additional', 'mainProblem', 'source'
    ],
    men: [
      'firstName', 'lastName', 'age', 'weight', 'country', 'city',
      'weightSatisfaction', 'weightChange', 'covid', 'digestion', 'varicose', 'teeth',
      'joints', 'coldLimbs', 'headaches', 'operations', 'stones', 'pressure',
      'waterIntake', 'moles', 'allergies', 'skin', 'sleep', 'energy',
      'memory', 'cleansing', 'mainProblem', 'additional', 'source', 'hasTests'
    ],
    infant: [
      'firstName', 'lastName', 'ageMonths', 'weight', 'country', 'city',
      'digestion', 'nightSweating', 'badBreath', 'skinIssues', 'allergies', 'waterIntake',
      'injuries', 'injuriesDetails', 'sleep', 'illnesses',
      'birthType', 'toxemia', 'motherAllergies', 'motherConstipation', 'motherAntibiotics',
      'motherAnemia', 'pregnancyProblems', 'additional', 'mainProblem', 'source', 'hasTests'
    ],
    child: [
      'firstName', 'lastName', 'age', 'weight', 'country', 'city',
      'digestion', 'teeth', 'nightSweating', 'sweets', 'skinIssues', 'allergies',
      'hyperactivity', 'waterIntake', 'injuries', 'headaches', 'illnesses', 'joints',
      'mainProblem', 'additional', 'source', 'hasTests'
    ],
  };
  return orders[type] || [];
}

function getFieldLabel(key: string, type: string, locale: 'ru' | 'en'): string {
  const t = questionnaireTranslations[locale];
  
  // Общие поля
  if (key === 'firstName') return t.firstName;
  if (key === 'lastName') return t.lastName;
  if (key === 'age') return t.age;
  if (key === 'ageMonths') return locale === 'ru' ? 'Возраст (месяцы)' : 'Age (months)';
  if (key === 'weight') return t.weight;
  if (key === 'country') return t.country;
  if (key === 'city') return t.city;
  
  // Поля по типам анкет
  if (type === 'women') {
    const w = t.women as any;
    if (key === 'waterIntake') return w.waterIntake;
    if (key === 'covid') return w.covid;
    if (key === 'covidComplications') return w.covidComplications;
    if (key === 'hair') return w.hair;
    if (key === 'teeth') return w.teeth;
    if (key === 'digestion') return w.digestion;
    if (key === 'stones') return w.stones;
    if (key === 'operations') return w.operations;
    if (key === 'pressure') return w.pressure;
    if (key === 'chronicDiseases') return w.chronicDiseases;
    if (key === 'headaches') return w.headaches;
    if (key === 'numbness') return w.numbness;
    if (key === 'varicose') return w.varicose;
    if (key === 'joints') return w.joints;
    if (key === 'cysts') return w.cysts;
    if (key === 'herpes') return w.herpes;
    if (key === 'menstruation') return w.menstruation;
    if (key === 'lifestyle') return w.lifestyle;
    if (key === 'skin') return w.skin;
    if (key === 'allergies') return w.allergies;
    if (key === 'colds') return w.colds;
    if (key === 'sleep') return w.sleep;
    if (key === 'energy') return w.energy;
    if (key === 'memory') return w.memory;
    if (key === 'medications') return w.medications;
    if (key === 'cleansing') return w.cleansing;
    if (key === 'hasTests') return w.hasTests;
    if (key === 'additional') return w.additional;
    if (key === 'mainProblem') return w.mainProblem;
    if (key === 'source') return w.source;
  }
  
  if (type === 'men') {
    const m = t.men as any;
    if (key === 'weightSatisfaction') return m.weightSatisfaction;
    if (key === 'weightChange') return m.weightChange;
    if (key === 'covid') return m.covid;
    if (key === 'digestion') return m.digestion;
    if (key === 'varicose') return m.varicose;
    if (key === 'teeth') return m.teeth;
    if (key === 'joints') return m.joints;
    if (key === 'coldLimbs') return m.coldLimbs;
    if (key === 'headaches') return m.headaches;
    if (key === 'operations') return m.operations;
    if (key === 'stones') return m.stones;
    if (key === 'pressure') return m.pressure;
    if (key === 'waterIntake') return m.waterIntake;
    if (key === 'moles') return m.moles;
    if (key === 'allergies') return m.allergies;
    if (key === 'skin') return m.skin;
    if (key === 'sleep') return m.sleep;
    if (key === 'energy') return m.energy;
    if (key === 'memory') return m.memory;
    if (key === 'cleansing') return m.cleansing;
    if (key === 'mainProblem') return m.mainProblem;
    if (key === 'additional') return m.additional;
    if (key === 'source') return m.source;
    if (key === 'hasTests') return m.hasTests;
  }
  
  if (type === 'infant') {
    const i = t.infant as any;
    if (key === 'digestion') return i.digestion;
    if (key === 'nightSweating') return i.nightSweating;
    if (key === 'badBreath') return i.badBreath;
    if (key === 'skinIssues') return i.skinIssues;
    if (key === 'allergies') return i.allergies;
    if (key === 'waterIntake') return i.waterIntake;
    if (key === 'injuries') return i.injuriesLabel;
    if (key === 'injuriesDetails') return i.injuriesDetails;
    if (key === 'sleep') return i.sleep;
    if (key === 'illnesses') return i.illnesses;
    if (key === 'birthType') return i.birthType;
    if (key === 'toxemia') return i.toxemia;
    if (key === 'motherAllergies') return i.motherAllergies;
    if (key === 'motherConstipation') return i.motherConstipation;
    if (key === 'motherAntibiotics') return i.motherAntibiotics;
    if (key === 'motherAnemia') return i.motherAnemia;
    if (key === 'pregnancyProblems') return i.pregnancyProblems;
    if (key === 'additional') return i.additional;
    if (key === 'mainProblem') return i.mainProblem;
    if (key === 'source') return i.source;
    if (key === 'hasTests') {
      if (type === 'infant') {
        const i = t.infant as any;
        return i.hasTests || (locale === 'ru' ? 'Есть анализы/УЗИ' : 'Has tests/ultrasound');
      }
    }
  }
  
  if (type === 'child') {
    const c = t.child as any;
    if (key === 'digestion') return c.digestion;
    if (key === 'teeth') return c.teeth;
    if (key === 'nightSweating') return c.nightSweating;
    if (key === 'sweets') return c.sweets;
    if (key === 'skinIssues') return c.skinIssues;
    if (key === 'allergies') return c.allergies;
    if (key === 'hyperactivity') return c.hyperactivity;
    if (key === 'waterIntake') return c.waterIntake;
    if (key === 'injuries') return c.injuriesLabel;
    if (key === 'headaches') return c.headaches;
    if (key === 'illnesses') return c.illnesses;
    if (key === 'joints') return c.joints;
    if (key === 'mainProblem') {
      const c = t.child as any;
      return c.mainProblem || (locale === 'ru' ? 'Основная проблема' : 'Main problem');
    }
    if (key === 'additional') return c.additional;
    if (key === 'source') return c.source;
    if (key === 'hasTests') return c.hasTests;
  }
  
  return key;
}

function formatValue(value: any, locale: 'ru' | 'en'): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  } else if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  } else if (typeof value === 'boolean') {
    return value ? (locale === 'ru' ? 'Да' : 'Yes') : (locale === 'ru' ? 'Нет' : 'No');
  } else {
    const str = String(value);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

