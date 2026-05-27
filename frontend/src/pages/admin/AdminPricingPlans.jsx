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
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <CircleDollarSign size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Pricing Plans</h2>
            <p className="text-xs text-slate-500">Add system pricing plans after the free usage period ends.</p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-emerald-250 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-800">
          <p className="font-semibold">Free usage</p>
          <p className="mt-0.5 text-emerald-700">
            First months can stay free for everyone. If you do not add any pricing plan, users will keep full access and will not see a paid plan screen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 xl:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Plan title</label>
              <input
                type="text"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder="e.g. Pro"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Billing cycle</label>
              <select
                value={draft.billing}
                onChange={(event) => setDraft((current) => ({ ...current, billing: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Plan description</label>
              <input
                type="text"
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                placeholder="What this plan includes"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Price</label>
              <input
                type="number"
                min="0"
                value={draft.price}
                onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))}
                placeholder="0"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Status</label>
              <select
                value={draft.status}
                onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option>Active</option>
                <option>Popular</option>
                <option>Premium</option>
                <option>Draft</option>
              </select>
            </div>

          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-slate-700">Included privileges</p>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {privilegeOptions.map((privilege) => {
                const checked = draftPrivilegeSet.has(privilege.key);

                return (
                  <label
                    key={privilege.key}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition cursor-pointer ${
                      checked
                        ? 'border-emerald-250 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handlePrivilegeToggle(privilege.key)}
                      className="h-3.5 w-3.5 rounded border-slate-350 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{privilege.label}</span>
                    {checked ? <Check size={12} className="ml-auto text-emerald-600" /> : null}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              <RefreshCw size={12} />
              {editingPlanId ? 'Update plan' : 'Add plan'}
            </button>

            {editingPlanId ? (
              <button
                type="button"
                onClick={resetDraft}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        {loading ? (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Loading pricing plans...
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-55 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {statusMessage ? (
          <div className="mt-3 rounded-lg border border-emerald-250 bg-emerald-55 px-3 py-2 text-xs text-emerald-850">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2.5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{plan.title}</h3>
                    <p className="mt-1 text-[11px] text-slate-500 leading-normal">{plan.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold text-slate-600">{plan.status}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  <span className="text-slate-400 font-medium">LKR</span>
                  <span className="text-sm font-semibold text-slate-950">{Number(plan.price).toLocaleString()}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {(plan.privileges || []).map((privilegeKey) => {
                    const privilegeLabel = privilegeOptions.find((item) => item.key === privilegeKey)?.label || privilegeKey;
                    return (
                      <span key={privilegeKey} className="rounded-full border border-emerald-150 bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
                        {privilegeLabel}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span className="font-medium">{plan.billing}</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(plan)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Edit3 size={11} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(plan.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200/50 px-2.5 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Trash2 size={11} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && plans.length === 0 ? (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
            No pricing plans added yet. Users stay on free access until you add one here.
          </div>
        ) : null}

        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-55 p-4 text-xs leading-relaxed text-emerald-800">
          These are system pricing plans sold to users. Leave this list empty to keep everyone on the free plan during the launch period.
        </div>
      </section>
    </AdminLayout>
  );
}