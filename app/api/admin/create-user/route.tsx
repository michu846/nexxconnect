import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing environment variables on server.' },
      { status: 500 }
    );
  }

  // Admin client bypasses RLS and Auth rest locks
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // 1. Fetch Users from Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json({ error: `Auth Error: ${authError.message}` }, { status: 400 });
    }

    // 2. Fetch Card Profiles from Database
    const { data: cards, error: cardsError } = await supabaseAdmin
      .from('cards')
      .select('user_id, handle, full_name, phone');

    if (cardsError) {
      console.warn('Cards Table Error:', cardsError.message);
    }

    // 3. Map Auth Accounts with Card Table Records
    const users = (authData?.users || []).map((u) => {
      const card = (cards || []).find((c) => c.user_id === u.id);
      return {
        id: u.id,
        email: u.email || 'No email registered',
        createdAt: u.created_at,
        handle: card?.handle || 'no-handle',
        fullName: card?.full_name || '',
        phone: card?.phone || '',
      };
    });

    return NextResponse.json({ users, count: users.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'User ID & 8+ char password required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}