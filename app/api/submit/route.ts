import { NextRequest, NextResponse } from 'next/server';
import { sendToTelegram } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const locale = formData.get('locale') as string;
    const dataJson = formData.get('data') as string;
    const data = JSON.parse(dataJson);

    // Collect files
    const files: File[] = [];
    const fileCount = parseInt(formData.get('fileCount') as string) || 0;
    
    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file_${i}`) as File;
      if (file) {
        files.push(file);
      }
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
    return NextResponse.json(
      { success: false, error: 'Failed to submit questionnaire' },
      { status: 500 }
    );
  }
}

