import React, { useState } from 'react';
import { CheckCircle2, PauseCircle, Users } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  const updateCustomer = (customerId, status) => {
    setCustomers((current) => current.map((customer) => (customer.id === customerId ? { ...customer, status } : customer)));
  };

  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <Users size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Customers</h2>
            <p className="text-xs text-slate-500">Manage customer account access and activity.</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {customers.length > 0 ? (
            customers.map((customer) => (
              <div key={customer.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{customer.name}</h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">{customer.email}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{customer.status}</span>
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
                  <button type="button" onClick={() => updateCustomer(customer.id, 'Active')} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={12} /> Approve</button>
                  <button type="button" onClick={() => updateCustomer(customer.id, 'Paused')} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2.5 py-1 text-xs font-semibold text-amber-700"><PauseCircle size={12} /> Suspend</button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center xl:col-span-3">
              <p className="text-xs font-semibold text-slate-850">No live customer data connected.</p>
              <p className="mt-1 text-xs text-slate-500">Connect the customer API to show actual account records here.</p>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}