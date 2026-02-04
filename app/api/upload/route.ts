import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

// Log environment variable status
console.log('[v0] 🔍 S3 Upload Environment Check:');
console.log(`[v0] REGION: ${process.env.REGION ? '✓' : '✗'}`);
console.log(`[v0] ACCESS_KEY_ID: ${process.env.ACCESS_KEY_ID ? '✓' : '✗'}`);
console.log(`[v0] SECRET_ACCESS_KEY: ${process.env.SECRET_ACCESS_KEY ? '✓' : '✗'}`);
console.log(`[v0] S3_BUCKET_NAME: ${process.env.S3_BUCKET_NAME ? '✓' : '✗'}`);

const s3Client = new S3Client({
  region: process.env.REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucketName = process.env.S3_BUCKET_NAME!;
    const fileName = `contacts/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Generate the S3 URL
    const s3Url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    return NextResponse.json(
      { url: s3Url },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
