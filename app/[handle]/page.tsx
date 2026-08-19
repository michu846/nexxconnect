import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// Tells Next.js to render this dynamically per request instead of static build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ handle?: string }> | { handle?: string };
}

export default async function HandlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawHandle = resolvedParams?.handle;

  // Handle cases where handle isn't provided
  if (!rawHandle || typeof rawHandle !== 'string') {
    notFound();
  }

  const handle = rawHandle.toLowerCase();

  // Fetch card data from Supabase
  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('handle', handle)
    .single();

  if (error || !card) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
        <p className="text-slate-400 text-sm">
          No card exists for <span className="text-blue-400">@{handle}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-6">
        {/* Profile Image */}
        {card.photo_url ? (
          <img
            src={card.photo_url}
            alt={card.full_name || 'Profile'}
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/30 shadow-lg"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-bold text-slate-400">
            {card.full_name ? card.full_name.charAt(0).toUpperCase() : '?'}
          </div>
        )}

        {/* User Info */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            {card.full_name || 'Anonymous User'}
          </h1>
          {card.job_title && (
            <p className="text-sm text-blue-400 font-medium mt-1">
              {card.job_title}
            </p>
          )}
        </div>

        {/* Contact & Links */}
        <div className="w-full space-y-3 pt-2">
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl flex items-center justify-center font-medium text-sm transition"
            >
              📞 Call {card.phone}
            </a>
          )}

          {card.whatsapp && (
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 rounded-xl flex items-center justify-center font-medium text-sm transition"
            >
              💬 WhatsApp
            </a>
          )}

          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 rounded-xl flex items-center justify-center font-medium text-sm transition"
            >
              🌐 Visit Website
            </a>
          )}

          {card.instagram && (
            <a
              href={card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-400 rounded-xl flex items-center justify-center font-medium text-sm transition"
            >
              📸 Instagram
            </a>
          )}

          {card.facebook && (
            <a
              href={card.facebook.startsWith('http') ? card.facebook : `https://facebook.com/${card.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-600/40 text-blue-300 rounded-xl flex items-center justify-center font-medium text-sm transition"
            >
              📘 Facebook
            </a>
          )}

          {card.location && (
            <a
              href={card.location}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl flex items-center justify-center font-medium text-sm transition"
            >
              📍 View Location
            </a>
          )}

          {card.google_reviews && (
            <a
              href={card.google_reviews}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-400 rounded-xl flex items-center justify-center font-medium text-sm transition"
            >
              ⭐ Google Reviews
            </a>
          )}

          {card.upi && (
            <a
              href={card.upi}
              className="w-full py-3 px-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 rounded-xl flex items-center justify-center font-medium text-sm transition"
            >
              💳 Pay via UPI
            </a>
          )}
        </div>

        <p className="text-xs text-slate-500 pt-4">Powered by NexxConnect</p>
      </div>
    </div>
  );
}