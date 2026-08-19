'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Client account created successfully!\n\nHandle: ${data.handle}\nPassword: ${password}`);
      setHandle('');
      setPassword('');
    } else {
      alert('Error creating account: ' + data.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <form onSubmit={handleCreateClient} className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h1 className="text-xl font-bold">Admin Panel: Create Client</h1>

        <div>
          <label className="text-xs text-slate-400">Handle / Username</label>
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
          <label className="text-xs text-slate-400">Password</label>
          <input
            type="text"
            placeholder="Assign password"
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