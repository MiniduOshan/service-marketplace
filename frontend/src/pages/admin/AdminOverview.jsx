import React from 'react';
import { CheckCircle2, MessageSquareText, ShieldCheck, Sparkles, Users } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
          <p className="mt-2 text-sm text-slate-300">{hint}</p>
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  return (
    <AdminLayout>
      <div className="space-y-6 xl:space-y-8">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Marketplace command center</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl xl:text-5xl">
              Separate sidebar pages for each admin responsibility.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Worker moderation, customer tools, privileges, pricing plans, notifications, and
              system health are now split into separate pages.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={CheckCircle2} label="Workers" value="Live data" hint="Connect the worker API to show records" />
            <StatCard icon={Users} label="Customers" value="Live data" hint="Connect the customer API to show records" />
            <StatCard icon={ShieldCheck} label="Privileges" value="Settings" hint="Connect stored flags to manage features" />
            <StatCard icon={Sparkles} label="Pricing" value="Connected" hint="System plans are now backed by the API" />
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm leading-7 text-emerald-50">
            Pricing now means the system plans offered to users, not worker packages.
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-slate-200">
            <MessageSquareText className="text-emerald-300" />
            <h3 className="mt-3 text-lg font-semibold text-white">Notifications</h3>
            <p className="mt-2 text-sm text-slate-400">Send SMS and email updates from a dedicated page.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-slate-200">
            <ShieldCheck className="text-emerald-300" />
            <h3 className="mt-3 text-lg font-semibold text-white">Privileges</h3>
            <p className="mt-2 text-sm text-slate-400">Connect a real settings source before showing feature toggles.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-slate-200">
            <Sparkles className="text-emerald-300" />
            <h3 className="mt-3 text-lg font-semibold text-white">Pricing plans</h3>
            <p className="mt-2 text-sm text-slate-400">Manage the system offers users can purchase.</p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}