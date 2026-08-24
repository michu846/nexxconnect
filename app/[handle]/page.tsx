'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PublicCardPage() {
  const params = useParams();
  const handle = params?.handle as string;

  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (handle) {
      fetchCardData();
    }
  }, [handle]);

  const fetchCardData = async () => {
    try {
      // Ensure company_name is selected in the database query
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('handle', handle)
        .single();

      if (error) throw error;
      setCard(data);
    } catch (err) {
      console.error('Error fetching card:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadVCard = () => {
    if (!card) return;

    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.full_name || ''}`,
      card.company_name ? `ORG:${card.company_name}` : '',
      card.job_title ? `TITLE:${card.job_title}` : '',
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : '',
      card.website ? `URL:${card.website}` : '',
      card.bio ? `NOTE:${card.bio}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${card.full_name || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="animate-pulse text-sm text-slate-400">Loading card...</div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold">Card Not Found</h1>
          <p className="text-xs text-slate-400 mt-1">This digital card does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4">
        
        {/* Profile Picture */}
        {card.avatar_url ? (
          <img
            src={card.avatar_url}
            alt={card.full_name || 'Profile'}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl shadow-lg">
            👤
          </div>
        )}

        {/* Name & Details */}
        <div>
          <h1 className="text-xl font-bold text-white">{card.full_name || card.handle}</h1>
          
          {/* DISPLAY COMPANY NAME */}
          {card.company_name && (
            <p className="text-sm font-semibold text-slate-300 mt-0.5">{card.company_name}</p>
          )}

          {/* DISPLAY JOB TITLE */}
          {card.job_title && (
            <p className="text-xs text-blue-400 font-medium mt-0.5">{card.job_title}</p>
          )}

          {card.location && (
            <p className="text-xs text-slate-400 mt-1">📍 {card.location}</p>
          )}
        </div>

        {/* Bio */}
        {card.bio && (
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 w-full">
            {card.bio}
          </p>
        )}

        {/* Save Contact Button */}
        <button
          onClick={downloadVCard}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition text-xs shadow-lg flex items-center justify-center gap-2"
        >
          📲 Save to Contacts
        </button>

        {/* Social & Contact Links */}
        <div className="w-full space-y-2 pt-2">
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              📞 Call {card.phone}
            </a>
          )}

          {card.whatsapp && (
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              💬 WhatsApp
            </a>
          )}

          {card.google_review && (
            <a
              href={card.google_review}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              ⭐ Leave Google Review
            </a>
          )}

          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              🌐 Visit Website
            </a>
          )}

          {card.linkedin && (
            <a
              href={card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-sky-600/20 text-sky-400 border border-sky-500/30 hover:bg-sky-600/30 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              💼 LinkedIn
            </a>
          )}

          {card.instagram && (
            <a
              href={card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-pink-600/20 text-pink-400 border border-pink-500/30 hover:bg-pink-600/30 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              📸 Instagram
            </a>
          )}

          {card.facebook && (
            <a
              href={card.facebook.startsWith('http') ? card.facebook : `https://${card.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              📘 Facebook
            </a>
          )}
        </div>

      </div>
    </div>
  );
}