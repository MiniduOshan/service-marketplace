import React, { useState } from 'react';
import { ArrowUpRight, Mail, MessageCircle, Smartphone } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

export default function AdminNotifications() {
  const [form, setForm] = useState({ channel: 'sms', audience: 'all', subject: '', message: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const templates = [
    {
      label: 'Welcome (Worker)',
      channel: 'email',
      audience: 'workers',
      subject: 'Welcome to SkilledLK! Action Required',
      message: 'Welcome to SkilledLK! Please complete your profile and verify your ID to start receiving jobs.',
    },
    {
      label: 'Account Approved',
      channel: 'sms',
      audience: 'pending-workers',
      subject: 'Account Approved',
      message: 'Your SkilledLK worker account has been approved. You can now login and start accepting bookings!',
    },
    {
      label: 'System Maintenance',
      channel: 'sms',
      audience: 'all',
      subject: 'System Maintenance Alert',
      message: 'SkilledLK will undergo scheduled maintenance tonight from 12 AM to 2 AM. Services may be unavailable.',
    },
    {
      label: 'Promo Offer (Customers)',
      channel: 'email',
      audience: 'customers',
      subject: 'Special Offer: 10% Off Your Next Booking',
      message: 'Use code PROMO10 on your next booking to get 10% off any service. Valid until the end of the month!',
    }
  ];

  const useTemplate = (template) => {
    setForm({
      channel: template.channel,
      audience: template.audience,
      subject: template.subject,
      message: template.message,
    });
    setErrorMessage('');
    setStatusMessage('');
  };

  const sendNotification = async (event) => {
    event.preventDefault();
    if (!form.message.trim()) {
      setStatusMessage('Notification message cannot be empty.');
      return;
    }
    setErrorMessage('');
    setStatusMessage('');
    try {
      const response = await apiRequest('/admin/notifications/send', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setStatusMessage(response.message || 'Notification sent successfully.');
      setForm({ channel: 'sms', audience: 'all', subject: '', message: '' });
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send notification.');
    }
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

        {errorMessage ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {statusMessage ? <div className="mt-3 rounded-lg border border-emerald-250 bg-emerald-50 px-3 py-2 text-xs text-emerald-850">{statusMessage}</div> : null}

        <div className="mt-6 mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Templates</h3>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => useTemplate(tpl)}
              className="flex flex-col items-start rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              <span className="mb-1 text-xs font-bold text-slate-900">{tpl.label}</span>
              <span className="line-clamp-2 text-[10px] leading-relaxed text-slate-500">{tpl.message}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><Smartphone size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">SMS broadcast</h3><p className="mt-1 text-xs leading-normal text-slate-550">Send urgent account and booking alerts.</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><Mail size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">Email campaign</h3><p className="mt-1 text-xs leading-normal text-slate-550">Announce changes and feature updates.</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><ArrowUpRight size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">Audit-ready logs</h3><p className="mt-1 text-xs leading-normal text-slate-550">Keep a visible trail for sent announcements.</p></div>
        </div>
      </section>
    </AdminLayout>
  );
}