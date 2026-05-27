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
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15"><MessageCircle size={22} /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">SMS / Email Notifications</h2>
            <p className="text-sm text-slate-400">Send updates, approvals, and announcements.</p>
          </div>
        </div>

        <form onSubmit={sendNotification} className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 xl:grid-cols-[0.8fr_0.8fr_1.2fr_1.2fr_auto]">
          <select value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none">
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
          <select value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none">
            <option value="all">All users</option>
            <option value="workers">Workers</option>
            <option value="customers">Customers</option>
            <option value="pending-workers">Pending workers</option>
          </select>
          <input type="text" value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} placeholder="Notification subject" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
          <input type="text" value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="Message body" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"><MessageCircle size={16} /> Send</button>
        </form>

        {statusMessage ? <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{statusMessage}</div> : null}

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><Smartphone size={20} className="text-emerald-300" /><h3 className="mt-3 text-lg font-semibold text-white">SMS broadcast</h3><p className="mt-2 text-sm leading-6 text-slate-400">Send urgent account and booking alerts.</p></div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><Mail size={20} className="text-emerald-300" /><h3 className="mt-3 text-lg font-semibold text-white">Email campaign</h3><p className="mt-2 text-sm leading-6 text-slate-400">Announce changes and feature updates.</p></div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><ArrowUpRight size={20} className="text-emerald-300" /><h3 className="mt-3 text-lg font-semibold text-white">Audit-ready logs</h3><p className="mt-2 text-sm leading-6 text-slate-400">Keep a visible trail for sent announcements.</p></div>
        </div>
      </section>
    </AdminLayout>
  );
}