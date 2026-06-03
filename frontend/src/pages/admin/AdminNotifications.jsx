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
      message: '<h2>Welcome to SkilledLK!</h2>\n<p>Please complete your profile and verify your ID to start receiving jobs.</p>\n<p>Best regards,<br>SkilledLK Team</p>',
    },
    {
      label: 'Account Approved',
      channel: 'email',
      audience: 'pending-workers',
      subject: 'Account Approved - SkilledLK',
      message: '<h3>Congratulations!</h3>\n<p>Your SkilledLK worker account has been approved.</p>\n<p>You can now log in and start accepting bookings!</p>',
    },
    {
      label: 'System Maintenance',
      channel: 'email',
      audience: 'all',
      subject: 'System Maintenance Alert',
      message: '<p><strong>Notice:</strong> SkilledLK will undergo scheduled maintenance tonight from 12 AM to 2 AM.</p>\n<p>Services may be unavailable during this period.</p>',
    },
    {
      label: 'Promo Offer',
      channel: 'email',
      audience: 'customers',
      subject: 'Special Offer: 10% Off Your Next Booking',
      message: '<h2 style="color: #047857;">Special Offer!</h2>\n<p>Use code <strong>PROMO10</strong> on your next booking to get 10% off any service.</p>\n<p><em>Valid until the end of the month!</em></p>',
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

  const handleCopy = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setStatusMessage('Template copied to clipboard!');
    setTimeout(() => setStatusMessage(''), 3000);
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

        <form onSubmit={sendNotification} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-3">
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
          </div>
          
          <textarea 
            rows={6}
            value={form.message} 
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} 
            placeholder="Message body (HTML format supported for Emails)" 
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-y font-mono" 
          />
          
          <div className="flex justify-end">
            <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-sky-700">
              <MessageCircle size={14} /> Send Notification
            </button>
          </div>
        </form>

        {errorMessage ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {statusMessage ? <div className="mt-3 rounded-lg border border-emerald-250 bg-emerald-50 px-3 py-2 text-xs text-emerald-850">{statusMessage}</div> : null}

        <div className="mt-6 mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">HTML Email Templates (Copy & Paste)</h3>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((tpl) => (
            <div
              key={tpl.label}
              className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              <div>
                <span className="mb-1 block text-xs font-bold text-slate-900">{tpl.label}</span>
                <span className="mb-3 line-clamp-3 text-[10px] leading-relaxed text-slate-500 font-mono">{tpl.message}</span>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <button
                  type="button"
                  onClick={() => useTemplate(tpl)}
                  className="flex-1 rounded border border-emerald-600 bg-white py-1 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Use Template
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, tpl.message)}
                  className="flex-1 rounded bg-slate-100 py-1 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  Copy HTML
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><Smartphone size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">SMS broadcast</h3><p className="mt-1 text-xs leading-normal text-slate-550">Send urgent account and booking alerts.</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><Mail size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">Email campaign</h3><p className="mt-1 text-xs leading-normal text-slate-550">Announce changes and feature updates via HTML emails.</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-700"><ArrowUpRight size={18} className="text-emerald-600" /><h3 className="mt-2 text-xs font-bold text-slate-900">Audit-ready logs</h3><p className="mt-1 text-xs leading-normal text-slate-550">Keep a visible trail for sent announcements.</p></div>
        </div>
      </section>
    </AdminLayout>
  );
}