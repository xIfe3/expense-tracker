'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Wallet,
  TrendingDown,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  if (loading || user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-bold">Savvio</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm text-slate-400 hover:text-white">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Create account
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        <div className="animate-fade-up relative text-center" style={{ animationDelay: '0.1s' }}>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
            A simple way to see where<br />your money goes.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Savvio is a personal expense tracker I built as my final year project.
            You type in what you spend, pick a category, and the dashboard shows
            you the rest. No bank linking, no data sharing.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Create an account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-white hover:border-white/20 hover:bg-white/5"
            >
              I already have one
            </Link>
          </div>
        </div>

        {/* Floating preview */}
        <div
          className="animate-fade-up relative mx-auto mt-20 w-full max-w-3xl"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
            <div className="rounded-xl bg-slate-900 p-6">
              {/* Mock top bar */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Total spent this month</p>
                  <p className="mt-1 text-3xl font-bold">€485.30</p>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  12% less than last month
                </div>
              </div>
              {/* Mock chart bars */}
              <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
                {[45, 60, 35, 80, 65, 40, 75, 50, 30, 70, 55, 45, 85, 40, 60, 35, 50, 70, 45, 55, 65, 30, 75, 50, 40, 60, 55, 45, 70, 35].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-blue-500/60 hover:bg-blue-400/80"
                      style={{ height: `${h}%`, transition: 'all 0.2s' }}
                    />
                  ),
                )}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-slate-600">
                <span>Mar 1</span>
                <span>Mar 15</span>
                <span>Mar 30</span>
              </div>
              {/* Mock recent items */}
              <div className="mt-6 space-y-2">
                {[
                  { name: 'Grocery shopping', cat: 'Food', amt: '€42.80', color: 'bg-amber-500' },
                  { name: 'Bus pass', cat: 'Transport', amt: '€28.00', color: 'bg-blue-500' },
                  { name: 'Netflix', cat: 'Entertainment', amt: '€12.99', color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${item.color}`} />
                      <div>
                        <p className="text-sm text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.cat}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-300">{item.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">What it does</h2>
            <p className="mt-3 text-slate-400">
              A small set of features I thought were actually useful. Nothing more.
            </p>
          </div>

          <div className="mt-14 space-y-4">
            {[
              {
                icon: TrendingDown,
                title: 'Charts that answer real questions',
                desc: 'How much did I spend this month? How does it compare to last? Where did the money go? A few charts, each there for a reason.',
                accent: 'text-blue-400',
                bg: 'bg-blue-500/10',
              },
              {
                icon: ShieldCheck,
                title: 'Manual entry, no bank linking',
                desc: 'You type in your expenses yourself. The app never asks for bank credentials and never sends your data anywhere else.',
                accent: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
              },
              {
                icon: BarChart3,
                title: 'Monthly budgets per category',
                desc: 'Set a limit for each category at the start of the month. A progress bar shows how close you are to the limit as you spend.',
                accent: 'text-purple-400',
                bg: 'bg-purple-500/10',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="animate-fade-up flex items-start gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-white/10 hover:bg-white/[0.04]"
                style={{ animationDelay: `${i * 0.1}s`, transition: 'all 0.3s' }}
              >
                <div className={`shrink-0 rounded-xl ${item.bg} p-3`}>
                  <item.icon className={`h-6 w-6 ${item.accent}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold">Try it out</h2>
          <p className="mt-3 text-slate-400">
            Make an account and add your first expense. That is it.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Create an account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 text-sm text-slate-600 sm:flex-row">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>Savvio</span>
          </div>
          <span>Final year project — 2026</span>
        </div>
      </footer>
    </div>
  );
}
