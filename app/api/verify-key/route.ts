import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: 'Access key is required' },
        { status: 400 }
      );
    }

    const accessKey = process.env.ACCESS_KEY;

    if (!accessKey) {
      console.error('[v0] ACCESS_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error. ACCESS_KEY not configured' },
        { status: 500 }
      );
    }

    if (key === accessKey) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Invalid access key' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[v0] Error verifying key:', error);
    return NextResponse.json(
      { error: 'Failed to verify access key' },
      { status: 500 }
    );
  }
}
