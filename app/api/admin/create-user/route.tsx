import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server misconfiguration: Missing Envs' }, { status: 500 });
    }

    // Force standard global fetch configuration
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
      },
    });

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { handle, password } = body;
    const cleanHandle = typeof handle === 'string' ? handle.toLowerCase().trim() : '';

    if (!/^[a-z0-9_]{3,20}$/.test(cleanHandle)) {
      return NextResponse.json(
        { error: 'Handle must be 3-20 characters (letters, numbers, underscores)' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const virtualEmail = `${cleanHandle}@nexxconnect.internal`;

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: virtualEmail,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      if (/already/i.test(authError.message)) {
        return NextResponse.json({ error: 'Handle is already taken' }, { status: 409 });
      }
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Insert card row
    const { error: dbError } = await supabaseAdmin.from('cards').insert([
      {
        user_id: authData.user.id,
        handle: cleanHandle,
        full_name: cleanHandle,
      },
    ]);

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: dbError.message || 'Could not create card profile' }, { status: 400 });
    }

    return NextResponse.json({ success: true, handle: cleanHandle });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ? `Execution error: ${err.message}` : 'Unexpected server error' },
      { status: 500 }
    );
  }
}