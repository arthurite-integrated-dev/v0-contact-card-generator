'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';
import ContactsList from '@/components/ContactsList';
import AuthModal from '@/components/AuthModal';
import { Contact, getContacts } from '@/lib/api';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check if already authenticated
    const authenticated = localStorage.getItem('authenticated') === 'true';
    setIsAuthenticated(authenticated);
    setLoading(!authenticated);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadContacts() {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error('[v0] Error loading contacts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, [refreshTrigger, isAuthenticated]);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    setLoading(true);
  };

  const handleContactAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleContactDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return <AuthModal onAuthenticate={handleAuthenticate} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <Header logo="/images/atr-logo.jpeg" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Admin Panel */}
          <div>
            <AdminPanel onContactAdded={handleContactAdded} />
          </div>

          {/* Contacts List */}
          <div>
            <ContactsList contacts={contacts} loading={loading} onContactDeleted={handleContactDeleted} />
          </div>
        </div>
      </div>
    </main>
  );
}
