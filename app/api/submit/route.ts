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

    // Collect files - iterate through all entries to find files
    const files: (File | Blob)[] = [];
    const fileCount = parseInt(formData.get('fileCount') as string) || 0;
    
    console.log(`Received fileCount: ${fileCount}`);
    console.log(`FormData entries:`, Array.from(formData.keys()));
    
    // Try to get files by index
    for (let i = 0; i < fileCount; i++) {
      const fileEntry = formData.get(`file_${i}`);
      
      if (!fileEntry) {
        console.log(`File ${i}: not found in FormData`);
        continue;
      }
      
      let file: File | Blob | null = null;
      
      // Type guard for File - check if it has name property (File has name, Blob doesn't)
      if (typeof fileEntry === 'object' && fileEntry !== null && 'name' in fileEntry && 'size' in fileEntry && 'type' in fileEntry) {
        // It's likely a File
        try {
          const fileEntryAsFile = fileEntry as any;
          if (fileEntryAsFile instanceof File) {
            console.log(`File ${i}: File instance - ${fileEntryAsFile.name}, ${fileEntryAsFile.size} bytes, ${fileEntryAsFile.type}`);
            file = fileEntryAsFile;
          } else {
            // Create File from object with name property
            file = new File([fileEntryAsFile], fileEntryAsFile.name || `file_${i}`, { 
              type: fileEntryAsFile.type || 'application/octet-stream' 
            });
            console.log(`File ${i}: Created File from object - ${(file as File).name}, ${file.size} bytes`);
          }
        } catch (error) {
          console.error(`Error creating File from entry ${i}:`, error);
        }
      }
      // Type guard for Blob (but not File) - check if it's a Blob-like object without name
      else if (typeof fileEntry === 'object' && fileEntry !== null && 'size' in fileEntry && 'type' in fileEntry) {
        const blobEntry = fileEntry as any;
        console.log(`File ${i}: Blob-like object, size: ${blobEntry.size}, type: ${blobEntry.type}`);
        // Try to get filename from formData if available, or create File from Blob
        try {
          const fileName = blobEntry.name || `file_${i}`;
          file = new File([blobEntry], fileName, { 
            type: blobEntry.type || 'application/octet-stream' 
          });
          console.log(`File ${i}: Converted Blob to File - ${(file as File).name}, ${file.size} bytes`);
        } catch (error) {
          // If File constructor fails, use Blob directly
          console.log(`File ${i}: Using Blob directly`);
          file = blobEntry;
        }
      }
      // Handle other types
      else {
        console.log(`File ${i}: unexpected type: ${typeof fileEntry}`);
        if (typeof fileEntry === 'string') {
          console.warn(`File ${i} is a string, cannot process as file`);
        } else {
          // Try to create a Blob
          try {
            const blob = new Blob([fileEntry as any]);
            file = new File([blob], `file_${i}`, { 
              type: 'application/octet-stream' 
            });
            console.log(`File ${i}: Created from unknown type - ${(file as File).name}, ${file.size} bytes`);
          } catch (error) {
            console.error(`Error creating file from entry ${i}:`, error);
          }
        }
      }
      
      if (file && file.size > 0) {
        const fileName = file instanceof File ? file.name : `file_${i}`;
        console.log(`✅ File ${i} ready: ${fileName}, size: ${file.size}, type: ${file.type}`);
        files.push(file);
      } else if (file) {
        console.log(`⚠️ File ${i}: empty (size: ${file.size})`);
      } else {
        console.log(`❌ File ${i}: could not be processed`);
      }
    }
    
    console.log(`Total files collected: ${files.length}`);
    
    // Also try to get all files from FormData (alternative method)
    if (files.length === 0 && fileCount > 0) {
      console.log('No files collected by index, trying alternative method...');
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('file_') && typeof value === 'object' && value !== null && 'size' in value) {
          const fileName = ('name' in value && typeof value.name === 'string') ? value.name : key;
          const fileSize = (value as any).size;
          console.log(`Found file by key ${key}: ${fileName}, ${fileSize} bytes`);
          files.push(value as any);
        }
      }
      console.log(`Alternative method found ${files.length} file(s)`);
    }

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
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Log full error details for debugging
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error,
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        // Include stack trace in development
        ...(process.env.NODE_ENV === 'development' && errorStack ? { stack: errorStack } : {})
      },
      { status: 500 }
    );
  }
}

