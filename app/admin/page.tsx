'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    handle: '',
    full_name: '',
    job_title: '',
    phone: '',
    whatsapp: '',
    location: '',
    bio: '',
    theme: 'dark',
    avatar_url: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    google_reviews: '',
    payment_link: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      handle: formData.handle.toLowerCase().trim(),
      user_id: formData.user_id.trim() || null,
    };

    const { error } = await supabase.from('cards').insert([payload]);

    setLoading(false);

    if (error) {
      alert(`Error creating card: ${error.message}`);
    } else {
      alert('Card created successfully with all options!');
      setFormData({
        user_id: '',
        handle: '',
        full_name: '',
        job_title: '',
        phone: '',
        whatsapp: '',
        location: '',
        bio: '',
        theme: 'dark',
        avatar_url: '',
        website: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        google_reviews: '',
        payment_link: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h1 className="text-2xl font-bold">Admin: Create Full Card</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs text-slate-400">Handle / Custom Route (Required)</label>
            <input
              name="handle"
              type="text"
              required
              value={formData.handle}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">User ID (Optional Supabase Auth ID)</label>
            <input
              name="user_id"
              type="text"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Full Name</label>
            <input
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Job Title</label>
            <input
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Phone</label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">WhatsApp</label>
            <input
              name="whatsapp"
              type="text"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Location</label>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-400">Bio</label>
            <textarea
              name="bio"
              rows={2}
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Website</label>
            <input
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Facebook</label>
            <input
              name="facebook"
              type="text"
              value={formData.facebook}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Instagram</label>
            <input
              name="instagram"
              type="text"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">LinkedIn</label>
            <input
              name="linkedin"
              type="text"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Google Reviews</label>
            <input
              name="google_reviews"
              type="text"
              value={formData.google_reviews}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Payment Link</label>
            <input
              name="payment_link"
              type="text"
              value={formData.payment_link}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            >
              <option value="dark">Dark Modern</option>
              <option value="glass">Glassmorphism</option>
              <option value="light">Minimal Light</option>
              <option value="neon">Cyber Neon</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-400">Upload Photo File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-400">Profile Photo URL (Alternative)</label>
            <input
              name="avatar_url"
              type="text"
              value={formData.avatar_url}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 py-4 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white transition mt-2"
          >
            {loading ? 'Creating Card...' : 'Create Card'}
          </button>
        </form>
      </div>
    </div>
  );
}