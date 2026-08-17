import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface ProfileProps {
  params: Promise<{ slug: string }>;
}

const THEME_STYLES: Record<string, { bg: string; card: string; accent: string; text: string }> = {
  'classic-dark': { bg: 'bg-[#0d1117]', card: 'bg-white/10 border-white/20', accent: 'bg-blue-600', text: 'text-white' },
  'neon-cyber': { bg: 'bg-slate-950', card: 'bg-slate-900/80 border-cyan-500/50', accent: 'bg-cyan-500 text-slate-950', text: 'text-cyan-400' },
  'sunset-glow': { bg: 'bg-gradient-to-br from-purple-950 via-slate-900 to-rose-950', card: 'bg-white/10 border-pink-500/30', accent: 'bg-pink-500', text: 'text-pink-100' },
  'emerald-glass': { bg: 'bg-emerald-950', card: 'bg-emerald-900/30 border-emerald-500/30', accent: 'bg-emerald-500 text-emerald-950', text: 'text-emerald-300' },
};

export default async function ProfilePage({ params }: ProfileProps) {
  const { slug } = await params;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !profile) {
    notFound();
  }

  const theme = THEME_STYLES[profile.theme] || THEME_STYLES['classic-dark'];

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center p-4 py-12`}>
      <div className={`w-full max-w-md ${theme.card} backdrop-blur-xl border rounded-3xl p-6 shadow-2xl space-y-6 text-center`}>
        
        {/* Photo */}
        <div className="flex justify-center">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name} className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl font-extrabold">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Identity */}
        <div>
          <h1 className="text-2xl font-black">{profile.name}</h1>
          {profile.title && <p className="text-sm opacity-80 mt-1 font-medium">{profile.title}</p>}
          {profile.company && <p className="text-xs uppercase tracking-widest opacity-60 mt-0.5 font-bold">{profile.company}</p>}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs opacity-90 bg-white/5 border border-white/10 rounded-2xl p-4 text-left leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Interactive Action Tabs */}
        <div className="space-y-2.5 text-xs text-left">
          
          {profile.whatsapp && (
            <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex justify-between items-center bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 p-3 rounded-xl transition-all">
              <span className="font-bold text-emerald-400">💬 WhatsApp Chat</span>
              <span className="text-emerald-300">Open ↗</span>
            </a>
          )}

          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex justify-between items-center bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all">
              <span className="opacity-70 font-semibold">📧 Email</span>
              <span className="font-mono text-blue-400">{profile.email}</span>
            </a>
          )}

          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="flex justify-between items-center bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all">
              <span className="opacity-70 font-semibold">📞 Call Phone</span>
              <span className="font-mono">{profile.phone}</span>
            </a>
          )}

          {profile.website && (
            <a href={profile.website} target="_blank" rel="noreferrer" className="flex justify-between items-center bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all">
              <span className="opacity-70 font-semibold">🌐 Website</span>
              <span className="text-blue-400">Visit ↗</span>
            </a>
          )}

          {profile.google_maps && (
            <a href={profile.google_maps} target="_blank" rel="noreferrer" className="flex justify-between items-center bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 p-3 rounded-xl transition-all">
              <span className="font-bold text-rose-300">📍 Google Location</span>
              <span className="text-rose-200">Open Maps ↗</span>
            </a>
          )}

          {profile.google_reviews && (
            <a href={profile.google_reviews} target="_blank" rel="noreferrer" className="flex justify-between items-center bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 p-3 rounded-xl transition-all">
              <span className="font-bold text-amber-300">⭐ Leave Google Review</span>
              <span className="text-amber-200">Review ↗</span>
            </a>
          )}

          {profile.payment_link && (
            <a href={profile.payment_link} target="_blank" rel="noreferrer" className="flex justify-between items-center bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 p-3 rounded-xl transition-all">
              <span className="font-bold text-purple-300">💳 Pay / UPI</span>
              <span className="text-purple-200">Pay Now ↗</span>
            </a>
          )}
        </div>

        {/* Social Buttons Row */}
        {(profile.instagram || profile.facebook) && (
          <div className="flex justify-center items-center gap-3 pt-2">
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noreferrer" className="flex-1 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-xs font-bold text-white shadow-md">
                Instagram ↗
              </a>
            )}
            {profile.facebook && (
              <a href={profile.facebook} target="_blank" rel="noreferrer" className="flex-1 p-3 bg-blue-600 rounded-xl text-xs font-bold text-white shadow-md">
                Facebook ↗
              </a>
            )}
          </div>
        )}

      </div>
    </main>
  );
}