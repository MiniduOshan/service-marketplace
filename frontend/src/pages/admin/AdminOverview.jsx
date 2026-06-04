import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, DollarSign, Activity, Users, ShieldCheck, Sparkles, MessageSquareText, FileText, ArrowRight } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

function StatCard({ icon: Icon, label, value, hint, isLoading }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</p>
          {isLoading ? (
            <div className="mt-2 h-7 w-24 rounded bg-slate-100 animate-pulse" />
          ) : (
            <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
          )}
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await apiRequest('/admin/stats');
        setData(response);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = data?.stats || {};
  const recentActivity = data?.recentActivity || [];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">Platform Overview</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Performance Statistics
              </h2>
            </div>
            {!isLoading && (
              <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                Live Data Connected
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              icon={DollarSign} 
              label="Total Revenue" 
              value={stats.totalRevenue !== undefined ? `LKR ${stats.totalRevenue.toLocaleString()}` : '0'} 
              hint="From completed bookings" 
              isLoading={isLoading} 
            />
            <StatCard 
              icon={CheckCircle2} 
              label="Completed Bookings" 
              value={stats.completedBookings !== undefined ? `${stats.completedBookings} / ${stats.totalBookings}` : '0 / 0'} 
              hint="Success rate of all bookings" 
              isLoading={isLoading} 
            />
            <StatCard 
              icon={Activity} 
              label="Active Workers" 
              value={stats.activeWorkers !== undefined ? `${stats.activeWorkers} / ${stats.totalWorkers}` : '0 / 0'} 
              hint="Verified and active workers" 
              isLoading={isLoading} 
            />
            <StatCard 
              icon={Users} 
              label="Total Customers" 
              value={stats.totalCustomers !== undefined ? stats.totalCustomers : '0'} 
              hint="Registered customer accounts" 
              isLoading={isLoading} 
            />
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1fr_350px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recent User Registrations</h3>
              <Link to="/admin/customers" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-l-lg">Name</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold rounded-r-lg">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-slate-400">Loading recent activity...</td>
                    </tr>
                  ) : recentActivity.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-slate-400">No recent activity found.</td>
                    </tr>
                  ) : (
                    recentActivity.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                        <td className="px-4 py-3 capitalize">{user.role}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">{user.created_at}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <Link to="/admin/privileges" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 text-left block cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Manage Privileges</h3>
                  <p className="text-xs text-slate-500">Toggle system features globally.</p>
                </div>
              </div>
            </Link>
            
            <Link to="/admin/pricing-plans" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 text-left block cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pricing Plans</h3>
                  <p className="text-xs text-slate-500">Manage user subscriptions.</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/notifications" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 text-left block cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <MessageSquareText size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  <p className="text-xs text-slate-500">Send bulk SMS & Emails.</p>
                </div>
              </div>
            </Link>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}