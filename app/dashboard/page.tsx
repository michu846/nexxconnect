'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Card Profile State
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [googleReview, setGoogleReview] = useState('');
  const [handle, setHandle] = useState('');

  useEffect(() => {
    checkUserAndLoadCard();
  }, []);

  const checkUserAndLoadCard = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);

      const { data: card } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (card) {
        setFullName(card.full_name || '');
        setCompanyName(card.company_name || '');
        setJobTitle(card.job_title || '');
        setAvatarUrl(card.avatar_url || '');
        setBio(card.bio || '');
        setPhone(card.phone || '');
        setWhatsapp(card.whatsapp || '');
        setWebsite(card.website || '');
        setLocation(card.location || '');
        setInstagram(card.instagram || '');
        setFacebook(card.facebook || '');
        setLinkedin(card.linkedin || '');
        setGoogleReview(card.google_review || '');
        setHandle(card.handle || '');

        if (card.handle) {
          generateQRCode(`https://nexxconnect.vercel.app/${card.handle}`);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (url: string) => {
    try {
      const qrData = await QRCode.toDataURL(url, {
        width: 600,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
      setQrCodeUrl(qrData);
    } catch (err) {
      console.error('QR Generation Error:', err);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${handle || 'profile'}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // HANDLER FOR DIRECT DEVICE IMAGE UPLOAD
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload file to Supabase Storage Bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (error: any) {
      alert(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('cards')
        .update({
          full_name: fullName,
          company_name: companyName,
          job_title: jobTitle,
          avatar_url: avatarUrl,
          bio,
          phone,
          whatsapp,
          website,
          location,
          instagram,
          facebook,
          linkedin,
          google_review: googleReview,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(`Error saving profile: ${err.message}`);
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
        <div className="animate-pulse text-sm text-slate-400">Loading your profile dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center">
      
      {/* Top Header */}
      <div className="w-full max-w-2xl flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg mb-6">
        <div>
          <h1 className="text-lg font-bold">Edit Your Digital Card</h1>
          {handle && (
            <a
              href={`https://nexxconnect.vercel.app/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
            >
              🔗 View Live Profile: nexxconnect.vercel.app/{handle}
            </a>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-red-400 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition"
        >
          Sign Out
        </button>
      </div>

      <div className="w-full max-w-2xl space-y-6">

        {/* QR CODE CARD */}
        {qrCodeUrl && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 shrink-0">
              <img src={qrCodeUrl} alt="Your QR Code" className="w-36 h-36" />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <h2 className="text-base font-bold text-white">Your Card QR Code</h2>
              <p className="text-xs text-slate-400">
                Scan this QR code to quickly open your live digital business card. Download high-res PNG for physical NFC cards.
              </p>
              <button
                onClick={downloadQRCode}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white transition text-xs shadow-lg flex items-center justify-center gap-2 mt-2 w-full sm:w-auto"
              >
                📥 Download High-Res QR Code
              </button>
            </div>
          </div>
        )}

        {/* PROFILE EDIT FORM */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            
            <div className="border-b border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-slate-200">Basic Info</h2>
            </div>

            {/* DIRECT FILE UPLOAD COMPONENT */}
            <div className="flex flex-col items-center sm:flex-row gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl shrink-0">
                  👤
                </div>
              )}
              
              <div className="w-full space-y-2">
                <label className="text-slate-400 font-medium block">Profile Picture</label>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                
                {uploading && <p className="text-[10px] text-blue-400 animate-pulse">Uploading photo...</p>}
              </div>
            </div>

            <div>
              <label className="text-slate-400">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Company / Business Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Job Title / Designation</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Managing Director"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Bio / About</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio about your business..."
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Location / Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dubai, UAE"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div className="border-b border-slate-800 pb-2 pt-4">
              <h2 className="text-sm font-bold text-slate-200">Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+971501234567"
                  className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="border-b border-slate-800 pb-2 pt-4">
              <h2 className="text-sm font-bold text-slate-200">Social Links & Reviews</h2>
            </div>

            <div>
              <label className="text-slate-400">⭐ Google Review URL</label>
              <input
                type="text"
                value={googleReview}
                onChange={(e) => setGoogleReview(e.target.value)}
                placeholder="https://g.page/r/your-review-link"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">🌐 Website URL</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">📘 Facebook Profile / Page URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">💼 LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">📸 Instagram Username / Link</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="username or https://instagram.com/username"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition text-xs shadow-lg mt-6"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}