import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'encrypted.bin';

  console.log('Uploading file with filename:', filename);
  try {
    if (!request.body) {
      return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
    }

    // LOCAL FALLBACK: If Vercel Blob token is missing, save to local disk
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('No BLOB_READ_WRITE_TOKEN found. Using local storage fallback.');
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const buffer = Buffer.from(await request.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      
      return NextResponse.json({ url: `${protocol}://${host}/uploads/${filename}` }, { status: 200 });
    }

    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'application/octet-stream',
    });

    console.log('Blob uploaded successfully:', blob.url);
    return NextResponse.json(blob, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Blob upload error:', error.message);
      return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown upload error' }, { status: 500 });
  }
}
