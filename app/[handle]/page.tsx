'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PublicCardPage() {
  const params = useParams();
  const handle = params?.handle as string;

  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!handle) return;

    const fetchCard = async () => {
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('handle', handle.toLowerCase().trim())
          .maybeSingle();

        if (error || !data) {
          setNotFound(true);
        } else {
          setCard(data);
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
          <div className="h-4 w-32 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
          <h1 className="text-2xl font-bold text-slate-200">Card Not Found</h1>
          <p className="text-xs text-slate-400">
            The card handle <span className="text-blue-400">"{handle}"</span> does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Get initials for fallback icon
  const initials = card.full_name
    ? card.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'NC';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-center shadow-2xl">
        
        {/* Avatar Container */}
        <div className="relative w-28 h-28 mx-auto">
          {card.avatar_url && !imgError ? (
            <img
              src={card.avatar_url}
              alt=""
              onError={() => setImgError(true)}
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-800 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-xl font-bold text-slate-300">
              {initials}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{card.full_name || 'Anonymous'}</h1>
          {card.job_title && (
            <p className="text-xs font-medium text-slate-400">{card.job_title}</p>
          )}
          {card.location && (
            <p className="text-xs text-slate-500">📍 {card.location}</p>
          )}
        </div>

        {card.bio && (
          <p className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
            {card.bio}
          </p>
        )}

        {/* Action & Social Links */}
        <div className="space-y-2 pt-2">
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="block w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl text-xs transition"
            >
              📞 Call Phone
            </a>
          )}
          {card.whatsapp && (
            <a
              href={`https://wa.me/${card.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl text-xs transition"
            >
              💬 WhatsApp
            </a>
          )}
          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition border border-slate-700"
            >
              🌐 Website
            </a>
          )}
          {card.facebook && (
            <a
              href={card.facebook.startsWith('http') ? card.facebook : `https://${card.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-xl text-xs transition"
            >
              📘 Facebook
            </a>
          )}
          {card.instagram && (
            <a
              href={card.instagram.startsWith('http') ? card.instagram : `https://${card.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-pink-600 hover:bg-pink-500 font-semibold rounded-xl text-xs transition"
            >
              📸 Instagram
            </a>
          )}
          {card.linkedin && (
            <a
              href={card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-sky-700 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs transition"
            >
              💼 LinkedIn
            </a>
          )}
          {card.google_reviews && (
            <a
              href={card.google_reviews.startsWith('http') ? card.google_reviews : `https://${card.google_reviews}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs transition"
            >
              ⭐ Google Reviews
            </a>
          )}
          {card.payment_link && (
            <a
              href={card.payment_link.startsWith('http') ? card.payment_link : `https://${card.payment_link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs transition"
            >
              💳 Payment / UPI
            </a>
          )}
        </div>
      </div>
    </div>
  );
}