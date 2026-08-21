import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, handle, fullName } = body;

    if (!email || !password || !handle) {
      return NextResponse.json({ error: 'Email, handle, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // 1. Create account in Supabase Auth with custom password
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    // 2. Link card handle to newly created user UUID
    const { error: cardError } = await supabaseAdmin
      .from('cards')
      .upsert(
        {
          user_id: authUser.user.id,
          handle: handle.toLowerCase().trim(),
          full_name: fullName || '',
        },
        { onConflict: 'handle' }
      );

    if (cardError) throw cardError;

    return NextResponse.json({ success: true, userId: authUser.user.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}