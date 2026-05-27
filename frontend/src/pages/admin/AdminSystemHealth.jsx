import React from 'react';
import { Sparkles } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminSystemHealth() {
  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">System Health</h2>
            <p className="text-xs text-slate-500">Quick controls for platform stability and visibility.</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Chat availability</p>
            <p className="mt-1.5 text-xs font-bold text-slate-900">Not connected</p>
            <p className="mt-1 text-xs text-slate-500 leading-normal">Wire a live metrics source before showing service status here.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Pricing plans</p>
            <p className="mt-1.5 text-xs font-bold text-slate-900">Connected</p>
            <p className="mt-1 text-xs text-slate-500 leading-normal">System pricing now persists through the API.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mobile app controls</p>
            <p className="mt-1.5 text-xs font-bold text-slate-900">No sample data</p>
            <p className="mt-1 text-xs text-slate-500 leading-normal">The admin dashboard stays web-only but no longer shows sample status values.</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}