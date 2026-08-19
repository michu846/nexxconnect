'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states for contact card
  const [handle, setHandle] = useState('');
  const [theme, setTheme] = useState('classic-dark');
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [location, setLocation] = useState('');
  const [upi, setUpi] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  // 1. SHOW LOGIN IF NOT LOGGED IN
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-sm flex flex-col gap-4 shadow-xl">
          <h1 className="text-2xl font-bold text-center text-white">NexxConnect Admin</h1>
          <p className="text-sm text-slate-400 text-center mb-2">Sign in to edit cards</p>
          
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg text-white transition">
            Sign In
          </button>
        </form>
      </div>
    );
  }

  // 2. SHOW DASHBOARD IF LOGGED IN
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center px-6">
        <span className="text-sm text-slate-300">
          Logged in as: <strong className="text-white">{session.user.email}</strong>
        </span>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-xs font-semibold rounded-lg transition"
        >
          Log Out
        </button>
      </div>

      <div className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Manage Contact Card</h1>
        <p className="text-sm text-slate-400">Authenticated Admin Zone</p>
        
        {/* Your card editing controls */}
        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
          <label className="block text-xs mb-1 text-slate-400">LOAD CARD HANDLE</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. mishab" 
              value={handle} 
              onChange={(e) => setHandle(e.target.value)} 
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />
            <button className="px-5 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">Load</button>
          </div>
        </div>
      </div>
    </div>
  );
}