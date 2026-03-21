'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/toast';
import { Wallet, Eye, EyeOff, ArrowRight, UserPlus, Check } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const checks = [
    { label: 'At least 6 characters', ok: password.length >= 6 },
    { label: 'Contains a number', ok: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast('Account created! Welcome to SpendWise.', 'success');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Dark panel */}
      <div className="relative hidden w-[480px] shrink-0 overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-emerald-600/5 blur-[120px]" />
        <div className="absolute bottom-20 left-0 h-64 w-64 rounded-full bg-blue-600/5 blur-[100px]" />

        <div className="relative p-10">
          <div className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5 text-blue-400" />
            <span className="font-bold">SpendWise</span>
          </div>
        </div>

        <div className="relative space-y-8 p-10">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Start your<br />financial journey.
          </h2>
          <div className="space-y-4">
            {[
              { step: '01', text: 'Create your free account' },
              { step: '02', text: 'Add your first expense' },
              { step: '03', text: 'Set a monthly budget' },
              { step: '04', text: 'Watch insights roll in' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-500">
                  {item.step}
                </span>
                <span className="text-sm text-slate-400">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-t border-white/5 p-10">
          <p className="text-xs text-slate-600">
            No credit card needed. No bank linking. Start in 30 seconds.
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
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Start tracking your expenses in under a minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                placeholder="Your name"
              />
            </div>

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
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2.5 flex gap-4">
                  {checks.map((c) => (
                    <div key={c.label} className="flex items-center gap-1.5 text-xs">
                      <div className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${c.ok ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <Check className={`h-2 w-2 ${c.ok ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <span className={c.ok ? 'text-emerald-600' : 'text-slate-400'}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
