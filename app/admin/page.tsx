'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const THEMES = [
  { id: 'classic-dark', name: 'Classic Dark', preview: 'bg-[#0d1117] text-white' },
  { id: 'neon-cyber', name: 'Neon Cyber', preview: 'bg-slate-900 border-cyan-500 text-cyan-400' },
  { id: 'sunset-glow', name: 'Sunset Glow', preview: 'bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white' },
  { id: 'emerald-glass', name: 'Emerald Glass', preview: 'bg-emerald-950 text-emerald-200' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [slug, setSlug] = useState('rahman');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const initialFormState = {
    slug: '',
    name: '',
    title: '',
    company: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    avatar_url: '',
    theme: 'classic-dark',
    facebook: '',
    instagram: '',
    whatsapp: '',
    google_maps: '',
    google_reviews: '',
    payment_link: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadProfile = async (targetSlug: string) => {
    if (!targetSlug.trim()) return;
    setFetching(true);
    setMessage(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', targetSlug.trim())
      .single();

    if (data) {
      setFormData({
        slug: data.slug || targetSlug,
        name: data.name || '',
        title: data.title || '',
        company: data.company || '',
        bio: data.bio || '',
        email: data.email || '',
        phone: data.phone || '',
        website: data.website || '',
        avatar_url: data.avatar_url || '',
        theme: data.theme || 'classic-dark',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        whatsapp: data.whatsapp || '',
        google_maps: data.google_maps || '',
        google_reviews: data.google_reviews || '',
        payment_link: data.payment_link || '',
      });
      setIsCreatingNew(false);
    } else if (error) {
      setMessage({ type: 'error', text: `No profile found for slug "${targetSlug}". Create it as a new card!` });
    }
    setFetching(false);
  };

  useEffect(() => {
    loadProfile('rahman');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateNewClick = () => {
    setIsCreatingNew(true);
    setFormData(initialFormState);
    setMessage({ type: 'success', text: 'Fill in details below to create a brand new digital contact card.' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      setMessage({ type: 'error', text: `Image upload failed: ${uploadError.message}` });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    setFormData((prev) => ({ ...prev, avatar_url: publicUrlData.publicUrl }));
    setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const targetSlug = (isCreatingNew ? formData.slug : slug).trim();

    if (!targetSlug) {
      setMessage({ type: 'error', text: 'Please provide a profile slug/handle.' });
      setLoading(false);
      return;
    }

    if (isCreatingNew) {
      const { error } = await supabase.from('profiles').insert([{ ...formData, slug: targetSlug }]);

      if (error) {
        setMessage({ type: 'error', text: `Error creating card: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: `New Contact Card for "${targetSlug}" created successfully!` });
        setSlug(targetSlug);
        setIsCreatingNew(false);
        router.refresh();
      }
    } else {
      const { error } = await supabase.from('profiles').update(formData).eq('slug', targetSlug);

      if (error) {
        setMessage({ type: 'error', text: `Error updating card: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center p-4 py-12 relative">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              {isCreatingNew ? 'Create New Card' : 'Manage Contact Card'}
            </h1>
            <p className="text-gray-400 text-sm">Update contacts, social links, location & themes</p>
          </div>
          
          <button
            type="button"
            onClick={handleCreateNewClick}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            + Add New Card
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl border text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Card Handle */}
          {!isCreatingNew ? (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Load Card Handle</label>
              <div className="flex gap-2">
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" placeholder="e.g. rahman" />
                <button type="button" onClick={() => loadProfile(slug)} disabled={fetching} className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-semibold">
                  {fetching ? 'Loading...' : 'Load'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-emerald-400 uppercase mb-1">New Card Slug / URL</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" placeholder="e.g. john-doe" required />
            </div>
          )}

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Select Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {THEMES.map((t) => (
                <button key={t.id} type="button" onClick={() => setFormData((prev) => ({ ...prev, theme: t.id }))} className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.theme === t.id ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-white/10'} ${t.preview}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
            <label className="block text-xs font-semibold text-gray-400 uppercase">Profile Photo</label>
            <div className="flex items-center gap-4">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-blue-500" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white" />
                <input type="url" name="avatar_url" value={formData.avatar_url} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" placeholder="...or Image URL" />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" placeholder="Mirshad Abdullah" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Job Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" placeholder="Founder & Lead Engineer" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Company / Organization</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" placeholder="NexxConnect" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Bio / Small Description</label>
            <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none" placeholder="Short description..." />
          </div>

          {/* Direct Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" placeholder="+919633964886" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">WhatsApp Number</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" placeholder="919633964886 (with country code)" />
            </div>
          </div>

          {/* Socials & Location Tabs */}
          <div className="pt-2 border-t border-white/10 space-y-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase">Social & Business Links</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Website URL</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="https://nexxconnect.com" />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Instagram Link</label>
                <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="https://instagram.com/username" />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Facebook Link</label>
                <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="https://facebook.com/username" />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Google Location (Maps URL)</label>
                <input type="url" name="google_maps" value={formData.google_maps} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="https://maps.app.goo.gl/..." />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Google Reviews Link</label>
                <input type="url" name="google_reviews" value={formData.google_reviews} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="Google Review link" />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Payment / UPI Link</label>
                <input type="url" name="payment_link" value={formData.payment_link} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="UPI or PayPal Link" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-xl transition-all cursor-pointer">
            {loading ? 'Saving...' : isCreatingNew ? '🚀 Publish New Card' : 'Save Changes'}
          </button>
        </form>
      </div>
    </main>
  );
}