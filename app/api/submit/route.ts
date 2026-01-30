import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const locale = formData.get('locale') as string;
    const dataJson = formData.get('data') as string;
    
    if (!type || !locale || !dataJson) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let data;
    try {
      data = JSON.parse(dataJson);
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON data' },
        { status: 400 }
      );
    }

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

        // Create FormData using built-in FormData (Node.js 18+)
        // Convert buffer to Blob for FormData
        const fileBlob = new Blob([buffer], { type: file.type || 'application/octet-stream' });
        const fileForFormData = new File([fileBlob], file.name, { type: file.type || 'application/octet-stream' });
        
        const telegramFormData = new FormData();
        telegramFormData.append('chat_id', chatId);
        telegramFormData.append('document', fileForFormData);

        // Send file to Telegram
        const fileResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/sendDocument`,
          {
            method: 'POST',
            body: telegramFormData,
          }
        );

        if (!fileResponse.ok) {
          const errorText = await fileResponse.text();
          let errorMessage = `Failed to send file ${file.name}`;
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.description || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          fileErrors.push(errorMessage);
        }
      } catch (fileError) {
        const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown error';
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
  const date = new Date().toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US');
  
  let message = `<b>📋 Новая анкета: ${type}</b>\n\n`;
  message += `<b>Язык:</b> ${locale === 'ru' ? 'Русский' : 'English'}\n`;
  message += `<b>Дата и время:</b> ${date}\n\n`;
  message += `<b>Данные:</b>\n`;

  for (const [key, value] of Object.entries(data)) {
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

    formattedValue = String(formattedValue)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    message += `<b>${label}:</b> ${formattedValue}\n`;
  }

  return message;
}

function formatFieldLabel(key: string): string {
  const labels: Record<string, string> = {
    firstName: 'Имя',
    lastName: 'Фамилия',
    age: 'Возраст',
    weight: 'Вес',
    country: 'Страна',
    city: 'Город',
    waterIntake: 'Потребление воды',
    mainProblem: 'Основная проблема',
    additional: 'Дополнительно',
    source: 'Источник',
  };
  return labels[key] || key;
}

