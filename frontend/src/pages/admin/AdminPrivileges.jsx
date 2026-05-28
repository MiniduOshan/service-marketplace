import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`} aria-pressed={checked}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  );
}

export default function AdminPrivileges() {
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadPrivileges = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/admin/privileges');
      setPrivileges(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load privilege settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrivileges();
  }, []);

  const togglePrivilege = async (key) => {
    try {
      const response = await apiRequest(`/admin/privileges/${key}/toggle`, {
        method: 'POST',
      });
      setPrivileges(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update privilege.');
    }
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

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-55 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
            Loading privilege settings...
          </div>
        ) : (
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
              <div className="rounded-xl border border-slate-200 bg-slate-55 p-6 text-center xl:col-span-2">
                <p className="text-xs font-semibold text-slate-800">No privilege settings defined.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}