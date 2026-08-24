import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server key configuration error' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { handle } = await req.json();

    if (!handle) {
      return NextResponse.json({ error: 'Handle required' }, { status: 400 });
    }

    // Find card linking user_id
    const { data: card, error: cardError } = await supabaseAdmin
      .from('cards')
      .select('user_id')
      .eq('handle', handle.toLowerCase().trim())
      .single();

    if (cardError || !card) {
      return NextResponse.json({ error: 'Handle not found' }, { status: 404 });
    }

    // Get auth email from Supabase Admin Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(card.user_id);

    if (authError || !authUser.user?.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    return NextResponse.json({ email: authUser.user.email });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}