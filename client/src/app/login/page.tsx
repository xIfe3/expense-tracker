'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/toast';
import { Wallet, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast('Welcome back!', 'success');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Dark panel */}
      <div className="relative hidden w-[480px] shrink-0 overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-600/5 blur-[100px]" />

        <div className="relative p-10">
          <div className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5 text-blue-400" />
            <span className="font-bold">SpendWise</span>
          </div>
        </div>

        <div className="relative space-y-8 p-10">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Your finances,<br />under control.
          </h2>
          <div className="space-y-3">
            {[
              'Track every naira you spend',
              'Visual budgets that keep you honest',
              'Private — no bank linking needed',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm text-slate-400">
                <div className="h-1 w-1 rounded-full bg-blue-400" />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-t border-white/5 p-10">
          <p className="text-xs text-slate-600">
            Privacy-first design. Your data never leaves your control.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-12 flex items-center gap-2 lg:hidden">
            <Wallet className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-slate-900">SpendWise</span>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            New here?{' '}
            <Link href="/register" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
