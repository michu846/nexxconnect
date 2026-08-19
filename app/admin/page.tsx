'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Card Form State
  const [handle, setHandle] = useState('');
  const [theme, setTheme] = useState('classic-dark');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [location, setLocation] = useState('');
  const [googleReviews, setGoogleReviews] = useState('');
  const [upi, setUpi] = useState('');
  const [saving, setSaving] = useState(false);

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

  // Upload image to Supabase Storage
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setPhotoUrl(data.publicUrl);
    } catch (error: any) {
      alert(error.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  // Load existing card data
  const loadCard = async () => {
    if (!handle) return alert('Enter a handle first!');
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('handle', handle.toLowerCase())
      .single();

    if (error || !data) {
      alert('Card not found! You can fill the details below to create it.');
      return;
    }

    setTheme(data.theme || 'classic-dark');
    setPhotoUrl(data.photo_url || '');
    setFullName(data.full_name || '');
    setJobTitle(data.job_title || '');
    setPhone(data.phone || '');
    setWhatsapp(data.whatsapp || '');
    setWebsite(data.website || '');
    setInstagram(data.instagram || '');
    setFacebook(data.facebook || '');
    setLocation(data.location || '');
    setGoogleReviews(data.google_reviews || '');
    setUpi(data.upi || '');
  };

  // Save/Update Card
  const handleSave = async () => {
    if (!handle) return alert('Handle name is required!');
    setSaving(true);

    const cardData = {
      handle: handle.toLowerCase(),
      theme,
      photo_url: photoUrl,
      full_name: fullName,
      job_title: jobTitle,
      phone,
      whatsapp,
      website,
      instagram,
      facebook,
      location,
      google_reviews: googleReviews,
      upi,
    };

    const { error } = await supabase.from('cards').upsert(cardData, { onConflict: 'handle' });
    setSaving(false);

    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      alert('Card saved successfully!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading admin panel...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-sm flex flex-col gap-4 shadow-xl">
          <h1 className="text-2xl font-bold text-center text-white">NexxConnect Admin</h1>
          <p className="text-sm text-slate-400 text-center mb-2">Sign in to edit contact cards</p>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
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
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
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

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-12">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center px-6 mb-6">
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

      <div className="max-w-xl mx-auto p-4 space-y-6">
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-6 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold">Manage Contact Card</h1>
            <p className="text-sm text-slate-400">Update contacts, social links, location & themes</p>
          </div>

          {/* Load Handle Section */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-2">
            <label className="block text-xs font-semibold text-slate-400">CARD HANDLE / SLUG</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. rahman" 
                value={handle} 
                onChange={(e) => setHandle(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <button 
                onClick={loadCard}
                className="px-5 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-sm transition"
              >
                Load
              </button>
            </div>
          </div>

          {/* Select Theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">SELECT THEME</label>
            <div className="grid grid-cols-2 gap-2">
              {['classic-dark', 'neon-cyber', 'sunset-glow', 'emerald-glass'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`p-3 rounded-xl border text-sm font-semibold capitalize transition ${
                    theme === t ? 'border-blue-500 bg-blue-600/20 text-white' : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Direct File Upload & Photo URL Section */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-3">
            <label className="block text-xs font-semibold text-slate-400">PROFILE PHOTO</label>
            
            <div className="flex items-center gap-4">
              {photoUrl ? (
                <img src={photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-500">
                  No Image
                </div>
              )}

              <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold text-white transition">
                {uploading ? 'Uploading...' : 'Choose File'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <input 
              type="text" 
              placeholder="Or paste URL (https://...)" 
              value={photoUrl} 
              onChange={(e) => setPhotoUrl(e.target.value)} 
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">FULL NAME</label>
              <input 
                type="text" 
                placeholder="Mirshad Abdullah" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">JOB TITLE</label>
              <input 
                type="text" 
                placeholder="Founder & Lead Engineer" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">PHONE NUMBER</label>
              <input 
                type="text" 
                placeholder="+919633964886" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">WHATSAPP NUMBER</label>
              <input 
                type="text" 
                placeholder="+919633964886" 
                value={whatsapp} 
                onChange={(e) => setWhatsapp(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">WEBSITE URL</label>
              <input 
                type="text" 
                placeholder="https://nexxconnect.in" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">INSTAGRAM LINK</label>
              <input 
                type="text" 
                placeholder="https://instagram.com/..." 
                value={instagram} 
                onChange={(e) => setInstagram(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">FACEBOOK LINK</label>
              <input 
                type="text" 
                placeholder="https://facebook.com/..." 
                value={facebook} 
                onChange={(e) => setFacebook(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">GOOGLE LOCATION (MAPS URL)</label>
              <input 
                type="text" 
                placeholder="https://maps.app.goo.gl/..." 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">GOOGLE REVIEWS LINK</label>
              <input 
                type="text" 
                placeholder="Google review link" 
                value={googleReviews} 
                onChange={(e) => setGoogleReviews(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">PAYMENT / UPI LINK</label>
              <input 
                type="text" 
                placeholder="upi://pay?pa=..." 
                value={upi} 
                onChange={(e) => setUpi(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition shadow-lg"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}