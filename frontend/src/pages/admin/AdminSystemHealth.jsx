import React, { useState, useEffect } from 'react';
import { Sparkles, Power, ShieldAlert } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';
import { useConfig } from '../../context/ConfigContext';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-red-500' : 'bg-emerald-500'}`} aria-pressed={checked}>
      <span className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-[2px]'}`} />
    </button>
  );
}

export default function AdminSystemHealth() {
  const [healthData, setHealthData] = useState({
    db_status: 'Checking...',
    pricing_count: 0,
    bookings_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const { config, refreshConfig } = useConfig();
  const [changingMode, setChangingMode] = useState(false);

  useEffect(() => {
    async function loadHealth() {
      try {
        const response = await apiRequest('/admin/system/health');
        if (response.data) {
          setHealthData(response.data);
        }
      } catch (error) {
        setHealthData((prev) => ({
          ...prev,
          db_status: 'Unreachable',
        }));
      } finally {
        setLoading(false);
      }
    }
    loadHealth();
  }, []);

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

        {/* System Mode Controls */}
        <div className="mb-6 rounded-xl border border-red-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className={`grid h-10 w-10 place-items-center rounded-lg ${config?.system_mode === 'maintenance' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <Power size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">System Mode: {config?.system_mode === 'maintenance' ? 'Maintenance' : 'Live'}</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xl">
                  When maintenance mode is active, customers and workers will see a maintenance page and cannot interact with the platform. Admin access remains fully operational.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Toggle 
                checked={config?.system_mode === 'maintenance'} 
                onChange={async (isMaintenance) => {
                  setChangingMode(true);
                  try {
                    await apiRequest('/admin/system/mode', {
                      method: 'POST',
                      body: JSON.stringify({ mode: isMaintenance ? 'maintenance' : 'live' })
                    });
                    refreshConfig();
                  } catch (e) {
                    alert('Failed to update system mode');
                  } finally {
                    setChangingMode(false);
                  }
                }} 
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {changingMode ? 'Updating...' : (config?.system_mode === 'maintenance' ? 'Offline' : 'Online')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Database Status</p>
            <p className="mt-1.5 text-xs font-bold text-slate-900">{healthData.db_status}</p>
            <p className="mt-1 text-xs text-slate-500 leading-normal">
              {healthData.db_status === 'Connected' ? 'MySQL database is working and reachable.' : 'Database connection error. Check server logs.'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Pricing plans</p>
            <p className="mt-1.5 text-xs font-bold text-slate-900">{loading ? '...' : `${healthData.pricing_count} Active`}</p>
            <p className="mt-1 text-xs text-slate-500 leading-normal">System plans saved and active in the database store.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Bookings Count</p>
            <p className="mt-1.5 text-xs font-bold text-slate-900">{loading ? '...' : healthData.bookings_count}</p>
            <p className="mt-1 text-xs text-slate-500 leading-normal">Total client bookings currently persisted in DB.</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}