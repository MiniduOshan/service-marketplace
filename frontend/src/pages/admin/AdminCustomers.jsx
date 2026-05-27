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
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15"><Users size={22} /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Customers</h2>
            <p className="text-sm text-slate-400">Manage customer account access and activity.</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {customers.length > 0 ? (
            customers.map((customer) => (
              <div key={customer.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{customer.email}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">{customer.status}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="rounded-xl bg-white/5 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Bookings</p><p className="mt-1 text-lg font-semibold text-white">{customer.bookings}</p></div>
                  <div className="rounded-xl bg-white/5 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Last active</p><p className="mt-1 text-lg font-semibold text-white">{customer.lastActive}</p></div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => updateCustomer(customer.id, 'Active')} className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/15"><CheckCircle2 size={14} /> Approve</button>
                  <button type="button" onClick={() => updateCustomer(customer.id, 'Paused')} className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/15"><PauseCircle size={14} /> Suspend</button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center xl:col-span-3">
              <p className="text-sm font-semibold text-white">No live customer data connected.</p>
              <p className="mt-2 text-sm text-slate-400">Connect the customer API to show actual account records here.</p>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}