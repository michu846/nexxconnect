'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(''); // Accepts Email or Handle
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let emailToAuth = identifier.trim();

      // If user typed a handle instead of an email, look up their email
      if (!identifier.includes('@')) {
        const cleanedHandle = identifier.toLowerCase().replace('@', '').trim();

        const res = await fetch('/api/get-email-by-handle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle: cleanedHandle }),
        });

        const handleData = await res.json();
        if (!res.ok || !handleData.email) {
          throw new Error(handleData.error || `Handle "@${cleanedHandle}" not found.`);
        }

        emailToAuth = handleData.email;
      }

      // Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email not confirmed in Supabase. Enable Auto-Confirm in Supabase settings.');
        }
        throw new Error(error.message);
      }

      if (data.user) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-xs text-slate-400">Log in to manage your NexxConnect card</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400">Email or Handle</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. handle or name@email.com"
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition text-xs shadow-lg mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}