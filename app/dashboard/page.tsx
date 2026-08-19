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
    photo_url: '',
  });

  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) setCard(data);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const cardData = {
      ...card,
      user_id: user.id,
      handle: card.handle.toLowerCase().trim(),
    };

    const { error } = await supabase.from('cards').upsert(cardData, { onConflict: 'user_id' });

    if (error) alert('Error saving card: ' + error.message);
    else alert('Card updated successfully!');

    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Your Card</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/login');
          }}
          className="text-sm bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          Sign Out
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <label className="text-xs text-slate-400">Card Handle (URL)</label>
          <input
            type="text"
            placeholder="e.g. mishab"
            value={card.handle}
            onChange={(e) => setCard({ ...card, handle: e.target.value })}
            required
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1"
          />
          {card.handle && (
            <p className="text-xs text-blue-400 mt-1">Your Link: nexxconnect.vercel.app/{card.handle}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-slate-400">Full Name</label>
          <input
            type="text"
            value={card.full_name}
            onChange={(e) => setCard({ ...card, full_name: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Job Title</label>
          <input
            type="text"
            value={card.job_title}
            onChange={(e) => setCard({ ...card, job_title: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Phone Number</label>
          <input
            type="text"
            value={card.phone}
            onChange={(e) => setCard({ ...card, phone: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Profile Image URL</label>
          <input
            type="text"
            value={card.photo_url}
            onChange={(e) => setCard({ ...card, photo_url: e.target.value })}
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl transition"
        >
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}