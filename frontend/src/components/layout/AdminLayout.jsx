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
  { path: '/admin/user-plans', name: 'User Price Plans', icon: Users },
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div className="border-b border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10">
                <Blocks size={18} />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-900">SkilledLK Admin</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Web control center</p>
              </div>
            </button>
          </div>

          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">Signed in as</p>
            <div className="mt-1.5 flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{displayName}</p>
                <p className="text-[10px] text-slate-500">Platform administrator</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-3">
            {sidebarItems.map(({ path, name, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={15} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                    <span>{name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-100 px-4 py-3.5">
            <button
              type="button"
              onClick={closeSession}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600 hover:border-red-100"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-slate-50/50">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((value) => !value)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
                  aria-label="Open admin menu"
                >
                  {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
                </button>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Control room</p>
                  <h1 className="text-sm font-bold text-slate-900">Admin Dashboard</h1>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 md:inline-flex"
                >
                  <Bell size={13} />
                  System alerts
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View site
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
                <nav className="grid gap-1.5 sm:grid-cols-2">
                  {sidebarItems.map(({ path, name, icon: Icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
                          isActive
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`
                      }
                    >
                      <Icon size={14} className="text-emerald-600" />
                      {name}
                    </NavLink>
                  ))}

                  <button
                    type="button"
                    onClick={closeSession}
                    className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 xl:py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}