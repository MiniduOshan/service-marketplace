import React from 'react';
import { Sparkles } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminSystemHealth() {
  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15"><Sparkles size={22} /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">System Health</h2>
            <p className="text-sm text-slate-400">Quick controls for platform stability and visibility.</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Chat availability</p><p className="mt-2 text-lg font-semibold text-white">Not connected</p><p className="mt-2 text-sm text-slate-400">Wire a live metrics source before showing service status here.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pricing plans</p><p className="mt-2 text-lg font-semibold text-white">Connected</p><p className="mt-2 text-sm text-slate-400">System pricing now persists through the API.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mobile app controls</p><p className="mt-2 text-lg font-semibold text-white">No sample data</p><p className="mt-2 text-sm text-slate-400">The admin dashboard stays web-only but no longer shows fake status values.</p></div>
        </div>
      </section>
    </AdminLayout>
  );
}