'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('dark');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Links
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [googleReviews, setGoogleReviews] = useState('');
  const [paymentLink, setPaymentLink] = useState('');

  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle,
          password,
          full_name: fullName,
          job_title: jobTitle,
          phone,
          whatsapp,
          location,
          bio,
          theme,
          avatar_url: avatarUrl,
          facebook,
          instagram,
          linkedin,
          website,
          google_reviews: googleReviews,
          payment_link: paymentLink,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        alert(`Account Created Successfully!\nLive Link: https://nexxconnect.vercel.app/${data.handle}`);
        setHandle(''); setPassword(''); setFullName(''); setJobTitle(''); setPhone(''); setWhatsapp(''); setLocation(''); setBio(''); setAvatarUrl(''); setFacebook(''); setInstagram(''); setLinkedin(''); setWebsite(''); setGoogleReviews(''); setPaymentLink('');
      } else {
        alert(`Error: ${data?.error || 'Failed to create account'}`);
      }
    } catch (err: any) {
      alert(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold border-b border-slate-800 pb-4">Admin Panel: Create Client Profile</h1>

        <form onSubmit={handleCreateClient} className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-blue-400 uppercase">Account Credentials *</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Handle *" value={handle} onChange={(e) => setHandle(e.target.value)} required className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="Password (Min 8) *" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-xs font-bold text-blue-400 uppercase">Appearance & Photo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="p-2 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300" />
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white">
                <option value="dark">Dark Modern</option>
                <option value="glass">Glassmorphism</option>
                <option value="light">Minimal Light</option>
                <option value="neon">Cyber Neon</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-xs font-bold text-blue-400 uppercase">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="WhatsApp Number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
            </div>
            <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-xs font-bold text-blue-400 uppercase">Links & Socials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="Facebook URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="Google Reviews Link" value={googleReviews} onChange={(e) => setGoogleReviews(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
              <input type="text" placeholder="Payment / UPI Link" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 font-bold rounded-xl text-white">
            {loading ? 'Creating...' : 'Create Account & Save All Fields'}
          </button>
        </form>
      </div>
    </div>
  );
}