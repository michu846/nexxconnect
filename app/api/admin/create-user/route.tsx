import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Trim white spaces and remove any trailing slashes from the URL
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseUrl = rawUrl.trim().replace(/\/+$/, '');
    const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase URL or Service Role Key missing in environment variables.' },
        { status: 500 }
      );
    }

    const { handle, password } = await req.json();
    if (!handle || !password) {
      return NextResponse.json({ error: 'Handle and password are required.' }, { status: 400 });
    }

    const cleanHandle = handle.toLowerCase().trim();
    const virtualEmail = `${cleanHandle}@nexxconnect.internal`;

    // 1. Create auth user via Supabase Auth Admin REST API
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
      return NextResponse.json(
        { error: authData.msg || authData.message || authData.error_description || 'Auth user creation failed' },
        { status: 400 }
      );
    }

    // 2. Insert card row via Supabase Database REST API
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
      return NextResponse.json(
        { error: dbError.message || 'Failed to create card database row' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, handle: cleanHandle });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}