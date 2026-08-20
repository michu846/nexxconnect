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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-center shadow-2xl">
        {card.avatar_url && (
          <img
            src={card.avatar_url}
            alt={card.full_name || 'Profile'}
            className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-slate-800 shadow-md"
          />
        )}

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
              🌐 Visit Website
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
        </div>
      </div>
    </div>
  );
}