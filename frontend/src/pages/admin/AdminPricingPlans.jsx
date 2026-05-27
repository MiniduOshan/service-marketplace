import React, { useEffect, useState } from 'react';
import { CircleDollarSign, Edit3, RefreshCw, Trash2, Check } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

const privilegeOptions = [
  { key: 'chat', label: 'Chat access' },
  { key: 'bookings', label: 'Booking access' },
  { key: 'featuredProfile', label: 'Featured profile' },
  { key: 'prioritySupport', label: 'Priority support' },
  { key: 'smsNotifications', label: 'SMS notifications' },
  { key: 'emailNotifications', label: 'Email notifications' },
];

export default function AdminPricingPlans() {
  const [plans, setPlans] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    price: '',
    billing: 'Monthly',
    status: 'Active',
    privileges: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const normalizePlan = (plan) => ({
    id: plan.id,
    title: plan.title,
    description: plan.description || '',
    price: Number(plan.price ?? 0),
    billing: plan.billing_cycle || 'Monthly',
    status: plan.status || 'Active',
    privileges: Array.isArray(plan.privileges) ? plan.privileges : [],
  });

  const loadPlans = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/admin/pricing-plans');
      setPlans(Array.isArray(response.data) ? response.data.map(normalizePlan) : []);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load pricing plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const resetDraft = () => {
    setEditingPlanId(null);
    setDraft({
      title: '',
      description: '',
      price: '',
      billing: 'Monthly',
      status: 'Active',
      privileges: [],
    });
  };

  const handlePrivilegeToggle = (privilegeKey) => {
    setDraft((current) => {
      const hasPrivilege = current.privileges.includes(privilegeKey);
      return {
        ...current,
        privileges: hasPrivilege
          ? current.privileges.filter((item) => item !== privilegeKey)
          : [...current.privileges, privilegeKey],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!draft.title.trim() || !draft.price) {
      setStatusMessage('Plan title and price are required.');
      return;
    }

    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim() || 'System pricing plan offered to users.',
      price: Number(draft.price),
      billing_cycle: draft.billing,
      status: draft.status,
      privileges: draft.privileges,
    };

    try {
      if (editingPlanId) {
        await apiRequest(`/admin/pricing-plans/${editingPlanId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setStatusMessage('Pricing plan updated.');
      } else {
        await apiRequest('/admin/pricing-plans', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setStatusMessage('Pricing plan added.');
      }

      await loadPlans();
      resetDraft();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save pricing plan.');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlanId(plan.id);
    setDraft({
      title: plan.title,
      description: plan.description,
      price: String(plan.price),
      billing: plan.billing,
      status: plan.status,
      privileges: plan.privileges || [],
    });
    setStatusMessage(`Editing ${plan.title}.`);
  };

  const handleDelete = (planId) => {
    apiRequest(`/admin/pricing-plans/${planId}`, { method: 'DELETE' })
      .then(async () => {
        if (editingPlanId === planId) {
          resetDraft();
        }
        setStatusMessage('Pricing plan deleted.');
        await loadPlans();
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Failed to delete pricing plan.');
      });
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

  const draftPrivilegeSet = new Set(draft.privileges);

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15"><CircleDollarSign size={22} /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Pricing Plans</h2>
            <p className="text-sm text-slate-400">Add system pricing plans after the free usage period ends.</p>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm leading-7 text-emerald-50">
          <p className="font-semibold">Free usage</p>
          <p className="mt-1 text-emerald-50/90">
            First months can stay free for everyone. If you do not add any pricing plan, users will keep full access and will not see a paid plan screen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Plan title</label>
              <input
                type="text"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder="e.g. Pro"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Billing cycle</label>
              <select
                value={draft.billing}
                onChange={(event) => setDraft((current) => ({ ...current, billing: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Plan description</label>
              <input
                type="text"
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                placeholder="What this plan includes"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Price</label>
              <input
                type="number"
                min="0"
                value={draft.price}
                onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))}
                placeholder="0"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Status</label>
              <select
                value={draft.status}
                onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              >
                <option>Active</option>
                <option>Popular</option>
                <option>Premium</option>
                <option>Draft</option>
              </select>
            </div>

          </div>

          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-200">Included privileges</p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {privilegeOptions.map((privilege) => {
                const checked = draftPrivilegeSet.has(privilege.key);

                return (
                  <label
                    key={privilege.key}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      checked
                        ? 'border-emerald-300/20 bg-emerald-400/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handlePrivilegeToggle(privilege.key)}
                      className="h-4 w-4 rounded border-slate-400 text-emerald-600 focus:ring-emerald-400"
                    />
                    <span>{privilege.label}</span>
                    {checked ? <Check size={14} className="ml-auto text-emerald-300" /> : null}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              <RefreshCw size={14} />
              {editingPlanId ? 'Update plan' : 'Add plan'}
            </button>

            {editingPlanId ? (
              <button
                type="button"
                onClick={resetDraft}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        {loading ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            Loading pricing plans...
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}

        {statusMessage ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{plan.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">{plan.status}</span>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">Available after free usage</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <span className="text-slate-400">LKR</span>
                <span className="text-lg font-semibold text-white">{Number(plan.price).toLocaleString()}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(plan.privileges || []).map((privilegeKey) => {
                  const privilegeLabel = privilegeOptions.find((item) => item.key === privilegeKey)?.label || privilegeKey;
                  return (
                    <span key={privilegeKey} className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                      {privilegeLabel}
                    </span>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                <span>{plan.billing}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(plan)}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(plan.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 ring-1 ring-red-300/15"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && plans.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            No pricing plans added yet. Users stay on free access until you add one here.
          </div>
        ) : null}

        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm leading-7 text-emerald-50">
          These are system pricing plans sold to users. Leave this list empty to keep everyone on the free plan during the launch period.
        </div>
      </section>
    </AdminLayout>
  );
}