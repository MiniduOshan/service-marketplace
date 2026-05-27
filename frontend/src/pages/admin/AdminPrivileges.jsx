import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`relative h-8 w-14 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-500/40'}`} aria-pressed={checked}>
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  );
}

export default function AdminPrivileges() {
  const [privileges, setPrivileges] = useState([]);

  const togglePrivilege = (key) => {
    setPrivileges((current) => current.map((privilege) => (privilege.key === key ? { ...privilege, enabled: !privilege.enabled } : privilege)));
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15"><ShieldCheck size={22} /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Privileges</h2>
            <p className="text-sm text-slate-400">Show or hide platform features for web and mobile.</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {privileges.length > 0 ? (
            privileges.map((privilege) => (
              <div key={privilege.key} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{privilege.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{privilege.description}</p>
                  </div>
                  <Toggle checked={privilege.enabled} onChange={() => togglePrivilege(privilege.key)} />
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {privilege.enabled ? 'Visible on web and mobile' : 'Hidden from users'}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center xl:col-span-2">
              <p className="text-sm font-semibold text-white">No live privilege settings connected.</p>
              <p className="mt-2 text-sm text-slate-400">Connect the privilege settings source to manage feature flags here.</p>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}