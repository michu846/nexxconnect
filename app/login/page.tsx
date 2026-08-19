'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanHandle = handle.toLowerCase().trim();
    const virtualEmail = `${cleanHandle}@nexxconnect.internal`;

    const { error } = await supabase.auth.signInWithPassword({
      email: virtualEmail,
      password: password,
    });

    if (error) {
      setErrorMsg('Invalid handle or password.');
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h1 className="text-2xl font-bold text-center">Client Login</h1>

        {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}

        <div>
          <label className="text-xs text-slate-400">Handle / Username</label>
          <input
            type="text"
            placeholder="e.g. mishab"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl transition text-white"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}