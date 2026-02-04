import { NextRequest, NextResponse } from 'next/server';
import { getContactBySlug } from '@/lib/dynamodb';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const contact = await getContactBySlug(slug);
    
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('API Error getting contact by slug:', error);
    return NextResponse.json({ error: 'Failed to get contact' }, { status: 500 });
  }
}