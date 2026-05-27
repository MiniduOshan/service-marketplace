import React, { useState } from 'react';
import { ArrowUpRight, Mail, MessageCircle, Smartphone } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminNotifications() {
  const [form, setForm] = useState({ channel: 'sms', audience: 'all', subject: '', message: '' });
  const [statusMessage, setStatusMessage] = useState('');

  const sendNotification = (event) => {
    event.preventDefault();
    if (!form.message.trim()) {
      setStatusMessage('Notification message cannot be empty.');
      return;
    }
    setStatusMessage(`${form.channel.toUpperCase()} notification prepared for ${form.audience}.`);
  };

  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <MessageCircle size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">SMS / Email Notifications</h2>
            <p className="text-xs text-slate-500">Send updates, approvals, and announcements.</p>
          </div>
        </div>

        <form onSubmit={sendNotification} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 xl:grid-cols-[0.8fr_0.8fr_1.2fr_1.2fr_auto]">
          <select value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
          <select value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
            <option value="all">All users</option>
            <option value="workers">Workers</option>
            <option value="customers">Customers</option>
            <option value="pending-workers">Pending workers</option>
          </select>
          <input type="text" value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} placeholder="Notification subject" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          <input type="text" value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="Message body" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-700"><MessageCircle size={14} /> Send</button>
        </form>

        {statusMessage ? <div className="mt-3 rounded-lg border border-emerald-250 bg-emerald-50 px-3 py-2 text-xs text-emerald-850">{statusMessage}</div> : null}

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><Smartphone size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">SMS broadcast</h3><p className="mt-1 text-xs leading-normal text-slate-550">Send urgent account and booking alerts.</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><Mail size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">Email campaign</h3><p className="mt-1 text-xs leading-normal text-slate-550">Announce changes and feature updates.</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><ArrowUpRight size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">Audit-ready logs</h3><p className="mt-1 text-xs leading-normal text-slate-550">Keep a visible trail for sent announcements.</p></div>
        </div>
      </section>
    </AdminLayout>
  );
}