"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { verifyEmailOtp } from "@/actions/auth-actions";

import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/auth/signup");
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyEmailOtp(email, code);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(result.error || "Verification failed");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-card/80 border border-border/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center">
        <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <ShieldCheck className="size-8 text-primary" />
        </div>
        <h3 className="text-3xl font-bold text-foreground">Email Verified!</h3>
        <p className="mt-4 text-muted-foreground">Your email has been successfully verified. Redirecting you to login...</p>
        <div className="mt-8">
          <Loader2 className="size-6 animate-spin mx-auto text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-card/80 border border-border/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
      <Link href="/auth/signup" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="size-4" />
        Back to signup
      </Link>

      <div className="mx-auto size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Mail className="size-7 text-primary" />
      </div>

      <h3 className="text-3xl font-bold text-foreground">Check your email</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        We've sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="size-12 rounded-xl border border-border/40 bg-card/60 text-center text-xl font-bold outline-none focus:ring-2 focus:ring-accent/40 transition-all"
            />
          ))}
        </div>

        {error && <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive text-center">{error}</div>}

        <button
          disabled={loading || otp.join("").length !== 6}
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-medium hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify Email"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Didn't receive the code?{" "}
        <button className="text-accent hover:underline font-medium">Resend Code</button>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen relative bg-background flex items-stretch">
      {/* Left: hero image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/banner_1.jpg" alt="Scholar AI" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/30 to-primary/20" />
        <div className="absolute inset-0 z-10 flex flex-col justify-center p-12 text-white">
          <h2 className="text-4xl font-extrabold max-w-lg">One last step</h2>
          <p className="mt-4 text-lg text-white/80 max-w-md">Verify your email to unlock all features of The Scholar.</p>
        </div>
      </div>

      {/* Right: glass content */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <Suspense fallback={<Loader2 className="size-8 animate-spin text-primary" />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
