'use client';

import { Contact, deleteContact } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

interface ContactsListProps {
  contacts: Contact[];
  loading: boolean;
  onContactDeleted: () => void;
}

export default function ContactsList({ contacts, loading, onContactDeleted }: ContactsListProps) {
  const [deletingId, setDeletingId] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    setDeletingId(id);
    try {
      await deleteContact(id);
      onContactDeleted();
    } catch (error) {
      console.error('[v0] Error deleting contact:', error);
      alert('Failed to delete contact');
    } finally {
      setDeletingId('');
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-[#1a472a] text-white rounded-t-lg">
          <CardTitle>Staff Contacts</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-gray-500">
          Loading contacts...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-[#1a472a] text-white rounded-t-lg">
        <CardTitle>Staff Contacts ({contacts.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No contacts yet. Add one using the form on the left.
          </p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <p className="text-sm text-[#1a472a] font-medium">{contact.position}</p>
                  </div>
                  <Button
                    onClick={() => handleDelete(contact.id)}
                    disabled={deletingId === contact.id}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    {deletingId === contact.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  {contact.email && (
                    <p>
                      <span className="font-medium">Email:</span> {contact.email}
                    </p>
                  )}
                  {contact.phone && (
                    <p>
                      <span className="font-medium">Phone:</span> {contact.phone}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Link
                    href={`/card/${contact.card_slug}`}
                    className="inline-block text-sm text-[#1a472a] hover:text-[#2d6a4f] font-medium"
                  >
                    View Card → {contact.card_slug}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
