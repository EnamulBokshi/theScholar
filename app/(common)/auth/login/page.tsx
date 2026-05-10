"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GoogleButton from '@/components/google-button';
import { signIn } from '@/lib/auth-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await signIn.email({ email, password });
      if (error) setError('Invalid email or password');
      else router.push('/');
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative bg-background flex items-stretch">
      {/* Left: hero image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/banner_1.jpg" alt="Scholar AI" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/30 to-primary/20" />
        <div className="absolute inset-0 z-10 flex flex-col justify-center p-12 text-white">
          <h2 className="text-4xl font-extrabold max-w-lg">Welcome back</h2>
          <p className="mt-4 text-lg text-white/80 max-w-md">Sign in to continue your learning journey and access saved conversations.</p>
        </div>
      </div>

      {/* Right: glass sign-in */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-card/80 border border-border/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h3 className="text-3xl font-bold text-foreground">Sign in to your account</h3>
          <p className="mt-2 text-sm text-muted-foreground">Access your history, voice conversations, and personalized insights.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Email address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                type="email"
                required
                className="w-full rounded-xl border border-border/40 bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                type="password"
                required
                className="w-full rounded-xl border border-border/40 bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            {error && <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <button disabled={loading} className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-medium hover:opacity-95 transition">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-background/80 px-4 text-muted-foreground">OR CONTINUE WITH</span></div>
          </div>

          <GoogleButton />

          <p className="mt-6 text-center text-sm text-muted-foreground">Don’t have an account? <a href="/auth/signup" className="text-accent hover:underline">Create account</a></p>
        </div>
      </div>
    </div>
  );
}
