import { NextRequest, NextResponse } from 'next/server';
import { getContacts, createContact, deleteContact, generateSlug } from '@/lib/dynamodb';

export async function GET() {
  try {
    const contacts = await getContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('API Error getting contacts:', error);
    return NextResponse.json({ error: 'Failed to get contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, email, phone, photo_url } = body;

    if (!name || !position || !email) {
      return NextResponse.json({ error: 'Name, position, and email are required' }, { status: 400 });
    }

    const slug = generateSlug(name);
    const contact = await createContact({
      name,
      position,
      email,
      phone: phone || null,
      photo_url: photo_url || null,
      card_slug: slug,
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('API Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    await deleteContact(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}