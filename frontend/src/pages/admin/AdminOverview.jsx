import React from 'react';
import { CheckCircle2, MessageSquareText, ShieldCheck, Sparkles, Users } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</p>
          <h3 className="mt-1.5 text-xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>

        <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="max-w-4xl">
            <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">Marketplace command center</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Separate sidebar pages for each admin responsibility.
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-normal text-slate-600">
              Worker moderation, customer tools, privileges, pricing plans, notifications, and
              system health are now split into separate pages.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={CheckCircle2} label="Workers" value="Live data" hint="Connect the worker API to show records" />
            <StatCard icon={Users} label="Customers" value="Live data" hint="Connect the customer API to show records" />
            <StatCard icon={ShieldCheck} label="Privileges" value="Settings" hint="Connect stored flags to manage features" />
            <StatCard icon={Sparkles} label="Pricing" value="Connected" hint="System plans are now backed by the API" />
          </div>

          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 text-xs leading-relaxed text-emerald-850">
            Pricing now means the system plans offered to users, not worker packages.
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700">
            <MessageSquareText size={16} className="text-emerald-600" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Notifications</h3>
            <p className="mt-1 text-xs text-slate-500 leading-normal">Send SMS and email updates from a dedicated page.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Privileges</h3>
            <p className="mt-1 text-xs text-slate-500 leading-normal">Connect a real settings source before showing feature toggles.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700">
            <Sparkles size={16} className="text-emerald-600" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Pricing plans</h3>
            <p className="mt-1 text-xs text-slate-500 leading-normal">Manage the system offers users can purchase.</p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}