import { NextRequest, NextResponse } from 'next/server';
import { sendToTelegram } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const locale = formData.get('locale') as string;
    const dataJson = formData.get('data') as string;
    
    if (!type || !locale || !dataJson) {
      console.error('Missing required fields:', { type, locale, hasData: !!dataJson });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Collect files - iterate through all formData entries to find files
    const files: File[] = [];
    const fileCount = parseInt(formData.get('fileCount') as string) || 0;
    
    console.log(`Received fileCount: ${fileCount}`);
    console.log(`FormData entries:`, Array.from(formData.keys()));
    
    // Try to get files by index first
    for (let i = 0; i < fileCount; i++) {
      const fileEntry = formData.get(`file_${i}`);
      if (fileEntry instanceof File) {
        const file = fileEntry as File;
        if (file.size > 0) {
          console.log(`File ${i}: ${file.name}, size: ${file.size}, type: ${file.type}`);
          files.push(file);
        } else {
          console.log(`File ${i}: empty (size: ${file.size})`);
        }
      } else if (fileEntry) {
        // If it's a Blob, convert to File
        const blob = fileEntry as Blob;
        const file = new File([blob], `file_${i}`, { type: blob.type });
        if (file.size > 0) {
          console.log(`File ${i} (from Blob): ${file.name}, size: ${file.size}, type: ${file.type}`);
          files.push(file);
        }
      } else {
        console.log(`File ${i}: not found`);
      }
    }
    
    console.log(`Total files collected: ${files.length}`);

    // Check Telegram credentials
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram credentials missing:', { hasToken: !!botToken, hasChatId: !!chatId });
      return NextResponse.json(
        { success: false, error: 'Telegram credentials not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.' },
        { status: 500 }
      );
    }

    await sendToTelegram({
      type,
      data,
      locale,
      files: files.length > 0 ? files : undefined,
    });

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

