'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        alert(`Account created successfully!\n\nHandle: ${data.handle}\nPassword: ${password}`);
        setHandle('');
        setPassword('');
      } else {
        alert(`Error: ${data?.error || `Server responded with status ${res.status}`}`);
      }
    } catch (err: any) {
      alert(`Client Network Error: ${err.message || 'Failed to reach API endpoint'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <form onSubmit={handleCreateClient} className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h1 className="text-xl font-bold">Admin Panel: Create Client Account</h1>

        <div>
          <label className="text-xs text-slate-400">Client Handle / Username</label>
          <input
            type="text"
            placeholder="e.g. john"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Set Password for Client (Min 8 chars)</label>
          <input
            type="text"
            placeholder="e.g. ClientPass123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl transition text-white"
        >
          {loading ? 'Creating Account...' : 'Create Client Credentials'}
        </button>
      </form>
    </div>
  );
}