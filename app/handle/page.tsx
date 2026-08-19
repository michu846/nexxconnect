import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function PublicCardPage({
  params,
}: {
  params: { handle: string };
}) {
  const handle = params.handle.toLowerCase();

  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('handle', handle)
    .single();

  if (error || !card) {
    notFound();
  }

  // Theme configuration map
  const themes: Record<string, { bg: string; cardBg: string; text: string; accent: string; border: string }> = {
    'classic-dark': {
      bg: 'bg-slate-950',
      cardBg: 'bg-slate-900/80',
      text: 'text-white',
      accent: 'from-blue-600 to-indigo-600',
      border: 'border-slate-800',
    },
    'neon-cyber': {
      bg: 'bg-black',
      cardBg: 'bg-cyan-950/30',
      text: 'text-cyan-100',
      accent: 'from-cyan-500 to-fuchsia-500',
      border: 'border-cyan-500/30',
    },
    'sunset-glow': {
      bg: 'bg-neutral-950',
      cardBg: 'bg-orange-950/30',
      text: 'text-orange-100',
      accent: 'from-amber-500 to-rose-600',
      border: 'border-rose-500/30',
    },
    'emerald-glass': {
      bg: 'bg-slate-950',
      cardBg: 'bg-emerald-950/30',
      text: 'text-emerald-100',
      accent: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-500/30',
    },
  };

  const currentTheme = themes[card.theme] || themes['classic-dark'];

  return (
    <main className={`min-h-screen ${currentTheme.bg} text-white flex justify-center py-6 px-3`}>
      <div className="w-full max-w-md space-y-4 font-sans">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center px-2 py-1">
          <span className="font-bold text-lg tracking-wide text-blue-400">NexxConnect</span>
          <button className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-700 transition">
            ↗ Share
          </button>
        </div>

        {/* Profile Card Header */}
        <div className={`p-6 rounded-3xl ${currentTheme.cardBg} border ${currentTheme.border} text-center space-y-3 relative overflow-hidden shadow-2xl`}>
          <div className="relative inline-block">
            <img
              src={card.photo_url || 'https://via.placeholder.com/150'}
              alt={card.full_name}
              className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-blue-500 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 text-xs">
              ✓
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold">{card.full_name || card.handle}</h1>
            <p className="text-xs text-blue-400 font-medium mt-1">{card.job_title}</p>
          </div>

          {/* Quick Action Buttons (Call, WhatsApp, Email) */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {card.whatsapp && (
              <a
                href={`https://wa.me/${card.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition"
              >
                💬 WhatsApp
              </a>
            )}
            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="py-2.5 px-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition"
              >
                📞 Call
              </a>
            )}
            <a
              href={`mailto:contact@${card.handle}.com`}
              className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition"
            >
              ✉️ Email
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className={`p-5 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} space-y-2`}>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/20 rounded-lg text-blue-400">👤</span>
            <h2 className="font-semibold text-sm">About Me</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hi, I'm {card.full_name || card.handle}. Passionate about delivering value, technology solutions, and connecting people.
          </p>
        </div>

        {/* Connect With Me (Social Links Grid) */}
        <div className={`p-5 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} space-y-3`}>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/20 rounded-lg text-blue-400">🔗</span>
            <h2 className="font-semibold text-sm">Connect With Me</h2>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {card.instagram && (
              <a href={card.instagram} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 hover:scale-105 transition">
                <span className="w-10 h-10 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-lg">📸</span>
                <span className="text-[10px] text-slate-300">Instagram</span>
              </a>
            )}
            {card.facebook && (
              <a href={card.facebook} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 hover:scale-105 transition">
                <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-lg">👍</span>
                <span className="text-[10px] text-slate-300">Facebook</span>
              </a>
            )}
            {card.website && (
              <a href={card.website} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 hover:scale-105 transition">
                <span className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-lg">🌐</span>
                <span className="text-[10px] text-slate-300">Website</span>
              </a>
            )}
            {card.upi && (
              <a href={card.upi} className="flex flex-col items-center gap-1 hover:scale-105 transition">
                <span className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-lg">💳</span>
                <span className="text-[10px] text-slate-300">Pay UPI</span>
              </a>
            )}
          </div>
        </div>

        {/* Location Section */}
        {card.location && (
          <div className={`p-5 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} flex justify-between items-center`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400">📍</span>
                <h2 className="font-semibold text-sm">Location</h2>
              </div>
              <p className="text-xs text-slate-400">View map direction</p>
            </div>
            <a href={card.location} target="_blank" rel="noreferrer" className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-semibold">
              Open Map
            </a>
          </div>
        )}

        {/* Tap to Connect (NFC Banner) */}
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentTheme.accent} flex justify-between items-center shadow-lg`}>
          <div>
            <p className="font-bold text-sm">Tap to Connect</p>
            <p className="text-[11px] text-slate-200">Use NFC card to instantly share profile</p>
          </div>
          <span className="text-2xl">📱</span>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 pb-4">
          <p className="text-xs text-slate-500">Powered by <strong className="text-blue-400">NexxConnect</strong></p>
          <p className="text-[10px] text-slate-600">One Link. Everything About You.</p>
        </div>

      </div>
    </main>
  );
}