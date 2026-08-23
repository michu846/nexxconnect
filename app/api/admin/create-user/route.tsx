import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch all auth users merged with their card handles
export async function GET() {
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth Error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const { data: cards, error: cardsError } = await supabaseAdmin
      .from('cards')
      .select('user_id, handle, full_name, phone');

    if (cardsError) {
      console.error('Cards Error:', cardsError);
    }

    const users = (authData?.users || []).map((u) => {
      const card = cards?.find((c) => c.user_id === u.id);
      return {
        id: u.id,
        email: u.email || 'No email',
        createdAt: u.created_at,
        handle: card?.handle || 'no-handle',
        fullName: card?.full_name || '',
        phone: card?.phone || '',
      };
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Reset customer password
export async function POST(req: Request) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Valid User ID and 8+ character password required' }, { status: 400 });
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