export interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  card_slug: string;
  created_at: string;
  updated_at: string;
}

export async function getContacts(): Promise<Contact[]> {
  const response = await fetch('/api/contacts');
  if (!response.ok) {
    throw new Error('Failed to get contacts');
  }
  return response.json();
}

export async function getContactBySlug(slug: string): Promise<Contact | null> {
  const response = await fetch(`/api/contacts/${slug}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to get contact');
  }
  return response.json();
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'card_slug'>): Promise<Contact> {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create contact');
  }
  return response.json();
}

export async function deleteContact(id: string): Promise<void> {
  const response = await fetch(`/api/contacts?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete contact');
  }
}