import React, { useState } from 'react';
import { KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

export default function AdminCredentials() {
  const [form, setForm] = useState({
    smsSenderId: '',
    smsApiKey: '',
    smsApiSecret: '',
    paymentGatewayId: '',
    paymentGatewaySecret: '',
    webhookSecret: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');
    try {
      const response = await apiRequest('/admin/credentials', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setStatusMessage(response.message || 'Credentials saved securely.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save credentials.');
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <KeyRound size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Credentials</h2>
            <p className="text-xs text-slate-500">Store SMS and payment gateway IDs separately from pricing plans.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 xl:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">SMS Sender ID</label>
            <input
              type="text"
              value={form.smsSenderId}
              onChange={(event) => setForm((current) => ({ ...current, smsSenderId: event.target.value }))}
              placeholder="e.g. SKILLEDLK"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">SMS API Key</label>
            <input
              type="password"
              value={form.smsApiKey}
              onChange={(event) => setForm((current) => ({ ...current, smsApiKey: event.target.value }))}
              placeholder="SMS provider API key"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">SMS API Secret</label>
            <input
              type="password"
              value={form.smsApiSecret}
              onChange={(event) => setForm((current) => ({ ...current, smsApiSecret: event.target.value }))}
              placeholder="SMS provider secret"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Payment Gateway ID</label>
            <input
              type="text"
              value={form.paymentGatewayId}
              onChange={(event) => setForm((current) => ({ ...current, paymentGatewayId: event.target.value }))}
              placeholder="e.g. stripe_merchant_123"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Payment Gateway Secret</label>
            <input
              type="password"
              value={form.paymentGatewaySecret}
              onChange={(event) => setForm((current) => ({ ...current, paymentGatewaySecret: event.target.value }))}
              placeholder="Gateway secret"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Webhook Secret</label>
            <input
              type="password"
              value={form.webhookSecret}
              onChange={(event) => setForm((current) => ({ ...current, webhookSecret: event.target.value }))}
              placeholder="Webhook signing secret"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="xl:col-span-2 flex items-center gap-2.5">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              <ShieldCheck size={14} />
              Save credentials
            </button>

            <button
              type="button"
              onClick={() => setForm({ smsSenderId: '', smsApiKey: '', smsApiSecret: '', paymentGatewayId: '', paymentGatewaySecret: '', webhookSecret: '' })}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        </form>

        {errorMessage ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {statusMessage ? (
          <div className="mt-3 rounded-lg border border-emerald-250 bg-emerald-50 px-3 py-2 text-xs text-emerald-850">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-normal text-slate-550">
          Keep these values out of the public repo by storing them in environment variables or a secure admin settings table on the backend. This page is only the web UI for changing them regularly.
        </div>
      </section>
    </AdminLayout>
  );
}