import { NextResponse } from 'next/server';
import { testDynamoDBConnection } from '@/lib/dynamodb';

export async function GET() {
  try {
    const success = await testDynamoDBConnection();
    return NextResponse.json({ success, message: success ? 'Connection successful' : 'Connection failed' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}