'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';

export default function CustomerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Card details state
  const [card, setCard] = useState<any>({
    handle: '',
    full_name: '',
    job_title: '',
    location: '',
    bio: '',
    phone: '',
    whatsapp: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    google_reviews: '',
    payment_link: '',
    avatar_url: '',
    theme: 'dark',
  });

  // QR Code State
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setCard(data);
        generateQRCode(data.handle);
      }
    } catch (err) {
      console.error('Error loading dashboard profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = (handle: string) => {
    if (!handle) return;
    const publicUrl = `https://nexxconnect.vercel.app/${handle}`;
    QRCode.toDataURL(publicUrl, { width: 600, margin: 2 }, (err, url) => {
      if (!err) setQrUrl(url);
    });
  };

  const handleDownloadQR = () => {
    if (!qrUrl) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = qrUrl;
    downloadLink.download = `${card.handle || 'business-card'}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('cards')
        .update({
          full_name: card.full_name,
          job_title: card.job_title,
          location: card.location,
          bio: card.bio,
          phone: card.phone,
          whatsapp: card.whatsapp,
          website: card.website,
          facebook: card.facebook,
          instagram: card.instagram,
          linkedin: card.linkedin,
          google_reviews: card.google_reviews,
          payment_link: card.payment_link,
          avatar_url: card.avatar_url,
          theme: card.theme,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      alert('Card updated successfully!');
    } catch (err: any) {
      alert(`Error updating card: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="animate-pulse text-sm text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center">
      
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 shadow-lg">
        <div>
          <h1 className="text-xl font-bold">Manage Your Business Card</h1>
          <p className="text-xs text-blue-400 font-mono">https://nexxconnect.vercel.app/{card.handle}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/${card.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1"
          >
            🔗 View Live Card
          </a>
          <button
            onClick={handleLogout}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl font-semibold transition border border-slate-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* QR CODE DOWNLOAD BOX */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl text-center md:col-span-1 h-fit">
          <h2 className="text-lg font-bold">Your Card QR Code</h2>
          <p className="text-xs text-slate-400">Scan or download to print on physical cards.</p>

          {qrUrl ? (
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              <img src={qrUrl} alt="QR Code" className="w-44 h-44 mx-auto" />
            </div>
          ) : (
            <div className="w-44 h-44 bg-slate-800 rounded-2xl animate-pulse mx-auto" />
          )}

          <button
            onClick={handleDownloadQR}
            disabled={!qrUrl}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            📥 Download QR Code (PNG)
          </button>
        </div>

        {/* EDIT CARD FORM */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl md:col-span-2">
          <h2 className="text-lg font-bold border-b border-slate-800 pb-2">Profile Details</h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400">Theme Style</label>
              <select
                value={card.theme}
                onChange={(e) => setCard({ ...card, theme: e.target.value })}
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="gradient">Gradient</option>
                <option value="glass">Glassmorphism</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400">Full Name</label>
              <input
                type="text"
                value={card.full_name || ''}
                onChange={(e) => setCard({ ...card, full_name: e.target.value })}
                placeholder="John Doe"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Job Title / Tagline</label>
              <input
                type="text"
                value={card.job_title || ''}
                onChange={(e) => setCard({ ...card, job_title: e.target.value })}
                placeholder="Software Engineer"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Location</label>
              <input
                type="text"
                value={card.location || ''}
                onChange={(e) => setCard({ ...card, location: e.target.value })}
                placeholder="Dubai, UAE"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Bio</label>
              <textarea
                rows={3}
                value={card.bio || ''}
                onChange={(e) => setCard({ ...card, bio: e.target.value })}
                placeholder="Brief intro..."
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-300">Contact & Links</h3>

              <div>
                <label className="text-slate-400">Phone Number</label>
                <input
                  type="text"
                  value={card.phone || ''}
                  onChange={(e) => setCard({ ...card, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                  className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400">WhatsApp Number</label>
                <input
                  type="text"
                  value={card.whatsapp || ''}
                  onChange={(e) => setCard({ ...card, whatsapp: e.target.value })}
                  placeholder="+971501234567"
                  className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400">Website URL</label>
                <input
                  type="text"
                  value={card.website || ''}
                  onChange={(e) => setCard({ ...card, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400">Instagram</label>
                <input
                  type="text"
                  value={card.instagram || ''}
                  onChange={(e) => setCard({ ...card, instagram: e.target.value })}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white text-xs transition mt-4"
            >
              {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}