import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function PublicCardPage({
  params,
}: {
  params: { handle: string };
}) {
  const handle = params.handle.toLowerCase();

  // Fetch the card data from Supabase using the handle slug
  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('handle', handle)
    .single();

  // If card is not found in database, show 404
  if (error || !card) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
        
        {/* Profile Photo */}
        {card.photo_url && (
          <img
            src={card.photo_url}
            alt={card.full_name}
            className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
        )}

        {/* Name & Job Title */}
        <div>
          <h1 className="text-2xl font-bold">{card.full_name || card.handle}</h1>
          {card.job_title && <p className="text-slate-400 text-sm mt-1">{card.job_title}</p>}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="block w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition"
            >
              📞 Call Me
            </a>
          )}

          {card.whatsapp && (
            <a
              href={`https://wa.me/${card.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold transition"
            >
              💬 WhatsApp
            </a>
          )}

          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
            >
              🌐 Visit Website
            </a>
          )}

          {card.instagram && (
            <a
              href={card.instagram}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 bg-pink-600 hover:bg-pink-500 rounded-xl font-semibold transition"
            >
              📸 Instagram
            </a>
          )}

          {card.facebook && (
            <a
              href={card.facebook}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 bg-blue-700 hover:bg-blue-600 rounded-xl font-semibold transition"
            >
              👍 Facebook
            </a>
          )}

          {card.location && (
            <a
              href={card.location}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition"
            >
              📍 Google Location
            </a>
          )}

          {card.google_reviews && (
            <a
              href={card.google_reviews}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold transition"
            >
              ⭐ Google Reviews
            </a>
          )}

          {card.upi && (
            <a
              href={card.upi}
              className="block w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition"
            >
              💳 Pay via UPI
            </a>
          )}
        </div>
      </div>
    </main>
  );
}