'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [card, setCard] = useState({
    handle: '',
    full_name: '',
    job_title: '',
    phone: '',
    whatsapp: '',
    website: '',
    instagram: '',
    facebook: '',
    google_reviews: '',
    upi: '',
    photo_url: '',
    theme: 'classic',
  });

  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      const { data } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (data) {
        setCard({
          handle: data.handle || '',
          full_name: data.full_name || '',
          job_title: data.job_title || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          website: data.website || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          google_reviews: data.google_reviews || '',
          upi: data.upi || '',
          photo_url: data.photo_url || '',
          theme: data.theme || 'classic',
        });
      }
      setLoading(false);
    }

    loadData();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('Session expired. Please log in again.');
      setSaving(false);
      return;
    }

    const userId = session.user.id;

    // Check if a card already exists for this user
    const { data: existingCard } = await supabase
      .from('cards')
      .select('id')
      .eq('user_id', userId)
      .single();

    const cardPayload = {
      ...card,
      user_id: userId,
      handle: card.handle.toLowerCase().trim(),
    };

    let error;

    if (existingCard) {
      const response = await supabase
        .from('cards')
        .update(cardPayload)
        .eq('user_id', userId);
      error = response.error;
    } else {
      const response = await supabase
        .from('cards')
        .insert([cardPayload]);
      error = response.error;
    }

    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      alert('Card saved successfully!');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Your Card</h1>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/login');
          }}
          className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          Sign Out
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <label className="text-xs text-slate-400">Handle / Custom URL</label>
          <input
            type="text"
            placeholder="e.g. mishab"
            value={card.handle}
            onChange={(e) => setCard({ ...card, handle: e.target.value })}
            required
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
          {card.handle && (
            <p className="text-xs text-blue-400 mt-1">
              Your Link: nexxconnect.vercel.app/{card.handle.toLowerCase()}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs text-slate-400">Full Name</label>
          <input
            type="text"
            value={card.full_name}
            onChange={(e) => setCard({ ...card, full_name: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Job Title / Role</label>
          <input
            type="text"
            value={card.job_title}
            onChange={(e) => setCard({ ...card, job_title: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Phone Number</label>
          <input
            type="text"
            value={card.phone}
            onChange={(e) => setCard({ ...card, phone: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">WhatsApp Number</label>
          <input
            type="text"
            value={card.whatsapp}
            onChange={(e) => setCard({ ...card, whatsapp: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Website URL</label>
          <input
            type="text"
            value={card.website}
            onChange={(e) => setCard({ ...card, website: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Instagram Link</label>
          <input
            type="text"
            value={card.instagram}
            onChange={(e) => setCard({ ...card, instagram: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Google Reviews Link</label>
          <input
            type="text"
            value={card.google_reviews}
            onChange={(e) => setCard({ ...card, google_reviews: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Payment / UPI Link</label>
          <input
            type="text"
            value={card.upi}
            onChange={(e) => setCard({ ...card, upi: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Profile Photo URL</label>
          <input
            type="text"
            value={card.photo_url}
            onChange={(e) => setCard({ ...card, photo_url: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl transition text-white"
        >
          {saving ? 'Saving...' : 'Save Card Settings'}
        </button>
      </form>
    </div>
  );
}