import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BadgeDollarSign,
  CheckCircle2,
  Download,
  ExternalLink,
  ShieldCheck,
  Trash2,
  WalletCards,
  X,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';

const transactions = [
  {
    id: 1,
    date: 'Apr 22, 2026',
    service: 'Plumbing',
    customer: 'TechCorp Inc.',
    amount: 'LKR 12,000',
    status: 'Completed',
  },
  {
    id: 2,
    date: 'Apr 18, 2026',
    service: 'Room Painting',
    customer: 'Sara Jay',
    amount: 'LKR 4,500',
    status: 'Completed',
  },
  {
    id: 3,
    date: 'Apr 15, 2026',
    service: 'AC Repair',
    customer: 'DevStudio',
    amount: 'LKR 8,000',
    status: 'Canceled',
  },
  {
    id: 4,
    date: 'Apr 10, 2026',
    service: 'Plumbing',
    customer: 'Lanka Retail',
    amount: 'LKR 17,500',
    status: 'Completed',
  },
];

const initialBankAccounts = [
  {
    id: 1,
    bankName: 'Commercial Bank of Ceylon',
    accountType: 'Savings Account',
    accountHolder: 'Kasun Silva',
    accountNumber: '45678908902',
    branch: 'Maharagama',
    isPrimary: true,
  },
  {
    id: 2,
    bankName: 'Bank of Ceylon',
    accountType: 'Current Account',
    accountHolder: 'Kasun Silva',
    accountNumber: '78945612301',
    branch: 'Colombo 07',
    isPrimary: false,
  },
];

function formatMaskedAccount(accountNumber) {
  if (!accountNumber) return '••••';
  return `•••• ${accountNumber.slice(-4)}`;
}

function StatCard({ icon: Icon, iconClassName, label, value }) {
  return (
    <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className={`grid h-14 w-14 place-items-center rounded-full ${iconClassName}`}>
          <Icon size={25} />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isCompleted = status.toLowerCase() === 'completed';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
        isCompleted
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-red-100 text-red-600'
      }`}
    >
      {status}
    </span>
  );
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-72px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function BankAccountForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [formData, setFormData] = useState({
    bankName: initialData?.bankName || '',
    accountType: initialData?.accountType || 'Savings Account',
    accountHolder: initialData?.accountHolder || '',
    accountNumber: initialData?.accountNumber || '',
    branch: initialData?.branch || '',
  });

  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.bankName.trim()) nextErrors.bankName = 'Bank name is required';
    if (!formData.accountHolder.trim()) {
      nextErrors.accountHolder = 'Account holder name is required';
    }
    if (!/^\d{8,16}$/.test(formData.accountNumber.trim())) {
      nextErrors.accountNumber = 'Enter a valid account number';
    }
    if (!formData.branch.trim()) nextErrors.branch = 'Branch is required';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...formData,
      accountNumber: formData.accountNumber.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Bank Name
          </label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(event) => updateField('bankName', event.target.value)}
            placeholder="Commercial Bank of Ceylon"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
          {errors.bankName && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.bankName}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Account Type
          </label>
          <select
            value={formData.accountType}
            onChange={(event) => updateField('accountType', event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option>Savings Account</option>
            <option>Current Account</option>
            <option>Business Account</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Account Holder Name
          </label>
          <input
            type="text"
            value={formData.accountHolder}
            onChange={(event) => updateField('accountHolder', event.target.value)}
            placeholder="Kasun Silva"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
          {errors.accountHolder && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.accountHolder}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Account Number
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(event) =>
              updateField('accountNumber', event.target.value.replace(/\D/g, ''))
            }
            placeholder="45678908902"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
          {errors.accountNumber && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.accountNumber}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Branch
          </label>
          <input
            type="text"
            value={formData.branch}
            onChange={(event) => updateField('branch', event.target.value)}
            placeholder="Maharagama"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
          {errors.branch && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.branch}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Make sure the account holder name matches your verified worker profile name.
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function ManageBankModal({
  accounts,
  selectedAccountId,
  onSelectPrimary,
  onEditAccount,
  onAddAccount,
  onRemoveAccount,
  onClose,
}) {
  return (
    <ModalShell title="Manage Bank Accounts" onClose={onClose}>
      <div className="space-y-4 px-6 py-6">
        {accounts.map((account) => {
          const isSelected = selectedAccountId === account.id;
          const canRemove = accounts.length > 1;

          return (
            <div
              key={account.id}
              className={`rounded-xl border p-4 transition ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-lg border border-slate-200 bg-white text-emerald-700">
                    <ShieldCheck size={24} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-950">
                        {account.bankName}
                      </h3>

                      {isSelected && (
                        <span className="rounded-full bg-emerald-700 px-3 py-0.5 text-[10px] font-bold uppercase text-white">
                          Primary
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {account.accountType} •{' '}
                      {formatMaskedAccount(account.accountNumber)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Holder: {account.accountHolder} • Branch: {account.branch}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onEditAccount(account)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectPrimary(account.id)}
                    disabled={isSelected}
                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                      isSelected
                        ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Set Primary'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveAccount(account.id)}
                    disabled={!canRemove}
                    className={`inline-flex items-center justify-center gap-1 rounded-lg border px-4 py-2 text-sm font-bold transition ${
                      canRemove
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'cursor-not-allowed border-slate-200 text-slate-400'
                    }`}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={onAddAccount}
          className="w-full rounded-xl border border-dashed border-emerald-600 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
        >
          + Add New Bank Account
        </button>
      </div>
    </ModalShell>
  );
}

export default function WorkerEarnings() {
  const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
  const [selectedAccountId, setSelectedAccountId] = useState(1);
  const [activeModal, setActiveModal] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [withdrawStatus, setWithdrawStatus] = useState('');

  const selectedAccount = useMemo(
    () => bankAccounts.find((account) => account.id === selectedAccountId),
    [bankAccounts, selectedAccountId]
  );

  function closeModal() {
    setActiveModal(null);
    setEditingAccount(null);
  }

  function handleAddAccount(accountData) {
    const newAccount = {
      id: Date.now(),
      ...accountData,
      isPrimary: false,
    };

    setBankAccounts((current) => [...current, newAccount]);
    setSelectedAccountId(newAccount.id);
    closeModal();
  }

  function handleUpdateAccount(accountData) {
    setBankAccounts((current) =>
      current.map((account) =>
        account.id === editingAccount.id ? { ...account, ...accountData } : account
      )
    );

    closeModal();
  }

  function handleSelectPrimary(accountId) {
    setSelectedAccountId(accountId);
    setBankAccounts((current) =>
      current.map((account) => ({
        ...account,
        isPrimary: account.id === accountId,
      }))
    );
  }

  function handleRemoveAccount(accountId) {
    setBankAccounts((current) => {
      if (current.length <= 1) return current;

      const filteredAccounts = current.filter((account) => account.id !== accountId);

      if (selectedAccountId === accountId && filteredAccounts.length > 0) {
        setSelectedAccountId(filteredAccounts[0].id);
        return filteredAccounts.map((account, index) => ({
          ...account,
          isPrimary: index === 0,
        }));
      }

      return filteredAccounts;
    });
  }

  function handleWithdrawFunds() {
    setWithdrawStatus(
      `Withdrawal request created for LKR 42,000 to ${
        selectedAccount?.bankName || 'your bank account'
      }.`
    );

    window.setTimeout(() => {
      setWithdrawStatus('');
    }, 4000);
  }

  function downloadCSV() {
    const headers = ['Date', 'Service', 'Customer', 'Amount', 'Status'];
    const rows = transactions.map((transaction) => [
      transaction.date,
      transaction.service,
      transaction.customer,
      transaction.amount,
      transaction.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const temporaryLink = document.createElement('a');

    temporaryLink.href = url;
    temporaryLink.download = 'skilledlk-earnings-april-2025.csv';
    temporaryLink.click();

    URL.revokeObjectURL(url);
  }

  return (
    <WorkerLayout>
      <div className="mx-auto w-full max-w-[1560px]">
        <section
          className="rounded-xl p-7 text-white shadow-xl sm:p-9 xl:p-10"
          style={{
            background:
              'linear-gradient(135deg, #047857 0%, #047857 45%, #059669 100%)',
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-emerald-100">
                Total Earned - April 2025
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                LKR 42,000
              </h1>

              <p className="mt-4 flex items-center gap-2 text-emerald-100">
                <ArrowUpRight size={17} />
                +14% from last month
              </p>
            </div>

            <button
              type="button"
              onClick={handleWithdrawFunds}
              className="rounded-lg bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
            >
              Withdraw Funds
            </button>
          </div>
        </section>

        {withdrawStatus && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
            {withdrawStatus}
          </div>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <StatCard
            icon={CheckCircle2}
            iconClassName="bg-emerald-200 text-emerald-700"
            label="Jobs Done"
            value="12"
          />

          <StatCard
            icon={BadgeDollarSign}
            iconClassName="bg-red-100 text-red-600"
            label="Fees Paid"
            value="LKR 2,500"
          />

          <StatCard
            icon={WalletCards}
            iconClassName="bg-emerald-700 text-white"
            label="Net Received"
            value="LKR 39,500"
          />
        </section>

        <section className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="space-y-7">
            <div className="overflow-hidden rounded-xl border border-emerald-900/20 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-slate-950">
                  Transaction History
                </h2>

                <button
                  type="button"
                  onClick={downloadCSV}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
                >
                  <Download size={16} />
                  Download CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead className="bg-slate-100 text-sm uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold">Service</th>
                      <th className="px-6 py-4 font-bold">Customer</th>
                      <th className="px-6 py-4 font-bold">Amount</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="text-sm">
                        <td className="px-6 py-5 font-medium text-slate-700">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-950">
                          {transaction.service}
                        </td>
                        <td className="px-6 py-5 text-slate-600">
                          {transaction.customer}
                        </td>
                        <td className="px-6 py-5 font-medium text-slate-800">
                          {transaction.amount}
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={transaction.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                Bank Account
              </h2>

              <div className="mt-5 rounded-xl border border-dashed border-slate-400 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-14 place-items-center rounded border border-slate-300 bg-white text-emerald-700">
                      <ShieldCheck size={26} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {selectedAccount?.bankName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {selectedAccount?.accountType} •{' '}
                        {formatMaskedAccount(selectedAccount?.accountNumber)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal('manage')}
                    className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-7">
            <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                Financial Summary
              </h2>

              <div className="mt-4 border-t border-slate-300 pt-4">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Gross Revenue</span>
                    <span className="font-medium text-slate-950">
                      LKR 44,500
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Commission (5%)</span>
                    <span className="font-medium text-red-600">
                      - LKR 2,225
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Lead Fees</span>
                    <span className="font-medium text-red-600">- LKR 275</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="font-bold text-slate-950">Net Earnings</span>
                    <span className="font-bold text-emerald-700">
                      LKR 42,000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                  <BadgeDollarSign size={22} className="text-amber-500" />
                  Pro Plan
                </h2>

                <span className="rounded bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase text-amber-600">
                  Active
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-600">
                Next billing date:{' '}
                <span className="font-bold text-slate-950">May 12, 2025</span>
              </p>

              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-slate-700">
                You're saving 15% on lead fees this month with your Pro membership.
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-lg border border-emerald-700 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Manage Subscription
              </button>
            </div>

            <div className="rounded-xl border border-emerald-900/20 bg-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Need help?</h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Facing issues with your withdrawal? Our support team is here to
                help 24/7.
              </p>

              <button
                type="button"
                className="mt-5 inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
              >
                Visit Help Center
                <ExternalLink size={15} />
              </button>
            </div>
          </aside>
        </section>
      </div>

      {activeModal === 'manage' && (
        <ManageBankModal
          accounts={bankAccounts}
          selectedAccountId={selectedAccountId}
          onSelectPrimary={handleSelectPrimary}
          onRemoveAccount={handleRemoveAccount}
          onEditAccount={(account) => {
            setEditingAccount(account);
            setActiveModal('edit');
          }}
          onAddAccount={() => {
            setEditingAccount(null);
            setActiveModal('add');
          }}
          onClose={closeModal}
        />
      )}

      {activeModal === 'add' && (
        <ModalShell title="Add Bank Account" onClose={closeModal}>
          <BankAccountForm
            submitLabel="Add Account"
            onSubmit={handleAddAccount}
            onCancel={closeModal}
          />
        </ModalShell>
      )}

      {activeModal === 'edit' && (
        <ModalShell title="Edit Bank Account" onClose={closeModal}>
          <BankAccountForm
            initialData={editingAccount}
            submitLabel="Save Changes"
            onSubmit={handleUpdateAccount}
            onCancel={closeModal}
          />
        </ModalShell>
      )}
    </WorkerLayout>
  );
}