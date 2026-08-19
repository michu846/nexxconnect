import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: `Missing Envs: URL=${!!supabaseUrl}, KEY=${!!serviceRoleKey}` },
        { status: 500 }
      );
    }

    const { handle, password } = await req.json();
    const cleanHandle = handle?.toLowerCase().trim();
    const virtualEmail = `${cleanHandle}@nexxconnect.internal`;

    // 1. Create auth user
    const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        email: virtualEmail,
        password: password,
        email_confirm: true,
      }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      return NextResponse.json({ error: `Auth Error: ${JSON.stringify(authData)}` }, { status: 400 });
    }

    // 2. Insert card row
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        user_id: authData.id,
        handle: cleanHandle,
        full_name: cleanHandle,
      }),
    });

    if (!dbRes.ok) {
      const dbError = await dbRes.json();
      return NextResponse.json({ error: `DB Error: ${JSON.stringify(dbError)}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, handle: cleanHandle });
  } catch (err: any) {
    // Return the actual network or execution cause
    return NextResponse.json(
      { error: `Network/Fetch failure: ${err?.message || err?.cause || String(err)}` },
      { status: 500 }
    );
  }
}import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(`Missing Envs: URL=${!!supabaseUrl}, KEY=${!!serviceRoleKey}`);
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
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
        { error: 'Handle must be 3-20 characters, letters/numbers/underscores only' },
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
      console.error('Auth error:', authError);
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
      console.error('DB error:', dbError);
      // Roll back created auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Could not create profile' }, { status: 400 });
    }

    return NextResponse.json({ success: true, handle: cleanHandle });
  } catch (err: any) {
    console.error('Signup route failure:', err);
    return NextResponse.json({ error: err?.message || 'Unexpected server error' }, { status: 500 });
  }
}