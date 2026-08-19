'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErrorMsg(error.message);
      else alert('Account created! You can now log in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
      else router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <form onSubmit={handleAuth} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h1 className="text-2xl font-bold text-center">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        
        {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl transition"
        >
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>

        <p 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-slate-400 text-center cursor-pointer hover:underline pt-2"
        >
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </p>
      </form>
    </div>
  );
}