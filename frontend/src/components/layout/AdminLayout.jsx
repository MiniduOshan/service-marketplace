import React, { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Blocks,
  CircleDollarSign,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  KeyRound,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { clearSession, getStoredSessionUser } from '../../lib/api';

const sidebarItems = [
  { path: '/admin/dashboard', name: 'Overview', icon: LayoutDashboard },
  { path: '/admin/workers', name: 'Monitor Workers', icon: FileCheck2 },
  { path: '/admin/customers', name: 'Customers', icon: Users },
  { path: '/admin/privileges', name: 'Privileges', icon: ShieldCheck },
  { path: '/admin/pricing-plans', name: 'Pricing Plans', icon: CircleDollarSign },
  { path: '/admin/credentials', name: 'Credentials', icon: KeyRound },
  { path: '/admin/notifications', name: 'SMS / Email', icon: MessageSquareText },
  { path: '/admin/system', name: 'System Health', icon: BarChart3 },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const currentUser = getStoredSessionUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = useMemo(() => {
    return currentUser?.name || 'Administrator';
  }, [currentUser]);

  const closeSession = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-slate-950/95 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div className="border-b border-white/10 px-7 py-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25">
                <Blocks size={22} />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-tight text-white">SkilledLK Admin</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Web control center</p>
              </div>
            </button>
          </div>

          <div className="border-b border-white/10 px-7 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Signed in as</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-slate-950">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{displayName}</p>
                <p className="text-sm text-slate-400">Platform administrator</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            {sidebarItems.map(({ path, name, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-400/10 text-white ring-1 ring-emerald-300/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="text-emerald-300" />
                {name}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 px-5 py-5">
            <button
              type="button"
              onClick={closeSession}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#111827_100%)]">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 lg:hidden"
                  aria-label="Open admin menu"
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Control room</p>
                  <h1 className="text-lg font-bold text-white sm:text-xl">Admin Dashboard</h1>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 md:inline-flex"
                >
                  <Bell size={16} />
                  System alerts
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  View site
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="border-t border-white/10 bg-slate-950 px-4 py-4 lg:hidden">
                <nav className="grid gap-2 sm:grid-cols-2">
                  {sidebarItems.map(({ path, name, icon: Icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
                          isActive
                            ? 'border-emerald-300/20 bg-emerald-400/10 text-white'
                            : 'border-white/10 bg-white/5 text-slate-200'
                        }`
                      }
                    >
                      <Icon size={17} className="text-emerald-300" />
                      {name}
                    </NavLink>
                  ))}

                  <button
                    type="button"
                    onClick={closeSession}
                    className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 xl:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}