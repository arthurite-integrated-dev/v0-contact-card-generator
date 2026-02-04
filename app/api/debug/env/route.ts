import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow access in development or from specific IPs
  // Remove this in production or add proper authentication
  
  const envVars = {
    // Check if variables exist (don't expose values)
    REGION: process.env.REGION ? '✓ SET' : '✗ MISSING',
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID ? '✓ SET' : '✗ MISSING',
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY ? '✓ SET' : '✗ MISSING',
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME ? '✓ SET' : '✗ MISSING',
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ? '✓ SET' : '✗ MISSING',
    ACCESS_KEY: process.env.ACCESS_KEY ? '✓ SET' : '✗ MISSING',
  };

  return NextResponse.json({
    message: 'Environment Variables Status',
    variables: envVars,
    nodeEnv: process.env.NODE_ENV,
  });
}
