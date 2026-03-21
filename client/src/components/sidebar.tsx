'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Tag,
  LogOut,
  Wallet,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/categories', label: 'Categories', icon: Tag },
];

// Mobile sidebar context
const SidebarContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

export function MobileHeader() {
  const { setOpen } = useSidebar();
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-blue-600" />
        <span className="text-base font-bold text-slate-900">SpendWise</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <Wallet className="h-5 w-5 text-blue-400" />
        <span className="text-base font-bold">SpendWise</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 pt-4">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Menu
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-white/10 font-medium text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/5 p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-slate-950 text-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-slate-950 text-white shadow-2xl"
            style={{ animation: 'slideFromLeft 0.2s ease-out' }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-4 rounded-lg p-1 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
