import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_SERVICE_ROLE_KEY environment variable.' },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { email, password, handle, fullName } = await req.json();

    if (!email || !password || !handle) {
      return NextResponse.json(
        { error: 'Email, password, and handle are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const cleanedHandle = handle.toLowerCase().trim();

    // 1. Check if handle already exists
    const { data: existingCard } = await supabaseAdmin
      .from('cards')
      .select('id')
      .eq('handle', cleanedHandle)
      .maybeSingle();

    if (existingCard) {
      return NextResponse.json(
        { error: `Handle "${cleanedHandle}" is already taken.` },
        { status: 400 }
      );
    }

    // 2. Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: password,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: authError?.message || 'Failed to create auth user.' },
        { status: 400 }
      );
    }

    const userId = authUser.user.id;

    // 3. Insert card record
    const { error: cardError } = await supabaseAdmin.from('cards').insert({
      user_id: userId,
      handle: cleanedHandle,
      full_name: fullName || '',
      theme: 'dark',
    });

    if (cardError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: cardError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, userId, handle: cleanedHandle });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}