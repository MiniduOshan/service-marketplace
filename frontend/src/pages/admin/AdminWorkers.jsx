import React, { useState } from 'react';
import { CheckCircle2, PauseCircle, Trash2, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);

  const updateWorker = (workerId, status, verification) => {
    setWorkers((current) => current.map((worker) => (worker.id === workerId ? { ...worker, status, verification } : worker)));
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15"><ShieldCheck size={22} /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Monitor Workers</h2>
            <p className="text-sm text-slate-400">Approve, suspend, or remove worker accounts.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="grid gap-4 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:px-6">
            <span>Name</span><span>Category</span><span>City</span><span>Actions</span>
          </div>

          <div className="divide-y divide-white/10 bg-slate-950/60">
            {workers.length > 0 ? (
              workers.map((worker) => (
                <div key={worker.id} className="grid gap-4 px-4 py-4 sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:px-6">
                  <div>
                    <p className="font-semibold text-white">{worker.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{worker.verification}</p>
                  </div>
                  <div className="text-sm text-slate-300">{worker.category}</div>
                  <div className="text-sm text-slate-300">{worker.city}</div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateWorker(worker.id, 'active', 'Verified')} className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/15"><CheckCircle2 size={14} /> Approve</button>
                    <button type="button" onClick={() => updateWorker(worker.id, 'review', 'Pending verification')} className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/15"><PauseCircle size={14} /> Hold</button>
                    <button type="button" onClick={() => updateWorker(worker.id, 'removed', 'Removed by admin')} className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 ring-1 ring-red-300/15"><Trash2 size={14} /> Remove</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-10 text-center sm:px-6">
                <p className="text-sm font-semibold text-white">No live worker data connected.</p>
                <p className="mt-2 text-sm text-slate-400">Connect the worker API to show real moderation records here.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}