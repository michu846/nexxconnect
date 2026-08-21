'use client';

import { useState } from 'react';

// SET YOUR SECRET ADMIN KEY HERE
const SECRET_ADMIN_KEY = 'INAAYA@846'; // Replace with your desired secret password

export default function AdminPage() {
  const [accessKey, setAccessKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [fullName, setFullName] = useState('');
  const [creating, setCreating] = useState(false);

  // Handle PIN verification
  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === SECRET_ADMIN_KEY) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Admin Security Key!');
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, handle, fullName }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Success! Customer "${handle}" created. They can now log in at /login`);
        setEmail('');
        setPassword('');
        setHandle('');
        setFullName('');
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  // STEP 1: Show Security Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-center">
        <form onSubmit={handleVerifyKey} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl text-center">
          <div className="text-3xl">🔒</div>
          <h1 className="text-xl font-bold">Admin Restricted Access</h1>
          <p className="text-xs text-slate-400">Enter the master admin key to access this panel.</p>
          
          <input
            type="password"
            required
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="Enter Admin Key"
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm text-center focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition text-sm"
          >
            Unlock Admin Panel
          </button>
        </form>
      </div>
    );
  }

  // STEP 2: Render Admin Panel once key is verified
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-red-400 hover:underline"
          >
            Lock Panel
          </button>
        </div>

        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400">Customer Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@email.com"
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Handle / Custom URL</label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. mishab"
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Customer Full Name"
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Set 8-Letter Password</label>
            <input
              type="text"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition text-sm mt-2"
          >
            {creating ? 'Creating Customer...' : 'Create Customer Login'}
          </button>
        </form>
      </div>
    </div>
  );
}