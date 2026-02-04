'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getContactBySlug, Contact } from '@/lib/api';
import ContactCard from '@/components/ContactCard';

export default function CardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCard() {
      try {
        const data = await getContactBySlug(slug);
        if (data) {
          setContact(data);
        } else {
          setError('Contact card not found');
        }
      } catch (err) {
        console.error('[v0] Error loading card:', err);
        setError('Failed to load contact card');
      } finally {
        setLoading(false);
      }
    }

    loadCard();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Loading contact card...</p>
        </div>
      </main>
    );
  }

  if (error || !contact) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
          <p className="text-gray-600">{error || 'Contact not found'}</p>
          <a
            href="/"
            className="inline-block mt-4 text-[#1a472a] hover:text-[#2d6a4f] font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ContactCard contact={contact} />
      </div>
    </main>
  );
}
