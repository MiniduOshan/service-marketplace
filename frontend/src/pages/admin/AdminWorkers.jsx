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
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Monitor Workers</h2>
            <p className="text-xs text-slate-500">Approve, suspend, or remove worker accounts.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="grid gap-4 bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:px-6">
            <span>Name</span><span>Category</span><span>City</span><span>Actions</span>
          </div>

          <div className="divide-y divide-slate-100 bg-white">
            {workers.length > 0 ? (
              workers.map((worker) => (
                <div key={worker.id} className="grid gap-4 px-4 py-3 sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:px-6">
                  <div>
                    <p className="font-semibold text-xs text-slate-900">{worker.name}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{worker.verification}</p>
                  </div>
                  <div className="text-xs text-slate-600 self-center">{worker.category}</div>
                  <div className="text-xs text-slate-600 self-center">{worker.city}</div>
                  <div className="flex flex-wrap gap-1.5 self-center">
                    <button type="button" onClick={() => updateWorker(worker.id, 'active', 'Verified')} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={12} /> Approve</button>
                    <button type="button" onClick={() => updateWorker(worker.id, 'review', 'Pending verification')} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2.5 py-1 text-xs font-semibold text-amber-700"><PauseCircle size={12} /> Hold</button>
                    <button type="button" onClick={() => updateWorker(worker.id, 'removed', 'Removed by admin')} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200/50 px-2.5 py-1 text-xs font-semibold text-red-700"><Trash2 size={12} /> Remove</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center sm:px-6">
                <p className="text-xs font-semibold text-slate-800">No live worker data connected.</p>
                <p className="mt-1 text-xs text-slate-500">Connect the worker API to show real moderation records here.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}