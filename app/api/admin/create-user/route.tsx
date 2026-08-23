import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching empty responses

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ 
      error: 'Missing environment variables. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' 
    }, { status: 500 });
  }

  // Create client directly with service role key
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // 1. Fetch Auth Users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json({ error: `Auth Error: ${authError.message}` }, { status: 400 });
    }

    // 2. Fetch Cards Table
    const { data: cards, error: cardsError } = await supabaseAdmin
      .from('cards')
      .select('user_id, handle, full_name');

    // 3. Map Users
    const users = (authData?.users || []).map((u) => {
      const card = cards?.find((c) => c.user_id === u.id);
      return {
        id: u.id,
        email: u.email || 'No Email',
        handle: card?.handle || 'no-handle',
        fullName: card?.full_name || '',
      };
    });

    return NextResponse.json({ users, count: users.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { userId, newPassword } = await req.json();

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}