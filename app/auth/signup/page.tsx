"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleButton from '@/components/google-button';
import { signUp } from '@/lib/auth-client';

export default function SignupPage() {
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
      const {error, data} = await signUp.email({email, password, name: email.split('@')[0]});
      if(error){
        setError('Failed to sign up: ' + error.message);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          className="p-2 border rounded"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          className="p-2 border rounded"
        />
        <button disabled={loading} className="bg-green-600 text-white p-2 rounded">
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
      {error && <p className="text-red-600 mt-3">{error}</p>}
      <div className="mt-4">
        <GoogleButton />
      </div>
    </div>
  );
}
