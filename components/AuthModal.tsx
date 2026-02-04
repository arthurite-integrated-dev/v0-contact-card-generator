'use client';

import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthModalProps {
  onAuthenticate: () => void;
}

export default function AuthModal({ onAuthenticate }: AuthModalProps) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid access key');
        setIsLoading(false);
        return;
      }

      // Key is correct
      localStorage.setItem('authenticated', 'true');
      onAuthenticate();
    } catch (err) {
      console.error('[v0] Auth error:', err);
      setError('Failed to verify key');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="bg-[#1a472a] text-white rounded-t-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Staff Portal Access</CardTitle>
          <p className="text-[#d8f3dc] text-sm mt-2">Enter your access key to continue</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError('');
                }}
                placeholder="Enter your access key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !key.trim()}
              className="w-full bg-[#1a472a] hover:bg-[#0f3020] text-white font-medium py-2 rounded-lg transition"
            >
              {isLoading ? 'Verifying...' : 'Access Portal'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This is a secure staff portal. Please enter your assigned access key.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
