import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function CardPage({ params }: { params: { handle: string } }) {
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('handle', params.handle.toLowerCase())
    .single();

  if (!card) {
    notFound();
  }

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
        {/* Profile Avatar / Photo */}
        <div className="flex justify-center">
          {card.avatar_url ? (
            <img
              src={card.avatar_url}
              alt={card.full_name || 'Profile'}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-slate-300">
              {getInitial(card.full_name)}
            </div>
          )}
        </div>

        {/* User Details */}
        <div>
          <h1 className="text-2xl font-bold text-white">{card.full_name}</h1>
          {card.job_title && (
            <p className="text-sm text-blue-400 mt-1 font-medium">{card.job_title}</p>
          )}
          {card.bio && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-3">{card.bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              📞 Call {card.phone}
            </a>
          )}

          {card.whatsapp && (
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 border border-emerald-800/60 transition"
            >
              💬 WhatsApp
            </a>
          )}

          {card.instagram && (
            <a
              href={card.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-pink-950/60 hover:bg-pink-900/60 text-pink-400 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 border border-pink-800/60 transition"
            >
              📸 Instagram
            </a>
          )}

          {card.facebook && (
            <a
              href={card.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-blue-950/60 hover:bg-blue-900/60 text-blue-400 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 border border-blue-800/60 transition"
            >
              📘 Facebook
            </a>
          )}

          {card.location && (
            <a
              href={
                card.location.startsWith('http')
                  ? card.location
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              📍 View Location
            </a>
          )}

          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              🌐 Website
            </a>
          )}

          {card.payment_link && (
            <a
              href={card.payment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-amber-950/60 hover:bg-amber-900/60 text-amber-400 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 border border-amber-800/60 transition"
            >
              💳 Pay Now
            </a>
          )}
        </div>

        <p className="text-[10px] text-slate-500 pt-4">Powered by NexxConnect</p>
      </div>
    </div>
  );
}