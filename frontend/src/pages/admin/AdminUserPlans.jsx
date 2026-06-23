import React, { useState, useEffect } from 'react';
import { CircleDollarSign, Check, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

export default function AdminUserPlans() {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadPlans = async () => {
    try {
      const response = await apiRequest('/admin/pricing-plans');
      setPlans(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const endpoint = '/admin/workers';
      const response = await apiRequest(endpoint);
      const workersData = response.data?.data ? response.data.data : response.data;
      setUsers(Array.isArray(workersData) ? workersData : []);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAssignPlan = async (userId, planId) => {
    try {
      setStatusMessage('Updating pricing plan...');
      await apiRequest(`/admin/users/${userId}/pricing-plan`, {
        method: 'PATCH',
        body: JSON.stringify({
          pricing_plan_id: planId,
        }),
      });
      setStatusMessage('User pricing plan updated successfully.');
      loadUsers();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to assign pricing plan.');
    }
  };

  const clearMessages = () => {
    setStatusMessage('');
    setErrorMessage('');
  };

  useEffect(() => {
    if (statusMessage || errorMessage) {
      const timeout = window.setTimeout(() => clearMessages(), 3500);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [statusMessage, errorMessage]);

  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <CircleDollarSign size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">User Price Plans</h2>
            <p className="text-xs text-slate-500">Manage and assign pricing plans directly to users.</p>
          </div>
        </div>

        {/* Tabs removed as only workers have pricing plans */}

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {statusMessage && (
          <div className="mb-4 rounded-lg border border-emerald-250 bg-emerald-50 px-3 py-2 text-xs text-emerald-850">
            {statusMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
            Loading users...
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid gap-4 bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid-cols-[1.5fr_1.5fr_1.2fr] sm:px-6">
              <span>User details</span>
              <span>Current plan</span>
              <span>Change plan</span>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="grid gap-4 px-4 py-3 sm:grid-cols-[1.5fr_1.5fr_1.2fr] sm:px-6">
                    <div>
                      <p className="font-semibold text-xs text-slate-900">{user.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">{user.email}</p>
                    </div>
                    <div className="self-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        user.pricing_plan_id 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                          : 'bg-slate-50 text-slate-650 border-slate-200/55'
                      }`}>
                        {user.pricing_plan || 'Free'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 self-center">
                      <select
                        value={user.pricing_plan_id || ''}
                        onChange={(event) => handleAssignPlan(user.id, event.target.value ? Number(event.target.value) : null)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-emerald-600"
                      >
                        <option value="">Free (Default)</option>
                        {plans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.title} (LKR {Number(plan.price).toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center sm:px-6">
                  <p className="text-xs font-semibold text-slate-800">No users found.</p>
                  <p className="mt-1 text-xs text-slate-500">Registered users in this category will show up here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
