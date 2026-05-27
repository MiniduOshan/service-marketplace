import React, { useState } from 'react';
import { KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

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

  const handleSave = (event) => {
    event.preventDefault();
    setStatusMessage('Credentials captured in the dashboard UI. Connect this page to the backend settings store to persist them securely.');
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15">
            <KeyRound size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Credentials</h2>
            <p className="text-sm text-slate-400">Store SMS and payment gateway IDs separately from pricing plans.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 xl:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">SMS Sender ID</label>
            <input
              type="text"
              value={form.smsSenderId}
              onChange={(event) => setForm((current) => ({ ...current, smsSenderId: event.target.value }))}
              placeholder="e.g. SKILLEDLK"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">SMS API Key</label>
            <input
              type="password"
              value={form.smsApiKey}
              onChange={(event) => setForm((current) => ({ ...current, smsApiKey: event.target.value }))}
              placeholder="SMS provider API key"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">SMS API Secret</label>
            <input
              type="password"
              value={form.smsApiSecret}
              onChange={(event) => setForm((current) => ({ ...current, smsApiSecret: event.target.value }))}
              placeholder="SMS provider secret"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">Payment Gateway ID</label>
            <input
              type="text"
              value={form.paymentGatewayId}
              onChange={(event) => setForm((current) => ({ ...current, paymentGatewayId: event.target.value }))}
              placeholder="e.g. stripe_merchant_123"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">Payment Gateway Secret</label>
            <input
              type="password"
              value={form.paymentGatewaySecret}
              onChange={(event) => setForm((current) => ({ ...current, paymentGatewaySecret: event.target.value }))}
              placeholder="Gateway secret"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">Webhook Secret</label>
            <input
              type="password"
              value={form.webhookSecret}
              onChange={(event) => setForm((current) => ({ ...current, webhookSecret: event.target.value }))}
              placeholder="Webhook signing secret"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="xl:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              <ShieldCheck size={16} />
              Save credentials
            </button>

            <button
              type="button"
              onClick={() => setForm({ smsSenderId: '', smsApiKey: '', smsApiSecret: '', paymentGatewayId: '', paymentGatewaySecret: '', webhookSecret: '' })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCw size={16} />
              Reset
            </button>
          </div>
        </form>

        {statusMessage ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm leading-7 text-slate-300">
          Keep these values out of the public repo by storing them in environment variables or a secure admin settings table on the backend. This page is only the web UI for changing them regularly.
        </div>
      </section>
    </AdminLayout>
  );
}