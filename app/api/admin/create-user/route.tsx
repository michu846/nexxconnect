import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!url || !key) return NextResponse.json({ error: 'Missing Envs' }, { status: 500 });

  const supabase = createClient(url, key);

  try {
    const body = await req.json();
    const {
      handle, password, full_name, job_title, phone, whatsapp, location, bio, theme, avatar_url, facebook, instagram, linkedin, website, google_reviews, payment_link
    } = body;

    const cleanHandle = handle.toLowerCase().trim();
    const email = `${cleanHandle}@nexxconnect.internal`;

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
    });

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    const { error: dbError } = await supabase.from('cards').insert([{
      user_id: authData.user.id,
      handle: cleanHandle,
      full_name: full_name || cleanHandle,
      job_title: job_title || '',
      phone: phone || '',
      whatsapp: whatsapp || '',
      location: location || '',
      bio: bio || '',
      theme: theme || 'dark',
      avatar_url: avatar_url || '',
      facebook: facebook || '',
      instagram: instagram || '',
      linkedin: linkedin || '',
      website: website || '',
      google_reviews: google_reviews || '',
      payment_link: payment_link || '',
    }]);

    if (dbError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, handle: cleanHandle });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}