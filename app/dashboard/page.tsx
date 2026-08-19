'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [handle, setHandle] = useState('');
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('dark');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Social & Link fields
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [googleReviews, setGoogleReviews] = useState('');
  const [paymentLink, setPaymentLink] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      const { data: card } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (card) {
        setHandle(card.handle || '');
        setFullName(card.full_name || '');
        setJobTitle(card.job_title || '');
        setPhone(card.phone || '');
        setWhatsapp(card.whatsapp || '');
        setLocation(card.location || '');
        setBio(card.bio || '');
        setTheme(card.theme || 'dark');
        setAvatarUrl(card.avatar_url || '');
        setWebsite(card.website || '');
        setFacebook(card.facebook || '');
        setInstagram(card.instagram || '');
        setLinkedin(card.linkedin || '');
        setGoogleReviews(card.google_reviews || '');
        setPaymentLink(card.payment_link || '');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('cards')
      .upsert(
        {
          user_id: user.id,
          handle: handle.toLowerCase().trim(),
          full_name: fullName,
          job_title: jobTitle,
          phone,
          whatsapp,
          location,
          bio,
          theme,
          avatar_url: avatarUrl,
          website,
          facebook,
          instagram,
          linkedin,
          google_reviews: googleReviews,
          payment_link: paymentLink,
        },
        { onConflict: 'handle' }
      );

    setSaving(false);

    if (error) {
      alert(`Failed to save: ${error.message}`);
    } else {
      alert('Card updated successfully!');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Edit Your Card</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            type="button"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Sign Out
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400">Handle / Custom URL</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              required
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Job Title / Role</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">WhatsApp Number</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Location / Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Website URL</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Facebook Link</label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Instagram Link</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">LinkedIn Link</label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Google Reviews Link</label>
            <input
              type="text"
              value={googleReviews}
              onChange={(e) => setGoogleReviews(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Payment / UPI Link</label>
            <input
              type="text"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Theme Selection</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            >
              <option value="dark">Dark Modern</option>
              <option value="glass">Glassmorphism</option>
              <option value="light">Minimal Light</option>
              <option value="neon">Cyber Neon</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Upload Profile Photo File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Profile Photo URL (Alternative)</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white transition mt-4"
          >
            {saving ? 'Saving...' : 'Save Card Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}