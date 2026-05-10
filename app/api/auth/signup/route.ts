import { NextResponse } from 'next/server';
import { signUpWithPassword } from '@/actions/auth.action';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const result = await signUpWithPassword(email, password);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
