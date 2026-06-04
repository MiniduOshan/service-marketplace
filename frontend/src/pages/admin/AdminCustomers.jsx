import React, { useState, useEffect } from 'react';
import { CheckCircle2, PauseCircle, Trash2, Users, LayoutGrid, List } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const filteredCustomers = customers.filter(c => {
    if (filter === 'All') return true;
    return c.status === filter;
  });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/admin/customers');
      const customersData = response.data?.data ? response.data.data : response.data;
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const updateCustomer = async (customerId, status) => {
    try {
      await apiRequest(`/admin/customers/${customerId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      loadCustomers();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update customer status.');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer and all associated bookings, reviews, and payment records? This action cannot be undone.')) {
      return;
    }
    try {
      await apiRequest(`/admin/users/${customerId}`, {
        method: 'DELETE',
      });
      loadCustomers();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete customer.');
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Customers</h2>
              <p className="text-xs text-slate-500">Manage customer account access and activity.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-xs border-slate-200 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 px-3 py-1.5"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
            Loading customers...
          </div>
        ) : (
          <>
            {filteredCustomers.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid gap-4 xl:grid-cols-3">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xs font-semibold text-slate-900">{customer.name}</h3>
                          <p className="mt-0.5 text-[11px] text-slate-500">{customer.email}</p>
                        </div>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${customer.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{customer.status}</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs text-slate-600">
                        <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400">Bookings</p>
                          <p className="mt-0.5 text-sm font-semibold text-slate-800">{customer.bookings}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400">Last active</p>
                          <p className="mt-0.5 text-sm font-semibold text-slate-800">{customer.lastActive}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <button type="button" onClick={() => updateCustomer(customer.id, 'Active')} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 px-2.5 py-1 text-xs font-semibold text-emerald-700 cursor-pointer"><CheckCircle2 size={12} /> Approve</button>
                        <button type="button" onClick={() => updateCustomer(customer.id, 'Suspended')} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2.5 py-1 text-xs font-semibold text-amber-700 cursor-pointer"><PauseCircle size={12} /> Suspend</button>
                        <button type="button" onClick={() => handleDeleteCustomer(customer.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200/50 px-2.5 py-1 text-xs font-semibold text-red-700 cursor-pointer"><Trash2 size={12} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="grid gap-4 bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid-cols-[1.5fr_0.8fr_0.8fr_0.5fr_1fr] sm:px-6">
                    <span>Customer</span><span>Bookings</span><span>Last Active</span><span>Status</span><span>Actions</span>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                    {filteredCustomers.map((customer) => (
                      <div key={customer.id} className="grid gap-4 px-4 py-3 sm:grid-cols-[1.5fr_0.8fr_0.8fr_0.5fr_1fr] sm:px-6">
                        <div>
                          <p className="font-semibold text-xs text-slate-900">{customer.name}</p>
                          <p className="mt-0.5 text-[11px] text-slate-500">{customer.email}</p>
                        </div>
                        <div className="text-xs text-slate-600 self-center">{customer.bookings}</div>
                        <div className="text-xs text-slate-600 self-center">{customer.lastActive}</div>
                        <div className="self-center">
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${customer.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                            {customer.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 self-center">
                          <button type="button" onClick={() => updateCustomer(customer.id, 'Active')} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 px-2.5 py-1 text-xs font-semibold text-emerald-700 cursor-pointer"><CheckCircle2 size={12} /> Approve</button>
                          <button type="button" onClick={() => updateCustomer(customer.id, 'Suspended')} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2.5 py-1 text-xs font-semibold text-amber-700 cursor-pointer"><PauseCircle size={12} /> Suspend</button>
                          <button type="button" onClick={() => handleDeleteCustomer(customer.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200/50 px-2.5 py-1 text-xs font-semibold text-red-700 cursor-pointer"><Trash2 size={12} /> Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-xs font-semibold text-slate-850">No customer accounts match your criteria.</p>
                <p className="mt-1 text-xs text-slate-500">Try changing the filter or wait for new registrations.</p>
              </div>
            )}
          </>
        )}
      </section>
    </AdminLayout>
  );
}