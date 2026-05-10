import { NextResponse } from 'next/server';
import { signOut } from '@/actions/auth.action';

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
