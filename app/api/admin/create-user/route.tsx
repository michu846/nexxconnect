import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Fallback checks prevent fetch failed crashes on Vercel serverless environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server environment variables missing on Vercel.' },
        { status: 500 }
      );
    }

    const { handle, password } = await req.json();
    const cleanHandle = handle.toLowerCase().trim();
    const virtualEmail = `${cleanHandle}@nexxconnect.internal`;

    // 1. Create auth user in Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: virtualEmail,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Pre-create card row
    const { error: cardError } = await supabaseAdmin
      .from('cards')
      .insert([
        {
          user_id: authData.user.id,
          handle: cleanHandle,
          full_name: cleanHandle,
        },
      ]);

    if (cardError) {
      return NextResponse.json({ error: cardError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, handle: cleanHandle });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 