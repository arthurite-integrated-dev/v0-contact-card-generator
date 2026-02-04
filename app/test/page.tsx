'use client';

import { useState } from 'react';

export default function TestPage() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>('');

  const runTest = async () => {
    setTesting(true);
    setResult('');
    
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setResult(data.success ? '✅ Connection successful!' : `❌ ${data.error || 'Connection failed'}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResult(`❌ Error: ${errorMessage}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">DynamoDB Connection Test</h1>
      
      <button
        onClick={runTest}
        disabled={testing}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test Connection'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 border rounded">
          {result}
        </div>
      )}
    </div>
  );
}