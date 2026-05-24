import React, { useState } from 'react';
import {
  CheckCircle2,
  CircleDollarSign,
  Info,
  TrendingUp,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';

const proBenefits = [
  'Unlimited skill badge certifications',
  '0% Commission on first 5 monthly jobs',
  'Priority support via dedicated WhatsApp',
  'Advanced analytics for profile views',
  'Instant SMS alerts for new lead invites',
  'Verification badge next to name',
];

const freeComparison = [
  {
    feature: 'Lead Fees',
    free: 'LKR 150 per lead',
    pro: 'Zero Fees',
    proSub: 'Keep 100% of lead price',
  },
  {
    feature: 'Search Visibility',
    free: 'Standard listing',
    pro: 'Priority Ranking',
    proSub: 'Top of search results',
  },
  {
    feature: 'Profile Badge',
    free: 'No special badge',
    pro: "'Featured' Badge",
    proSub: 'Build instant trust',
  },
  {
    feature: 'Monthly Bookings',
    free: 'Limited to 3/mo',
    pro: 'Unlimited',
    proSub: 'Unlimited bookings & leads',
  },
];

const featureRows = [
  { feature: 'Lead Invitations', free: '5 / Month', pro: 'Unlimited' },
  { feature: 'Commission Rate', free: '10%', pro: '5% Fixed' },
  { feature: 'Skill Badges', free: 'Max 2', pro: 'Unlimited' },
  { feature: 'Profile Analytics', free: 'Basic', pro: 'Advanced' },
  { feature: 'Lead Fees', free: 'Pay-per-lead', pro: 'Zero' },
];

function ScoreRow({ label, points }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-emerald-700">{points}</span>
    </div>
  );
}

function PriorityScoreCard({ plan }) {
  const isPro = plan === 'pro';
  const score = isPro ? 87 : 62;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-center text-2xl font-bold text-slate-950">
        Priority Score
      </h2>

      <div
        className="mx-auto mt-7 grid h-32 w-32 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#047857 ${score}%, #f1f5f9 ${score}% 100%)`,
        }}
      >
        <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-white">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-950">{score}%</p>
            <p className="text-xs font-medium text-slate-500">Priority</p>
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {isPro ? (
          <>
            <ScoreRow label="Pro Subscription" points="+25" />
            <ScoreRow label="Response Rate" points="+20" />
            <ScoreRow label="Rating Average" points="+22" />

            <p className="pt-2 text-xs leading-relaxed text-slate-500">
              Top 5% of workers in your category. Increased visibility for
              high-budget jobs.
            </p>
          </>
        ) : (
          <>
            <ScoreRow label="Profile Activity" points="+20" />
            <ScoreRow label="Response Rate" points="+20" />
            <ScoreRow label="Rating Average" points="+22" />

            <p className="pt-2 text-xs leading-relaxed text-slate-500">
              Get <span className="font-bold">+25 points instantly</span> by
              upgrading to Pro and boost your visibility by 3x.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ProPlanHero({ onManageBilling, onCancelPlan }) {
  return (
    <div
      className="rounded-xl p-6 text-white shadow-xl sm:p-7"
      style={{
        background:
          'linear-gradient(135deg, #047857 0%, #047857 45%, #0f766e 100%)',
      }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Pro Plan — Active
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            LKR 2,500/month
          </h2>

          <p className="mt-2 flex items-center gap-2 text-sm text-emerald-50">
            <CircleDollarSign size={16} />
            Next renewal: 15 May 2025
          </p>
        </div>

        <div className="rounded-lg border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-200 text-emerald-700">
              <TrendingUp size={22} />
            </div>

            <div>
              <p className="text-sm font-medium uppercase text-emerald-50">
                Profile Boost
              </p>
              <p className="text-2xl font-bold leading-tight">+25 points</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onManageBilling}
          className="rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
        >
          Manage Billing
        </button>

        <button
          type="button"
          onClick={onCancelPlan}
          className="rounded-lg px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Cancel plan
        </button>
      </div>
    </div>
  );
}

function FreePlanHero({ onUpgrade }) {
  return (
    <div
      className="rounded-xl p-6 text-white shadow-xl sm:p-7"
      style={{
        background:
          'linear-gradient(135deg, #047857 0%, #047857 45%, #0f766e 100%)',
      }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Free Plan — Active
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            LKR 0/month
          </h2>

          <p className="mt-8 max-w-2xl leading-relaxed text-emerald-50">
            You are currently using the limited free tier. Your visibility is
            limited, and lead fees apply to all client bookings.
          </p>

          <p className="mt-5 flex items-center gap-2 text-sm text-emerald-100">
            <Info size={15} />
            LKR 150 per lead fee applies
          </p>
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="inline-flex items-center justify-center gap-3 rounded-lg border border-white/25 bg-white/10 px-8 py-6 text-xl font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          <TrendingUp size={26} />
          Upgrade to PRO
        </button>
      </div>
    </div>
  );
}

function ProBenefitsGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-950">
        What Pro gives you
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {proBenefits.map((benefit) => (
          <div
            key={benefit}
            className="flex items-center gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <CheckCircle2
              size={23}
              className="shrink-0 fill-emerald-700 text-white"
            />

            <p className="leading-relaxed text-slate-700">{benefit}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FreePlanComparison() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-950">Plan Comparison</h2>

      <div className="mt-6 overflow-hidden rounded-lg border border-emerald-900/20 bg-white shadow-sm">
        <div className="grid grid-cols-2 border-b border-emerald-900/20">
          <div className="border-r border-emerald-900/20 px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
            Free Tier
          </div>

          <div className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-emerald-700">
            Pro Tier
          </div>
        </div>

        {freeComparison.map((row) => (
          <div
            key={row.feature}
            className="grid grid-cols-2 border-b border-emerald-900/20 last:border-b-0"
          >
            <div className="border-r border-emerald-900/20 px-6 py-6">
              <p className="font-bold text-slate-950">{row.feature}</p>
              <p className="mt-1 text-sm text-slate-500">{row.free}</p>
            </div>

            <div className="px-6 py-6">
              <p className="font-bold text-emerald-700">{row.pro}</p>
              <p className="mt-1 text-sm text-slate-500">{row.proSub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureTable({ plan }) {
  const isPro = plan === 'pro';

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-3 border-b border-slate-200">
        <div className="px-6 py-6 text-2xl font-bold text-slate-950">
          Features
        </div>

        <div
          className={`relative px-6 py-6 text-center text-2xl font-bold ${
            !isPro ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
          }`}
        >
          FREE

          {!isPro && (
            <span className="absolute right-4 top-3 rounded bg-emerald-700 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
              Active
            </span>
          )}
        </div>

        <div
          className={`relative px-6 py-6 text-center text-2xl font-bold ${
            isPro ? 'bg-emerald-100 text-emerald-700' : 'text-emerald-700'
          }`}
        >
          PRO

          {isPro && (
            <span className="absolute right-4 top-3 rounded bg-emerald-700 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
              Active
            </span>
          )}
        </div>
      </div>

      {featureRows.map((row) => (
        <div
          key={row.feature}
          className="grid grid-cols-3 border-b border-slate-100 last:border-b-0"
        >
          <div className="px-6 py-6 font-medium text-slate-700">
            {row.feature}
          </div>

          <div
            className={`px-6 py-6 text-center font-bold ${
              !isPro ? 'bg-emerald-50 text-slate-950' : 'text-slate-500'
            }`}
          >
            {row.free}
          </div>

          <div
            className={`px-6 py-6 text-center font-bold ${
              isPro ? 'bg-emerald-50 text-slate-950' : 'text-slate-700'
            }`}
          >
            {row.pro}
          </div>
        </div>
      ))}
    </section>
  );
}

function LeadFeeModelCard({ plan }) {
  const isPro = plan === 'pro';
  const enabled = !isPro;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-slate-950">Lead Fee Model</h2>

        <button
          type="button"
          disabled
          className={`relative h-7 w-14 cursor-not-allowed rounded-full transition ${
            enabled ? 'bg-emerald-700' : 'bg-slate-300'
          }`}
          aria-label="Lead fee model status"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              enabled ? 'left-8' : 'left-1'
            }`}
          />
        </button>
      </div>

      <p className="mt-5 text-sm font-medium leading-relaxed text-slate-600">
        {isPro ? (
          <>
            Pay-per-lead option is currently{' '}
            <span className="font-bold text-slate-800">Inactive</span> because
            you are a Pro Member. You get all lead invitations for free.
          </>
        ) : (
          <>
            Pay-per-lead option is currently{' '}
            <span className="font-bold text-slate-800">Active</span> because
            you are using the Free Plan. Lead fees apply when customer inquiries
            are received.
          </>
        )}
      </p>
    </div>
  );
}

function BillingModal({ onClose, onCancelPlan }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-950">Manage Billing</h2>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Current card</p>
          <p className="mt-1 font-bold text-slate-950">Visa ending in 8902</p>
          <p className="mt-1 text-sm text-slate-500">
            Next charge: LKR 2,500 on 15 May 2025
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            className="rounded-lg border border-emerald-700 px-5 py-3 font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Update Payment Method
          </button>

          <button
            type="button"
            onClick={onCancelPlan}
            className="rounded-lg border border-red-200 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50"
          >
            Cancel Pro Plan
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-slate-100 px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function WorkerSubscription() {
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const isPro = currentPlan === 'pro';

  function handleUpgrade() {
    setCurrentPlan('pro');
  }

  function handleCancelPlan() {
    setCurrentPlan('free');
    setBillingModalOpen(false);
  }

  return (
    <WorkerLayout>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,760px)_320px] 2xl:grid-cols-[minmax(0,820px)_340px]">
          <main className="space-y-9">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Subscription & Plan
              </h1>
              <p className="mt-2 text-slate-500">
                Manage your professional presence and billing cycles.
              </p>
            </div>

            {isPro ? (
              <ProPlanHero
                onManageBilling={() => setBillingModalOpen(true)}
                onCancelPlan={handleCancelPlan}
              />
            ) : (
              <FreePlanHero onUpgrade={handleUpgrade} />
            )}

            {isPro ? <ProBenefitsGrid /> : <FreePlanComparison />}

            <FeatureTable plan={currentPlan} />
          </main>

          <aside className="space-y-6">
            <PriorityScoreCard plan={currentPlan} />
            <LeadFeeModelCard plan={currentPlan} />
          </aside>
        </div>
      </div>

      {billingModalOpen && (
        <BillingModal
          onClose={() => setBillingModalOpen(false)}
          onCancelPlan={handleCancelPlan}
        />
      )}
    </WorkerLayout>
  );
}