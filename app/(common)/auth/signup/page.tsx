"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GoogleButton from "@/components/google-button";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const { error } = await signUp.email({
        email,
        password,
        name: email.split("@")[0],
      });

      if (error) {
        if (error.code === "USER_ALREADY_EXISTS") {
          setError("This email is already exists.");
        } else {
          setError(error.message || "Failed to sign up");
        }
      } else {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative bg-background flex items-stretch">
      {/* Left: large photo */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/banner_1.jpg" alt="Scholar AI" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/30 to-primary/20" />
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium border border-white/10">Welcome to The Scholar</span>
            <h2 className="mt-8 text-4xl font-extrabold max-w-lg">Wisdom meets thoughtful AI</h2>
            <p className="mt-4 text-lg text-white/80 max-w-md">Explore traditions, compare perspectives, and learn with guidance from an AI scholar.</p>
          </div>

          <blockquote className="border-l-4 border-primary/60 pl-4 text-white/80 italic">“Knowledge is the lamp that leads the seeker.” — The Scholar</blockquote>
        </div>
      </div>

      {/* Right: glass form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-card/80 border border-border/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h3 className="text-3xl font-bold text-foreground">Create your Scholar account</h3>
          <p className="mt-2 text-sm text-muted-foreground">Start free — upgrade for voice conversations, saved history, and admin tools.</p>

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
                placeholder="Create a strong password"
                type="password"
                required
                className="w-full rounded-xl border border-border/40 bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            {error && <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <button disabled={loading} className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-medium hover:opacity-95 transition">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-background/80 px-4 text-muted-foreground">OR CONTINUE WITH</span></div>
          </div>

          <GoogleButton />

          <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <a href="/auth/login" className="text-accent hover:underline">Sign in</a></p>
        </div>
      </div>
    </div>
  );
}