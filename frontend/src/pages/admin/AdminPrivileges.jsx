import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`} aria-pressed={checked}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-5.5' : 'left-0.5'}`} />
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
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Privileges</h2>
            <p className="text-xs text-slate-500">Show or hide platform features for web and mobile.</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {privileges.length > 0 ? (
            privileges.map((privilege) => (
              <div key={privilege.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{privilege.label}</h3>
                    <p className="mt-1 text-xs leading-normal text-slate-500">{privilege.description}</p>
                  </div>
                  <Toggle checked={privilege.enabled} onChange={() => togglePrivilege(privilege.key)} />
                </div>
                <div className="mt-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {privilege.enabled ? 'Visible on web and mobile' : 'Hidden from users'}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center xl:col-span-2">
              <p className="text-xs font-semibold text-slate-800">No live privilege settings connected.</p>
              <p className="mt-1 text-xs text-slate-500">Connect the privilege settings source to manage feature flags here.</p>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}