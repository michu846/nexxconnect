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
      fetchCardDetails();
    }
  }, [handle]);

  const fetchCardDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('handle', handle.toLowerCase())
        .single();

      if (data) {
        setCard(data);
      }
    } catch (err) {
      console.error('Error fetching card:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate and download the vCard (.vcf)
  const downloadVCard = () => {
    if (!card) return;

    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.full_name || card.handle}`,
      `N:;${card.full_name || card.handle};;;`,
      card.job_title ? `TITLE:${card.job_title}` : '',
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : '',
      card.whatsapp ? `TEL;TYPE=WORK,VOICE:${card.whatsapp}` : '',
      card.website ? `URL:${card.website}` : '',
      card.location ? `ADR;TYPE=WORK:;;${card.location};;;;` : '',
      card.bio ? `NOTE:${card.bio}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${card.handle || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="animate-pulse text-sm text-slate-400">Loading business card...</div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
        <p className="text-sm text-slate-400">The profile @{handle} does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
        
        {/* Profile Header */}
        <div className="space-y-3">
          {card.avatar_url ? (
            <img
              src={card.avatar_url}
              alt={card.full_name || card.handle}
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 mx-auto flex items-center justify-center text-3xl shadow-md">
              👤
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold text-white">{card.full_name || card.handle}</h1>
            {card.job_title && <p className="text-xs text-blue-400 font-medium mt-0.5">{card.job_title}</p>}
            {card.location && <p className="text-xs text-slate-400 mt-0.5">📍 {card.location}</p>}
          </div>

          {card.bio && (
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              {card.bio}
            </p>
          )}
        </div>

        {/* SAVE CONTACT BUTTON (V-CARD DOWNLOAD) */}
        <button
          onClick={downloadVCard}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
        >
          📇 Save Contact to Phone
        </button>

        {/* Contact Actions & Links */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-700"
            >
              📞 Call {card.phone}
            </a>
          )}

          {card.whatsapp && (
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-green-500/30"
            >
              💬 Chat on WhatsApp
            </a>
          )}

          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-700"
            >
              🌐 Visit Website
            </a>
          )}

          {card.instagram && (
            <a
              href={card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-700"
            >
              📸 Instagram Profile
            </a>
          )}
        </div>

        {/* Footer Brand */}
        <div className="pt-2 text-[10px] text-slate-500 font-mono">
          Powered by <span className="text-blue-400">NexxConnect</span>
        </div>

      </div>
    </div>
  );
}