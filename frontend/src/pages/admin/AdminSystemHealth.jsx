import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

export default function AdminSystemHealth() {
  const [healthData, setHealthData] = useState({
    db_status: 'Checking...',
    pricing_count: 0,
    bookings_count: 0,
  });
  const [loading, setLoading] = useState(true);

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